import { pool } from '../db/config.js';
import { comparePassword, hashPassword, createToken } from '../lib/index.js'

export const signupAdmin = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            organization,
            password,
            role
        } = req.body;

        if (![first_name,
            last_name,
            email,
            organization,
            password,
            role].some(Boolean)) {
            return res.status(404).json({
                status: "failed",
                message: "Provide Required Fields!",
            });
        }

        const adminExist = await pool.query({
            text: `SELECT EXISTS (SELECT * FROM sk_official_admin WHERE email = $1)`,
            values: [email],
        });

        if (adminExist.rows[0].adminExist) {
            return res.status(409).json({
                status: "failed",
                message: "Email Address already taken",
            });
        };

        const hashedPassword = await hashPassword(password);

        const user = await pool.query({
            text: `INSERT INTO sk_official_admin (
            first_name,
            last_name,
            email,
            organization,
            password,
            role
            ) VALUES (
            $1, 
            $2, 
            $3, 
            $4, 
            $5, 
            $6
            ) RETURNING * `,
            values: [
                first_name,
                last_name,
                email,
                organization,
                hashedPassword,
                role
            ],
        });

        user.rows[0].password = undefined

        res.status(201).json({
            status: "success",
            message: "Admin account created successfully",
            user: user.rows[0],
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message
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

