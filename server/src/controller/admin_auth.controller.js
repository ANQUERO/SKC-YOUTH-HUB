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

