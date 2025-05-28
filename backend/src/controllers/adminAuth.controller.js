import { pool } from '../db/config.js';
import { validationResult } from 'express-validator'
import { comparePassword, hashPassword, createToken } from '../lib/index.js'

export const signupAdmin = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "failed",
            errors: errors.array()
        });
    }

    try {
        const {
            first_name,
            last_name,
            email,
            organization,
            position,
            password,
            role
        } = req.body;

        if (!first_name || !last_name || !email || !organization || !position || !password || !role) {
            return res.status(400).json({
                status: "failed",
                message: "Provide Required Fields!",
            });
        }

        const allowedRoles = ["super_sk_admin", "natural_sk_admin"];
        if (!allowedRoles.includes(role)) {
            console.log("Invalid role: ", role, "Allowed: ", allowedRoles);
            return res.status(409),json({
                status: "failed",
                message: `Invalid role. Allowed roles are: ${allowedRoles.join(", ")}`
            });
        }

        const adminExist = await pool.query({
            text: `SELECT EXISTS (SELECT * FROM sk_official_admin WHERE email = $1) AS exists`,
            values: [email]
        });

        if (adminExist.rows[0].exists) {
            return res.status(409).json({
                status: "failed",
                message: "Email Address already taken"
            });
        }

        const hashedPassword = await hashPassword(password);

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

        const newUser = result.rows[0];
        delete newUser.password;

        res.status(201).json({
            status: "success",
            message: "Admin account created successfully",
            user: newUser
        });

    } catch (error) {
        console.log("Signup error.", error);
        res.status(500).json({
            status: "failed",
            message: "An error occurred while creating admin account",
            error: error.message
        });
    };
};

export const signinAdmin = async (req, res) => {
    
    try {
        const { email, password } = req.body;

        if (!(email || password)) {
            return res.status(404).json({
                status: "failed",
                message: "Provide Required Fields!",
            });
        };

        const result = await pool.query({
            text: `SELECT * FROM sk_official_admin WHERE email = $1`,
            values: [email],
        });

        const admin = result.rows[0];

        if (!admin) {
            return res.status(404).json({
                status: "failed",
                message: "Invalid Email or Password",
            });
        };

        const isMatch = await comparePassword(password, admin?.password);

        if (!isMatch) {
            return res.status(404).json({
                status: "failed",
                message: "Invalid Email or Password",
            });
        };

        const token = createToken(admin.id);

        admin.password = undefined;
        res.status(200).json({
            status: "success",
            message: "Signin successfully",
            admin,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message
        });
    };
};

export const logout = async (req, res) => {
    try {
        const { id } = req.params;

        return res.status(200).json({
            status: "success",
            message: ""
        })


    } catch (error) {

    }
}

