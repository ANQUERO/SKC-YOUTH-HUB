import bcrypt from "bcrypt";
import { generateTokenAndSetCookies } from "../utils/jwt.js";
import { validationErrors } from "../utils/validators.js";
import { validationResult } from "express-validator";
import { pool } from "../db/config.js";
import crypto from "crypto";

export const signupAdmin = async (req, res) => {
    try {
        const {
            email,
            password,
            official_position,
            role,
            first_name,
            middle_name,
            last_name,
            suffix,
            contact_number_number,
            gender,
            age
        } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: validationErrors(errors)
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
            `
            SELECT * FROM signup_official(
            $1, $2, $3, $4,
            $5, $6, $7, $8,
            $9, $10, $11
            )
            `,
            [
                email,
                hashedPassword,
                official_position,
                role,
                first_name,
                middle_name || "",
                last_name,
                suffix || "",
                contact_number_number || "",
                gender || "",
                age
            ]
        );

        const official = result.rows[0];

        generateTokenAndSetCookies(official, res, "official");

        return res.status(201).json({
            message: "SK Official registered successfully",
            official
        });

    } catch (error) {
        console.error("Signup error:", error);

        if (error.message.includes("Email already exists")) {
            return res.status(400).json({
                error: "Email already exists"
            });
        }

        return res.status(500).json({
            error: "Server error"
        });

    }
};

