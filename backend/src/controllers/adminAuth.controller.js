// Pag-import sa database connection pool gikan sa config file
import { pool } from '../db/config.js';

// Pag-import sa validationResult function gikan sa express-validator para sa input validation
import { validationResult } from 'express-validator'

// Pag-import sa function nga mo-hash sa password
import { hashPassword } from '../lib/index.js'

// Function para mag-signup og bag-ong admin
export const signupAdmin = async (req, res) => {

    // Pag-validate sa inputs gikan sa express-validator middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Kung naa’y validation errors, i-return og 400 bad request
        return res.status(400).json({
            status: "failed",
            errors: errors.array()
        });
    }

    try {
        // Pagkuha sa mga fields gikan sa request body
        const {
            first_name,
            last_name,
            email,
            organization,
            position,
            password,
            role
        } = req.body;

        // Pag-check kung naay kulang nga field
        if (!first_name || !last_name || !email || !organization || !position || !password || !role) {
            return res.status(400).json({
                status: "failed",
                message: "Provide Required Fields!",
            });
        }

        // Mga roles nga gitugotan lang: super ug natural SK admin
        const allowedRoles = ["super_sk_admin", "natural_sk_admin"];

        // Kung dili valid ang role nga gi-provide, mo-return og error
        if (!allowedRoles.includes(role)) {
            console.log("Invalid role: ", role, "Allowed: ", allowedRoles);
            return res.status(409).json({ // Naay typo sa imong code: remove the comma (,) after 409
                status: "failed",
                message: `Invalid role. Allowed roles are: ${allowedRoles.join(", ")}`
            });
        }

        // Pag-check kung naay existing admin nga parehas og email
        const adminExist = await pool.query({
            text: `SELECT EXISTS (SELECT * FROM sk_official_admin WHERE email = $1) AS exists`,
            values: [email]
        });

        // Kung ang email address gigamit na, mo-return og 409 conflict
        if (adminExist.rows[0].exists) {
            return res.status(409).json({
                status: "failed",
                message: "Email Address already taken"
            });
        }

        // I-hash ang password para sa security
        const hashedPassword = await hashPassword(password);

        // Pag-insert sa bagong admin record sa database
        const result = await pool.query({
            text: `INSERT INTO sk_official_admin (
                first_name,
                last_name,
                email,
                organization,
                position,
                "password",
                role
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7
            ) RETURNING *`,
            values: [
                first_name,
                last_name,
                email,
                organization,
                position,
                hashedPassword,
                role
            ],
        });

        // Pagkuha sa result ug pagtangtang sa password field para dili maapil sa response
        const newUser = result.rows[0];
        delete newUser.password;

        // Pagbalik og 201 Created response ug ang detalye sa bagong admin
        res.status(201).json({
            status: "success",
            message: "Admin account created successfully",
            user: newUser
        });

    } catch (error) {
        // Error handling kung naay problema sa signup
        console.log("Signup error.", error);
        res.status(500).json({
            status: "failed",
            message: "An error occurred while creating admin account",
            error: error.message
        });
    };
};
