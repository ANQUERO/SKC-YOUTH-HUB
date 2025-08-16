import { pool } from '../db/config.js';
import bcrypt from 'bcrypt'

export const index = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== 'official') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(`
            SELECT 
                y.youth_id,
                y.email,
                y.verified,
                CONCAT_WS(' ', yn.suffix, yn.first_name, yn.middle_name, yn.last_name) AS full_name,
                yi.age,
                yg.gender,
                p.name AS purok,
                ys.registered_voter
            FROM sk_youth y
            LEFT JOIN sk_youth_name yn ON y.youth_id = yn.youth_id
            LEFT JOIN sk_youth_info yi ON y.youth_id = yi.youth_id
            LEFT JOIN sk_youth_gender yg ON y.youth_id = yg.youth_id
            LEFT JOIN sk_youth_survey ys ON y.youth_id = ys.youth_id
            LEFT JOIN sk_youth_location yl ON y.youth_id = yl.youth_id
            LEFT JOIN purok p ON yl.purok_id = p.purok_id
        `);

        res.status(200).json({
            status: "Success",
            youth: result.rows
        });

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal server error'
        });
    }
};

export const show = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;

    const isSelf = user.userType === 'youth' && user.youth_id === parseInt(youth_id);
    const isAdmin = user.userType === 'official';

    if (!isSelf && !isAdmin) {
        return res.status(403).json({
            message: 'Forbidden - You cannot access this youth\'s data'
        });
    }

    try {

        const { rows } = await pool.query(`
            SELECT 
            y.youth_id,
                y.email,
                y.verified,
                y.created_at,
                y.updated_at,
                yn.first_name,
                yn.middle_name,
                yn.last_name,
                yn.suffix,
                yl.region,
                yl.province,
                yl.municipality,
                yl.barangay,
                p.name AS purok,
                yi.age,
                yi.contact,
                yi.birthday,
                yg.gender,
                yd.civil_status,
                yd.youth_age_gap,
                yd.youth_classification,
                yd.educational_background,
                yd.work_status,
                ys.registered_voter,
                ys.registered_national_voter,
                ys.vote_last_election,
                yms.attended,
                yms.times_attended,
                yms.reason_not_attend
                FROM sk_youth y
            LEFT JOIN sk_youth_name yn ON y.youth_id = yn.youth_id
            LEFT JOIN sk_youth_location yl ON y.youth_id = yl.youth_id
            LEFT JOIN purok p ON yl.purok_id = p.purok_id
            LEFT JOIN sk_youth_info yi ON y.youth_id = yi.youth_id
            LEFT JOIN sk_youth_gender yg ON y.youth_id = yg.youth_id
            LEFT JOIN sk_youth_demographics yd ON y.youth_id = yd.youth_id
            LEFT JOIN sk_youth_survey ys ON y.youth_id = ys.youth_id
            LEFT JOIN sk_youth_meeting_survey yms ON y.youth_id = yms.youth_id
            WHERE y.youth_id = $1
            ORDER BY yn.created_at DESC
            LIMIT 1;
            `,
            [youth_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'Youth not found'
            });
        }

        const youth = rows[0];

        const { rows: attachments } = await pool.query(
            `
            SELECT file_name, file_type, file_url, uploaded_at
            FROM sk_youth_attachmetns
            WHERE youth_id = $1 AND deleted_at IS NULL
            `, [youth_id]
        );

        const { rows: households } = await pool.query(
            `
            SELECT household
            FROM sk_youth_household
            WHERE youth_id = $1 AND deleted_at IS NULL  
            `, [youth_id]
        )

        res.status(200).json({
            status: 'Success',
            data: {
                ...youth,
                attachments,
                households
            }
        });

    } catch (error) {
        console.error('Failed to fetch youth details:', error);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};


export const store = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== 'official') {
        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - Only admins can create youth profiles'
        });
    }

    const {
        email,
        password,
        name,
        location,
        gender,
        info,
        demographics,
        survey,
        meetingSurvey,
        attachments,
        household
    } = req.body;

    const client = await pool.connect();
    let purokId = location.purok_id || null;

    try {
        await client.query('BEGIN');

        if (!purokId && location?.purok) {
            const purokResult = await client.query(
                `SELECT purok_id FROM purok WHERE name = $1 LIMIT 1`,
                [location.purok]
            );

            if (purokResult.rows.length > 0) {
                purokId = purokResult.rows[0].purok_id;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into sk_youth
        const result = await client.query(`
            INSERT INTO sk_youth (email, password)
            VALUES ($1, $2)
            RETURNING youth_id
        `, [email, hashedPassword]);

        const youth_id = result.rows[0].youth_id;

        // Insert into other tables using youth_id
        await client.query(`
            INSERT INTO sk_youth_name (youth_id, first_name, middle_name, last_name, suffix)
            VALUES ($1, $2, $3, $4, $5)
        `, [
            youth_id,
            name.first_name,
            name.middle_name || null,
            name.last_name,
            name.suffix || null
        ]);

        await client.query(`
            INSERT INTO sk_youth_location (youth_id, region, province, municipality, barangay, purok_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            youth_id,
            location.region,
            location.province,
            location.municipality,
            location.barangay,
            purokId
        ]);

        await client.query(`
            INSERT INTO sk_youth_gender (youth_id, gender)
            VALUES ($1, $2)
        `, [youth_id, gender.gender]);

        await client.query(`
            INSERT INTO sk_youth_info (youth_id, age, contact, birthday)
            VALUES ($1, $2, $3, $4)
        `, [youth_id, info.age, info.contact, info.birthday]);

        await client.query(`
            INSERT INTO sk_youth_demographics (
                youth_id, civil_status, youth_age_gap, youth_classification,
                educational_background, work_status
            ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            youth_id,
            demographics.civil_status,
            demographics.youth_age_gap,
            demographics.youth_classification,
            demographics.educational_background,
            demographics.work_status
        ]);

        await client.query(`
            INSERT INTO sk_youth_survey (
                youth_id, registered_voter, registered_national_voter, vote_last_election
            ) VALUES ($1, $2, $3, $4)
        `, [
            youth_id,
            survey.registered_voter,
            survey.registered_national_voter,
            survey.vote_last_election
        ]);

        await client.query(`
            INSERT INTO sk_youth_meeting_survey (youth_id, attended, times_attended, reason_not_attend)
            VALUES ($1, $2, $3, $4)
        `, [
            youth_id,
            meetingSurvey.attended,
            meetingSurvey.times_attended,
            meetingSurvey.reason_not_attend
        ]);

        if (attachments && attachments.length > 0) {
            for (const att of attachments) {
                await client.query(`
                    INSERT INTO sk_youth_attachments (youth_id, file_name, file_type, file_url)
                    VALUES ($1, $2, $3, $4)
                `, [youth_id, att.file_name, att.file_type, att.file_url]);
            }
        }

        if (household) {
            await client.query(`
                INSERT INTO sk_youth_household (youth_id, household)
                VALUES ($1, $2)
            `, [youth_id, household.household]);
        }

        await client.query('COMMIT');

        return res.status(201).json({
            status: 'Success',
            message: 'Youth profile created successfully',
            youth_id
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Insert error:', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Failed to create youth profile',
            error: error.message
        });
    } finally {
        client.release();
    }
};


export const update = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'youth' || user.youth_id !== parseInt(youth_id)) {
        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - You can only update your own profile',
        });
    }

    try {


    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({
            status: 'Error',
            message: 'Something went wrong during update',
            error: err.message
        });
    }
};