export const resetPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = req.user;

        if (!user) {return res.status(401).json({ message: "Unauthorized" });}

        let table, idField;
        if (user.userType === "official") {
            table = "sk_official";
            idField = "official_id";
        } else if (user.userType === "youth") {
            table = "sk_youth";
            idField = "youth_id";
        } else {
            return res.status(400).json({ message: "Invalid user type" });
        }

        const { rows } = await pool.query(`SELECT password FROM ${table} WHERE ${idField} = $1`, [user[idField]]);
        if (rows.length === 0) {return res.status(404).json({ message: "User not found" });}

        const ok = await bcrypt.compare(currentPassword, rows[0].password);
        if (!ok) {return res.status(400).json({ message: "Current password is incorrect" });}

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        await pool.query(`UPDATE ${table} SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE ${idField} = $2`, [hashed, user[idField]]);

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Reset password error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const signup = async (req, res) => {
    try {
        // Check for validation errors from express-validator BEFORE starting transaction
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: validationErrors(errors)
            });
        }

        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const {
                email, password,
                first_name, middle_name, last_name, suffix,
                region, province, municipality, barangay, purok_id,
                gender, age, contact_number, birthday,
                civil_status, youth_age_gap, youth_classification, educational_background, work_status,
                registered_voter, registered_national_voter, vote_last_election,
                attended, times_attended, reason_not_attend,
                household
            } = req.body;

            // Convert age to number if it's a string (FormData sends everything as strings)
            const ageNum = age ? parseInt(age, 10) : null;

            const hashedPassword = await bcrypt.hash(password, 10);

            // Generate verification token
            const verificationToken = crypto.randomBytes(32).toString("hex");

            // Insert into sk_youth (unverified by default)
            const youthResult = await client.query(`
                INSERT INTO sk_youth (email, password, verified, reset_token, reset_token_expiry)
                VALUES ($1, $2, false, $3, NOW() + INTERVAL '24 hours') RETURNING youth_id;
            `, [email, hashedPassword, verificationToken]);

            const youth_id = youthResult.rows[0].youth_id;

            // Insert name
            await client.query(`
                INSERT INTO sk_youth_name (youth_id, first_name, middle_name, last_name, suffix)
                VALUES ($1, $2, $3, $4, $5);
            `, [youth_id, first_name, middle_name || "", last_name, suffix || ""]);

            // Location
            await client.query(`
                INSERT INTO sk_youth_location (youth_id, region, province, municipality, barangay, purok_id)
                VALUES ($1, $2, $3, $4, $5, $6);
            `, [youth_id, region, province, municipality, barangay, purok_id || null]);

            // Gender
            await client.query(`
                INSERT INTO sk_youth_gender (youth_id, gender)
                VALUES ($1, $2);
            `, [youth_id, gender]);

            // Info
            await client.query(`
                INSERT INTO sk_youth_info (youth_id, age, contact_number, birthday)
                VALUES ($1, $2, $3, $4);
            `, [youth_id, ageNum, contact_number || "", birthday || null]);

            // Demographics
            await client.query(`
                INSERT INTO sk_youth_demographics (youth_id, civil_status, youth_age_gap, youth_classification, educational_background, work_status)
                VALUES ($1, $2, $3, $4, $5, $6);
            `, [youth_id, civil_status, youth_age_gap || "", youth_classification, educational_background, work_status]);

            // Voter survey
            await client.query(`
                INSERT INTO sk_youth_survey (youth_id, registered_voter, registered_national_voter, vote_last_election)
                VALUES ($1, $2, $3, $4);
            `, [youth_id, registered_voter, registered_national_voter, vote_last_election]);

            // Meeting attendance
            await client.query(`
                INSERT INTO sk_youth_meeting_survey (youth_id, attended, times_attended, reason_not_attend)
                VALUES ($1, $2, $3, $4);
            `, [youth_id, attended, times_attended || "", reason_not_attend || ""]);

            // Household
            await client.query(`
                INSERT INTO sk_youth_household (youth_id, household)
                VALUES ($1, $2);
            `, [youth_id, household || ""]);

            // Attachment - use Cloudinary URL from res.locals.uploaded_images
            if (res.locals.uploaded_images && res.locals.uploaded_images.length > 0) {
                const fileUrl = res.locals.uploaded_images[0];
                // Get file info from req.files if available
                const file = req.files && req.files[0] ? req.files[0] : null;
                await client.query(`
                    INSERT INTO sk_youth_attachments (youth_id, file_name, file_type, file_url)
                    VALUES ($1, $2, $3, $4);
                `, [youth_id, file ? file.originalname : "attachment", file ? file.mimetype : "application/octet-stream", fileUrl]);
            }

            await client.query("COMMIT");
            res.status(201).json({
                message: "Signup completed successfully. Please check your email for verification.",
                youth_id,
                verificationSent: true
            });

        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Signup error:", error);
            
            // Handle specific database errors
            if (error.message && error.message.includes("duplicate key")) {
                return res.status(400).json({ 
                    error: "Email already exists",
                    message: "An account with this email already exists"
                });
            }
            
            res.status(500).json({ 
                error: "Signup failed",
                message: error.message || "An error occurred during registration"
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Signup error (outside transaction):", error);
        res.status(500).json({ 
            error: "Server error",
            message: "An error occurred during registration"
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Verification token is required" });
        }

        // Find user with this token
        const result = await pool.query(
            "SELECT youth_id, reset_token_expiry FROM sk_youth WHERE reset_token = $1 AND verified = false",
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        const user = result.rows[0];

        // Check if token is expired
        if (new Date() > new Date(user.reset_token_expiry)) {
            return res.status(400).json({ message: "Verification token has expired" });
        }

        // Mark user as verified and clear token
        await pool.query(
            "UPDATE sk_youth SET verified = true, reset_token = NULL, reset_token_expiry = NULL WHERE youth_id = $1",
            [user.youth_id]
        );

        res.status(200).json({ message: "Email verified successfully" });

    } catch (error) {
        console.error("Email verification error:", error);
        res.status(500).json({ message: "Server error" });
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
            "SELECT * FROM sk_official WHERE email = $1",
            [email]
        );

        let user = null;
        let userType = null;
        let idField = null;

        if (result.rows.length > 0) {
            user = result.rows[0];
            userType = "official";
            idField = "official_id";
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

        if (userType === "official") {
            Object.assign(responseUser, {
                official_position: user.official_position,
                role: user.role
            });
        } else if (userType === "youth") {
            Object.assign(responseUser, {
                // Add youth-specific fields if needed
            });
        }

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
};

// Forgot password - send reset email
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: "Error",
                message: "Email is required"
            });
        }

        // Check if user exists in either table
        let user = null;
        let userType = null;
        let idField = null;

        // Check official table first
        let result = await pool.query(
            "SELECT official_id, email FROM sk_official WHERE email = $1",
            [email]
        );

        if (result.rows.length > 0) {
            user = result.rows[0];
            userType = "official";
            idField = "official_id";
        } else {
            // Check youth table
            result = await pool.query(
                "SELECT youth_id, email FROM sk_youth WHERE email = $1 AND deleted_at IS NULL",
                [email]
            );

            if (result.rows.length > 0) {
                user = result.rows[0];
                userType = "youth";
                idField = "youth_id";
            }
        }

        if (!user) {
            return res.status(404).json({
                status: "Error",
                message: "No account found with this email address"
            });
        }

        // Generate reset token (simple implementation - in production, use proper token generation)
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Store reset token in database
        await pool.query(
            `UPDATE ${userType === "official" ? "sk_official" : "sk_youth"} 
             SET reset_token = $1, reset_token_expiry = $2, updated_at = CURRENT_TIMESTAMP 
             WHERE ${idField} = $3`,
            [resetToken, resetTokenExpiry, user[idField]]
        );

        // In a real application, you would send an email here
        // For now, we'll return the token (remove this in production)
        return res.status(200).json({
            status: "Success",
            message: "Password reset instructions have been sent to your email",
            // Remove this in production - only for development
            resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Reset password with token
export const resetPasswordWithToken = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                status: "Error",
                message: "Token and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                status: "Error",
                message: "Password must be at least 6 characters long"
            });
        }

        // Check if token exists and is valid in either table
        let user = null;
        let userType = null;
        let idField = null;

        // Check official table first
        let result = await pool.query(
            "SELECT official_id, reset_token_expiry FROM sk_official WHERE reset_token = $1",
            [token]
        );

        if (result.rows.length > 0) {
            user = result.rows[0];
            userType = "official";
            idField = "official_id";
        } else {
            // Check youth table
            result = await pool.query(
                "SELECT youth_id, reset_token_expiry FROM sk_youth WHERE reset_token = $1",
                [token]
            );

            if (result.rows.length > 0) {
                user = result.rows[0];
                userType = "youth";
                idField = "youth_id";
            }
        }

        if (!user) {
            return res.status(400).json({
                status: "Error",
                message: "Invalid or expired reset token"
            });
        }

        // Check if token is expired
        if (new Date() > new Date(user.reset_token_expiry)) {
            return res.status(400).json({
                status: "Error",
                message: "Reset token has expired"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        await pool.query(
            `UPDATE ${userType === "official" ? "sk_official" : "sk_youth"} 
             SET password = $1, reset_token = NULL, reset_token_expiry = NULL, updated_at = CURRENT_TIMESTAMP 
             WHERE ${idField} = $2`,
            [hashedPassword, user[idField]]
        );

        return res.status(200).json({
            status: "Success",
            message: "Password has been reset successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};