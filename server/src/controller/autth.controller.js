import bcrypt from "bcrypt";
import { generateTokenAndSetCookies } from "../utils/jwt";
import { validationErrors } from "../utils/validators";
import { validationResult } from "express-validator";
import { pool } from '../db/config.js'

export const signup = async (req, res) => {
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
            'SELECT id FROM sk_official_admin WHERE email = $1',
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
      RETURNING id, first_name, last_name, email, position, role
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

        // Generate token and set cookies
        generateTokenAndSetCookies(newAdmin, res);

        return res.status(201).json({
            message: "Admin registered successfully",
            admin: newAdmin
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

export const userSignup = async (req, res) => {
    try {
        const [
            fist_name,
            last_name,
            middle_name,
            

        ] = req.body;

    } catch (error) {

    }
}

export const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(validationErrors(errors));
        }

        const result = await pool.query(
            "SELECT * FROM sk_official_admin WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                errors: {
                    email: "Invalid credetials"
                }
            });
        }

        const admin = result.rows[0]

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                error: {
                    password: "Invalid Credentials"
                }
            });
        }

        generateTokenAndSetCookies(admin, res);

        return res.status(200).json({
            message: "Login successful",
            admin: {
                id: admin.id,
                first_name: admin.first_name,
                last_name: admin.last_name,
                email: admin.email,
                position: admin.position,
                role: admin.role
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500), json({
            error: "Server error"
        });
    }
}

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