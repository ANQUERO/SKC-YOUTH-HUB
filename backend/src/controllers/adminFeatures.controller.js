import { pool } from '../db/config.js';
import { hashPassword } from '../lib/index.js'


export const index = async (req, res) => {
    const { admin_id } = req.query; // or req.user depending on your auth middleware

    try {
        if (!admin_id) {
            return res.status(403).json({
                status: 'failed',
                message: 'Access denied. Admin only.',
            });
        }

        // Optional: Validate admin_id from an `admins` table or role check
 
        const [
            youth,
            name,
            location,
            gender,
            info,
            demographics,
            survey,
            meetingSurvey,
            household
        ] = await Promise.all([
            pool.query('SELECT * FROM sk_youth WHERE deleted_at IS NULL'),
            pool.query('SELECT * FROM sk_youth_name WHERE deleted_at IS NULL'),
            pool.query('SELECT * FROM sk_youth_location WHERE deleted_at IS NULL'),
            pool.query('SELECT * FROM sk_youth_gender WHERE deleted_at IS NULL'),
            pool.query('SELECT * FROM sk_youth_info WHERE deleted_at IS NULL'),
            pool.query('SELECT * FROM sk_youth_demographics WHERE deleted_at IS NULL'),
            pool.query('SELECT * FROM sk_youth_survey WHERE deleted_at IS NULL'),
            pool.query('SELECT * FROM sk_youth_meeting_survey WHERE deleted_at IS NULL'),
            pool.query('SELECT * FROM sk_youth_household WHERE deleted_at IS NULL'),
        ]);

        res.status(200).json({
            status: 'success',
            youths: {
                youth: youth.rows,
                name: name.rows,
                location: location.rows,
                gender: gender.rows,
                info: info.rows,
                demographics: demographics.rows,
                survey: survey.rows,
                meetingSurvey: meetingSurvey.rows,
                household: household.rows,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

export const create = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const {
            username,
            password,
            name,
            location,
            gender,
            info,
            demographics,
            survey,
            meetingSurvey,
            household
        } = req.body;

        if (!username || !password || !name || !location || !gender || !info || !demographics || !survey || !meetingSurvey || !household) {
            return res.status(400).json({
                status: 'failed',
                message: 'All required data must be provided.',
            });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Insert into sk_youth
        const youthRes = await client.query(
            `INSERT INTO sk_youth (username, password) VALUES ($1, $2) RETURNING youth_id`,
            [username, hashedPassword]
        );
        const youth_id = youthRes.rows[0].youth_id;

        // sk_youth_name
        await client.query(
            `INSERT INTO sk_youth_name (youth_id, first_name, middle_name, last_name, suffix)
             VALUES ($1, $2, $3, $4, $5)`,
            [youth_id, name.first_name, name.middle_name, name.last_name, name.suffix]
        );

        // sk_youth_location
        await client.query(
            `INSERT INTO sk_youth_location (youth_id, region, province, municipality, barangay, purok)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [youth_id, location.region, location.province, location.municipality, location.barangay, location.purok]
        );

        // sk_youth_gender
        await client.query(
            `INSERT INTO sk_youth_gender (youth_id, gender) VALUES ($1, $2)`,
            [youth_id, gender]
        );

        // sk_youth_info
        await client.query(
            `INSERT INTO sk_youth_info (youth_id, age, contact, email, birthday)
             VALUES ($1, $2, $3, $4, $5)`,
            [youth_id, info.age, info.contact, info.email, info.birthday]
        );

        // sk_youth_demographics
        await client.query(
            `INSERT INTO sk_youth_demographics (youth_id, civil_status, youth_age_gap, youth_classification, educational_background, work_status)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                youth_id,
                demographics.civil_status,
                demographics.youth_age_gap,
                demographics.youth_classification,
                demographics.educational_background,
                demographics.work_status
            ]
        );

        // sk_youth_survey
        await client.query(
            `INSERT INTO sk_youth_survey (youth_id, registered_voter, registered_national_voter, vote_last_election)
             VALUES ($1, $2, $3, $4)`,
            [
                youth_id,
                survey.registered_voter,
                survey.registered_national_voter,
                survey.vote_last_election
            ]
        );

        // sk_youth_meeting_survey
        await client.query(
            `INSERT INTO sk_youth_meeting_survey (youth_id, attended, times_attended, reason_not_attend)
             VALUES ($1, $2, $3, $4)`,
            [
                youth_id,
                meetingSurvey.attended,
                meetingSurvey.times_attended,
                meetingSurvey.reason_not_attend
            ]
        );

        // sk_youth_household
        await client.query(
            `INSERT INTO sk_youth_household (youth_id, household)
             VALUES ($1, $2)`,
            [youth_id, household]
        );

        await client.query('COMMIT');

        res.status(201).json({
            status: 'success',
            message: 'Youth registered successfully',
            youth_id
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    } finally {
        client.release();
    }
};


export const destroy = async (req, res) => {
    const { youth_id } = req.params;
    const { admin_id } = req.body; // Or req.headers/admin session depending on your auth method

    try {
        if (!youth_id || !admin_id) {
            return res.status(400).json({
                status: 'failed',
                message: 'Youth ID and Admin ID are required',
            });
        }

        // Step 1: Validate admin
        const adminCheck = await pool.query(
            `SELECT * FROM admins WHERE admin_id = $1`,
            [admin_id]
        );

        if (adminCheck.rows.length === 0) {
            return res.status(403).json({
                status: 'failed',
                message: 'Unauthorized: Admin not found',
            });
        }

        // Step 2: Soft delete youth
        const result = await pool.query(
            `UPDATE sk_youth SET deleted_at = NOW() WHERE youth_id = $1 AND deleted_at IS NULL RETURNING *`,
            [youth_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Youth not found or already deleted',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Youth soft-deleted successfully by admin',
            deleted: result.rows[0],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};


export const restore = async (req, res) => {
    const { youth_id } = req.params;
    const { admin_id } = req.body;

    try {
        if (!youth_id || !admin_id) {
            return res.status(400).json({
                status: 'failed',
                message: 'Youth ID and Admin ID are required',
            });
        }

        // Optional: Check if admin_id is valid (based on your auth logic)
        const isAdmin = await pool.query(
            `SELECT * FROM admins WHERE admin_id = $1`,
            [admin_id]
        );

        if (isAdmin.rows.length === 0) {
            return res.status(403).json({
                status: 'failed',
                message: 'Unauthorized: Admin not found',
            });
        }

        const result = await pool.query(
            `UPDATE sk_youth SET deleted_at = NULL WHERE youth_id = $1 AND deleted_at IS NOT NULL RETURNING *`,
            [youth_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Youth not found or not deleted',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Youth restored successfully',
            restored: result.rows[0],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};
