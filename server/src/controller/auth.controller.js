import bcrypt from "bcrypt";
import { generateTokenAndSetCookies } from "../utils/jwt.js";
import { validationErrors } from "../utils/validators.js";
import { validationResult } from "express-validator";
import { pool } from '../db/config.js'

export const signupAdmin = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            position,
            password,
            role
        } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: validationErrors(errors) });
        }

        // Check if email already exists
        const existing = await pool.query(
            'SELECT admin_id FROM sk_official_admin WHERE email = $1',
            [email]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ errors: { email: "Email already exists" } });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new admin
        const insertQuery = `
      INSERT INTO sk_official_admin (first_name, last_name, email, position, password, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING admin_id, first_name, last_name, email, position, role
    `;

        const result = await pool.query(insertQuery, [
            first_name,
            last_name,
            email,
            position,
            hashedPassword,
            role
        ]);

        const newAdmin = result.rows[0];

       //Pass userId and userType
        generateTokenAndSetCookies(newAdmin, res, 'admin');

        return res.status(201).json({
            message: "Admin registered successfully",
            admin: newAdmin
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};


export const signup = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const {
            email, password,
            first_name, middle_name, last_name, suffix,
            region, province, municipality, barangay, purok_id,
            gender, age, contact, birthday,
            civil_status, youth_age_gap, youth_classification, educational_background, work_status,
            registered_voter, registered_national_voter, vote_last_election,
            attended, times_attended, reason_not_attend,
            household
        } = req.body;

        const file = req.file;

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into sk_youth
        const youthResult = await client.query(`
      INSERT INTO sk_youth (email, password)
      VALUES ($1, $2) RETURNING youth_id;
    `, [email, hashedPassword]);

        const youth_id = youthResult.rows[0].youth_id;

        // Insert name
        await client.query(`
      INSERT INTO sk_youth_name (youth_id, first_name, middle_name, last_name, suffix)
      VALUES ($1, $2, $3, $4, $5);
    `, [youth_id, first_name, middle_name, last_name, suffix]);

        // Location
        await client.query(`
      INSERT INTO sk_youth_location (youth_id, region, province, municipality, barangay, purok_id)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [youth_id, region, province, municipality, barangay, purok_id]);

        // Gender
        await client.query(`
      INSERT INTO sk_youth_gender (youth_id, gender)
      VALUES ($1, $2);
    `, [youth_id, gender]);

        // Info
        await client.query(`
      INSERT INTO sk_youth_info (youth_id, age, contact, birthday)
      VALUES ($1, $2, $3, $4);
    `, [youth_id, age, contact, birthday]);

        // Demographics
        await client.query(`
      INSERT INTO sk_youth_demographics (youth_id, civil_status, youth_age_gap, youth_classification, educational_background, work_status)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [youth_id, civil_status, youth_age_gap, youth_classification, educational_background, work_status]);

        // Voter survey
        await client.query(`
      INSERT INTO sk_youth_survey (youth_id, registered_voter, registered_national_voter, vote_last_election)
      VALUES ($1, $2, $3, $4);
    `, [youth_id, registered_voter, registered_national_voter, vote_last_election]);

        // Meeting attendance
        await client.query(`
      INSERT INTO sk_youth_meeting_survey (youth_id, attended, times_attended, reason_not_attend)
      VALUES ($1, $2, $3, $4);
    `, [youth_id, attended, times_attended, reason_not_attend]);

        // Household
        await client.query(`
      INSERT INTO sk_youth_household (youth_id, household)
      VALUES ($1, $2);
    `, [youth_id, household]);

        // Attachment
        if (file) {
            await client.query(`
        INSERT INTO sk_youth_attachments (youth_id, file_name, file_type, file_url)
        VALUES ($1, $2, $3, $4);
      `, [youth_id, file.originalname, file.mimetype, `/uploads/${file.filename}`]);
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Signup completed successfully', youth_id });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Signup failed' });
    } finally {
        client.release();
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(validationErrors(errors));
        }

        // Try admin table first
        let result = await pool.query(
            "SELECT * FROM sk_official_admin WHERE email = $1",
            [email]
        );

        let user = null;
        let userType = null;
        let idField = null;

        if (result.rows.length > 0) {
            user = result.rows[0];
            userType = "admin";
            idField = "admin_id";
        } else {
            // Try youth table
            result = await pool.query(
                "SELECT * FROM sk_youth WHERE email = $1 AND deleted_at IS NULL",
                [email]
            );

            if (result.rows.length > 0) {
                user = result.rows[0];
                userType = "youth";
                idField = "youth_id";
            }
        }

        if (!user) {
            return res.status(401).json({
                errors: { email: "Invalid credentials" }
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                errors: { password: "Invalid credentials" }
            });
        }

        // Sign token and set cookie
        generateTokenAndSetCookies(user, res, userType);

        // Return user data (safe)
        const responseUser = {
            id: user[idField],
            email: user.email,
            userType
        };

        if (userType === "admin") {
            Object.assign(responseUser, {
                first_name: user.first_name,
                last_name: user.last_name,
                position: user.position,
                role: user.role
            });
        } else if (userType === "youth") {
            Object.assign(responseUser, {
                verified: user.verified,
                is_active: user.is_active,
                comment_status: user.comment_status
            });
        }

        console.log('User Data:', result.rows[0])

        return res.status(200).json({
            message: "Login successful",
            user: responseUser
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};


export const logout = (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });

    return res.status(200).json({
        message: "Logged out successfully"
    });
}