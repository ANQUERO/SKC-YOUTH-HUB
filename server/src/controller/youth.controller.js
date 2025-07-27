import { pool } from '../db/config.js';
import bcrypt from 'bcrypt'

export const index = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== 'admin') {
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
    const isAdmin = user.userType === 'admin';

    if (!isSelf && !isAdmin) {
        return res.status(403).json({
            message: 'Forbidden - You cannot access this youth\'s data'
        });
    }

    try {
        const [
            youth,
            name,
            location,
            gender,
            info,
            demographics,
            survey,
            meetingSurvey,
            attachments,
            household
        ] = await Promise.all([
            pool.query('SELECT * FROM sk_youth WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_name WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_location WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_gender WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_info WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_demographics WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_survey WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_meeting_survey WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_attachments WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_household WHERE youth_id = $1', [youth_id]),
        ]);
        console.log('🧑‍💻 Full Youth Record:', {
            youth: youth.rows[0],
            name: name.rows,
            location: location.rows,
            gender: gender.rows,
            info: info.rows,
            demographics: demographics.rows,
            survey: survey.rows,
            meetingSurvey: meetingSurvey.rows,
            attachments: attachments.rows,
            household: household.rows
        });

        if (youth.rows.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'Youth not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            data: {
                youth: youth.rows[0],
                name: name.rows,
                location: location.rows,
                gender: gender.rows,
                info: info.rows,
                demographics: demographics.rows,
                survey: survey.rows,
                meetingSurvey: meetingSurvey.rows,
                attachments: attachments.rows,
                household: household.rows
            }
        });
    } catch (error) {
        console.error('Failed to fetch youth data:', error);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};


export const store = async (req, res) => {
    const user = req.user;

    // 🛡️ Only admins can store youth data
    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - Only admins can create youth profiles'
        });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

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

        // Hash the password
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
            location.purok_id || null
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

    // 🛡️ Authorization: Only the logged-in youth can update their own data
    if (!user || user.userType !== 'youth' || user.youth_id !== parseInt(youth_id)) {
        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - You can only update your own profile',
        });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const {
            name,
            location,
            gender,
            info,
            demographics,
            survey,
            meetingSurvey,
            attachments,
            household,
        } = req.body;

        // 🧠 sk_youth_name
        if (name) {
            await client.query(`
                UPDATE sk_youth_name
                SET first_name = COALESCE($1, first_name),
                    middle_name = COALESCE($2, middle_name),
                    last_name = COALESCE($3, last_name),
                    suffix = COALESCE($4, suffix),
                    updated_at = CURRENT_TIMESTAMP
                WHERE youth_id = $5
            `, [name.first_name, name.middle_name, name.last_name, name.suffix, youth_id]);
        }

        // 🗺️ sk_youth_location
        if (location) {
            await client.query(`
                UPDATE sk_youth_location
                SET region = COALESCE($1, region),
                    province = COALESCE($2, province),
                    municipality = COALESCE($3, municipality),
                    barangay = COALESCE($4, barangay),
                    purok_id = COALESCE($5, purok_id),
                    updated_at = CURRENT_TIMESTAMP
                WHERE youth_id = $6
            `, [location.region, location.province, location.municipality, location.barangay, location.purok_id, youth_id]);
        }

        // 🚻 sk_youth_gender
        if (gender) {
            await client.query(`
                UPDATE sk_youth_gender
                SET gender = COALESCE($1, gender),
                    updated_at = CURRENT_TIMESTAMP
                WHERE youth_id = $2
            `, [gender.gender, youth_id]);
        }

        // 📞 sk_youth_info
        if (info) {
            await client.query(`
                UPDATE sk_youth_info
                SET age = COALESCE($1, age),
                    contact = COALESCE($2, contact),
                    birthday = COALESCE($3, birthday),
                    updated_at = CURRENT_TIMESTAMP
                WHERE youth_id = $4
            `, [info.age, info.contact, info.birthday, youth_id]);
        }

        // 📊 sk_youth_demographics
        if (demographics) {
            await client.query(`
                UPDATE sk_youth_demographics
                SET civil_status = COALESCE($1, civil_status),
                    youth_age_gap = COALESCE($2, youth_age_gap),
                    youth_classification = COALESCE($3, youth_classification),
                    educational_background = COALESCE($4, educational_background),
                    work_status = COALESCE($5, work_status),
                    updated_at = CURRENT_TIMESTAMP
                WHERE youth_id = $6
            `, [
                demographics.civil_status,
                demographics.youth_age_gap,
                demographics.youth_classification,
                demographics.educational_background,
                demographics.work_status,
                youth_id
            ]);
        }

        // 🗳️ sk_youth_survey
        if (survey) {
            await client.query(`
                UPDATE sk_youth_survey
                SET registered_voter = COALESCE($1, registered_voter),
                    registered_national_voter = COALESCE($2, registered_national_voter),
                    vote_last_election = COALESCE($3, vote_last_election),
                    updated_at = CURRENT_TIMESTAMP
                WHERE youth_id = $4
            `, [survey.registered_voter, survey.registered_national_voter, survey.vote_last_election, youth_id]);
        }

        // 🧑‍🤝‍🧑 sk_youth_meeting_survey
        if (meetingSurvey) {
            await client.query(`
                UPDATE sk_youth_meeting_survey
                SET attended = COALESCE($1, attended),
                    times_attended = COALESCE($2, times_attended),
                    reason_not_attend = COALESCE($3, reason_not_attend),
                    updated_at = CURRENT_TIMESTAMP
                WHERE youth_id = $4
            `, [meetingSurvey.attended, meetingSurvey.times_attended, meetingSurvey.reason_not_attend, youth_id]);
        }

        // 🏠 sk_youth_household
        if (household) {
            await client.query(`
                UPDATE sk_youth_household
                SET household = COALESCE($1, household),
                    updated_at = CURRENT_TIMESTAMP
                WHERE youth_id = $2
            `, [household.household, youth_id]);
        }

        // 🧾 sk_youth_attachments (optional, usually handled by separate upload endpoint)
        if (attachments) {
            await Promise.all(attachments.map(att => {
                return client.query(`
                    INSERT INTO sk_youth_attachments (youth_id, file_name, file_type, file_url)
                    VALUES ($1, $2, $3, $4)
                `, [youth_id, att.file_name, att.file_type, att.file_url]);
            }));
        }

        await client.query('COMMIT');
        return res.status(200).json({
            status: 'Success',
            message: 'Youth profile updated successfully'
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Update error:', err);
        res.status(500).json({
            status: 'Error',
            message: 'Something went wrong during update',
            error: err.message
        });
    } finally {
        client.release();
    }
};

