import { pool } from '../db/config.js';
import { validationResult } from 'express-validator'
import { hashPassword, createToken, comparePassword } from '../lib/index.js'

export const signup = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({
        errors: errors.array()
    });

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const {
            username,
            password,
            first_name,
            middle_name,
            last_name,
            suffix,
            region,
            province,
            municipality,
            barangay,
            purok,
            gender,
            age,
            contact,
            email,
            birthday,
            civil_status,
            youth_age_gap,
            youth_classification,
            educational_background,
            work_status,
            registered_voter,
            registered_national_voter,
            vote_last_election,
            attended,
            times_attended,
            reason_not_attend,
            household,
        } = req.body;

        const existingUser = await client.query('SELECT * FROM sk_youth WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                status: "failed",
                message: "Username already exists"
            });
        }

        const existingEmail = await client.query('SELECT * FROM sk_youth_info WHERE email = $1', [email])
        if (existingEmail.rows.length > 0) {
            return res.status(409).json({
                status: "failed",
                message: "Email already exists"
            })
        }

        const allowedGender = ["male", "female"];
        if (!allowedGender.includes(gender.toLowerCase())) {
            console.log("Invalid gender:", gender, "Allowed:", allowedGender);
            return res.status(409).json({
                status: "failed",
                message: `Invalid gender. Allowed values are: ${allowedGender.join(", ")}.`
            });
        }

        const minAge = 16;
        const maxAge = 30;
        if (age < minAge || age > maxAge) {
            console.log(`Invalid age. Allowed age must be between ${minAge} and ${maxAge}`);
            return res.status(409).json({
                status: "failed",
                message: `Invalid age. Allowed age must be between ${minAge} and ${maxAge}`
            });
        }

        //Yes or No survey questions
        const yesNo = ["yes", "no"];
        const yesNoFields = {
            registered_voter,
            registered_national_voter,
            vote_last_election
        };
        for (const [key, value] of Object.entries(yesNoFields)) {
            if (!yesNo.includes(value.toLowerCase())) {
                return res.status(409).json({
                    status: "failed",
                    message: `Invalid value for ${key}. Must be 'yes' or 'no'.`
                });
            }
        }

        //hash password
        const hashedPassword = await hashPassword(password);

        //Insert into sk_youth
        const insertUser = await client.query(`
        INSERT INTO sk_youth (username, password)
        VALUES ($1, $2)
        RETURNING youth_id
        `, [
            username,
            hashedPassword
        ]);

        const youthId = insertUser.rows[0].youth_id;

        //Insert into sk_youth_name
        await client.query(`
        INSERT INTO sk_youth_name (youth_id, first_name, 
        middle_name, last_name, 
        suffix)
        VALUES ($1, $2, $3, $4, $5)
        `,
            [
                youthId,
                first_name,
                middle_name,
                last_name,
                suffix
            ]);


        //Insert into sk_youth_location
        await client.query(`
        INSERT INTO sk_youth_location (youth_id, region,
        province, municipality, 
        barangay, purok)
        VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            youthId,
            region,
            province,
            municipality,
            barangay,
            purok
        ]);

        //Insert into sk_youth_gender
        await client.query(`
        INSERT INTO sk_youth_gender (youth_id, gender)
        VALUES ($1, $2)
        `, [youthId, gender.toLowerCase()]);

        //Insert into sk_youth_info
        await client.query(`
        INSERT INTO sk_youth_info (youth_id, age, 
        contact, email, 
        birthday)
        VALUES ($1, $2, $3, $4, $5)
        `, [
            youthId,
            age,
            contact,
            email,
            birthday
        ]);

        //Insert into sk_youth_demographics
        await client.query(`
        INSERT INTO sk_youth_demographics (youth_id, civil_status,
        youth_age_gap, youth_classification, 
        educational_background, work_status)
        VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            youthId,
            civil_status,
            youth_age_gap,
            youth_classification,
            educational_background,
            work_status
        ]);

        //Insert into sk_youth_survey
        await client.query(`
        INSERT INTO sk_youth_survey (youth_id, registered_voter, 
        registered_national_voter,
        vote_last_election)
        VALUES ($1, $2, $3, $4)
        `, [
            youthId,
            registered_voter,
            registered_national_voter,
            vote_last_election
        ]);

        //Insert into sk_youth_meeting_survey
        await client.query(`
        INSERT INTO sk_youth_meeting_survey (youth_id, attended,
        times_attended, reason_not_attend)
        VALUES ($1, $2, $3, $4)
        `, [
            youthId,
            attended,
            times_attended,
            reason_not_attend
        ]);

        //Insert into sk_youth_household
        await client.query(`
        INSERT INTO sk_youth_household (youth_id, household)
        VALUES ($1, $2)
        `, [
            youthId,
            household
        ]);

        await client.query('COMMIT');

        const token = createToken({ id: youthId, type: 'youth' });

        res.status(200).json({
            status: "Success",
            message: "User signed up successfully",
            token,
            youth_id: youthId
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Signup error`, error);
        res.status(500).json({
            status: "failed",
            message: "Server error during signup",
            error: error.message
        });
    } finally {
        client.release();
    }
};

export const signin = async (req, res) => {
    const { usernameOrEmail, password, account_type } = req.body;

    if (!usernameOrEmail || !password || !account_type) {
        return res.status(400).json({
            status: "failed",
            message: "Please provide username/email, password and account_type"
        });
    }

    try {
        let user;
        let isMatch;
        let token;
        let userType;
        let userId;

        if (account_type === 'admin') {
            const result = await pool.query(
                'SELECT * FROM sk_official_admin WHERE email = $1',
                [usernameOrEmail]
            );

            user = result.rows[0];

            if (!user) {
                return res.status(401).json({
                    status: "failed",
                    message: "Invalid email or username"
                });
            }

            isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    status: "failed",
                    message: "Invalid password"
                });
            }

            token = createToken({
                id: user.admin_id,
                type: 'admin'
            });
            userId = user.admin_id;
            delete user.password;
            userType = 'admin';

        } else if (account_type === 'youth') {
            const result = await pool.query(
                'SELECT youth_id, username, password FROM sk_youth WHERE username = $1',
                [usernameOrEmail]
            );

            user = result.rows[0];

            if (!user) {
                return res.status(401).json({
                    status: "failed",
                    message: "Invalid Username or Password"
                });
            }

            isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    status: "failed",
                    message: "Invalid Username or Password",
                });
            }

            token = createToken({
                id: user.youth_id,
                type: 'youth'
            });
            userId = user.youth_id;
            userType = 'youth';
            delete user.password;

        } else {
            return res.status(400).json({
                status: "failed",
                message: "Invalid account type. Must be 'admin' or 'youtn'. "
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Signin successfully",
            token,
            userType,
            userId,
            user
        });


    } catch (error) {
        console.error("Signin error", error);
        res.status(500).json({
            status: "failed",
            message: "Server error during signin"
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.status(200).json({
            status: "Success",
            message: "Logged out successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Error",
            message: "Something went wrong during logout"
        });
    }
}