import { validationResult } from 'express-validator';
import { hashPassword } from '../lib/index.js';
import supabase from '../db/config.js';

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
            return res.status(409).json({
                status: "failed",
                message: `Invalid role. Allowed roles are: ${allowedRoles.join(", ")}`
            });
        }

        const { data: existingAdmin, error: checkError } = await supabase
            .from('sk_official_admin')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (checkError) throw checkError;

        if (existingAdmin) {
            return res.status(409).json({
                status: "failed",
                message: "Email Address already taken"
            });
        }

        const hashedPassword = await hashPassword(password);

        const { data: newAdmin, error: insertError } = await supabase
            .from('sk_official_admin')
            .insert([{
                first_name,
                last_name,
                email,
                organization,
                position,
                password: hashedPassword,
                role
            }])
            .select()
            .maybeSingle();

        if (insertError) throw insertError;

        delete newAdmin.password;

        res.status(201).json({
            status: "success",
            message: "Admin account created successfully",
            user: newAdmin
        });

    } catch (error) {
        console.error("Signup error.", error);
        res.status(500).json({
            status: "failed",
            message: "An error occurred while creating admin account",
            error: error.message
        });
    }
};
