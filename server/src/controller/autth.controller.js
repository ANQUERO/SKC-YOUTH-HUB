import bcrypt from "bcrypt";
import { generateTokenAndSetCookies } from "../utils/jwt";
import { validationErrors } from "../utils/validators";
import { validationResult } from "express-validator";
import { pool } from '../db/config.js'

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