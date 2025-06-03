// Import sa database pool ug password hashing function
import { pool } from '../db/config.js';
import { hashPassword } from '../lib/index.js'

// 🧾 Function para kuhaon ang tanang youth-related nga impormasyon
export const index = async (req, res) => {
    const { admin_id } = req.query;

    try {
        // I-check kung admin ba ang nangayo sa datos
        if (!admin_id) {
            return res.status(403).json({
                status: 'failed',
                message: 'Dili pwede. Para ra ni sa admin.',
            });
        }

        // Sabay-sabay pagkuha sa data gikan sa tanan related tables
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

        // Ibalik ang tanan datos nga nakuha
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
        // Kung naay error, ipakita ang mensahe
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

// 📝 Function para sa pagparehistro og bag-ong youth
export const create = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Sugdan ang transaction

        // Kuhaa ang datos gikan sa request body
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

        // Siguraduhon nga kompleto ang datos
        if (!username || !password || !name || !location || !gender || !info || !demographics || !survey || !meetingSurvey || !household) {
            return res.status(400).json({
                status: 'failed',
                message: 'Kompletohon ang tanang datos.',
            });
        }

        // I-hash ang password para seguridad
        const hashedPassword = await hashPassword(password);

        // Ibutang ang datos sa sk_youth table
        const youthRes = await client.query(
            `INSERT INTO sk_youth (username, password) VALUES ($1, $2) RETURNING youth_id`,
            [username, hashedPassword]
        );
        const youth_id = youthRes.rows[0].youth_id;

        // Insert sa uban nga mga detalye gamit ang youth_id
        await client.query(
            `INSERT INTO sk_youth_name (youth_id, first_name, middle_name, last_name, suffix)
            VALUES ($1, $2, $3, $4, $5)`,
            [youth_id, name.first_name, name.middle_name, name.last_name, name.suffix]
        );

        await client.query(
            `INSERT INTO sk_youth_location (youth_id, region, province, municipality, barangay, purok)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [youth_id, location.region, location.province, location.municipality, location.barangay, location.purok]
        );

        await client.query(
            `INSERT INTO sk_youth_gender (youth_id, gender) VALUES ($1, $2)`,
            [youth_id, gender]
        );

        await client.query(
            `INSERT INTO sk_youth_info (youth_id, age, contact, email, birthday)
            VALUES ($1, $2, $3, $4, $5)`,
            [youth_id, info.age, info.contact, info.email, info.birthday]
        );

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

        await client.query(
            `INSERT INTO sk_youth_household (youth_id, household)
            VALUES ($1, $2)`,
            [youth_id, household]
        );

        await client.query('COMMIT'); // Human ang transaction

        res.status(201).json({
            status: 'success',
            message: 'Malampusong narehistro ang youth.',
            youth_id
        });

    } catch (error) {
        await client.query('ROLLBACK'); // Kung naay problema, i-rollback ang tanan
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    } finally {
        client.release(); // Pag-release sa DB client
    }
};

// 🗑️ Function para sa pag-soft delete sa youth record
export const destroy = async (req, res) => {
    const { youth_id } = req.params;
    const { admin_id } = req.body;

    try {
        if (!youth_id || !admin_id) {
            return res.status(400).json({
                status: 'failed',
                message: 'Kinahanglan ang Youth ID ug Admin ID.',
            });
        }

        // Siguraduhon nga tinuod nga admin
        const adminCheck = await pool.query(
            `SELECT * FROM admins WHERE admin_id = $1`,
            [admin_id]
        );

        if (adminCheck.rows.length === 0) {
            return res.status(403).json({
                status: 'failed',
                message: 'Dili awtorisado: Wala ang admin.',
            });
        }

        // I-mark as deleted ang youth record
        const result = await pool.query(
            `UPDATE sk_youth SET deleted_at = NOW() WHERE youth_id = $1 AND deleted_at IS NULL RETURNING *`,
            [youth_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Wala nakit-an o gi-delete na.',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Malampusong gi-soft delete ang youth.',
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

// ♻️ Function para sa pag-restore sa deleted youth
export const restore = async (req, res) => {
    const { youth_id } = req.params;
    const { admin_id } = req.body;

    try {
        if (!youth_id || !admin_id) {
            return res.status(400).json({
                status: 'failed',
                message: 'Kinahanglan ang Youth ID ug Admin ID.',
            });
        }

        // Siguraduhon nga admin
        const isAdmin = await pool.query(
            `SELECT * FROM admins WHERE admin_id = $1`,
            [admin_id]
        );

        if (isAdmin.rows.length === 0) {
            return res.status(403).json({
                status: 'failed',
                message: 'Dili awtorisado: Admin wala.',
            });
        }

        // I-restore ang youth record
        const result = await pool.query(
            `UPDATE sk_youth SET deleted_at = NULL WHERE youth_id = $1 AND deleted_at IS NOT NULL RETURNING *`,
            [youth_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Wala nakit-an o wala gi-delete.',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Malampusong gi-restore ang youth.',
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

// 🚫 Function para i-disable ang comment status sa usa ka youth
export const disable = async (req, res) => {
    const { admin_id } = req.body; 
    const { youth_id } = req.params; 

    try {
        if (!admin_id) {
            return res.status(403).json({
                status: "failed",
                message: "Dili pwede. Admin ra ang maka-disable."
            });
        }

        if (!youth_id) {
            return res.status(400).json({
                status: "failed",
                message: "Youth ID kinahanglan."
            });
        }

        const result = await pool.query(
            `UPDATE sk_youth
            SET comment_status = FALSE, 
            updated_at = CURRENT_TIMESTAMP
            WHERE youth_id = $1 AND deleted_at IS NULL 
            RETURNING youth_id, comment_status`,
            [youth_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "Wala nakit-an ang youth o gi-delete na."
            });
        }

        res.status(200).json({
            status: "success",
            message: "Na-disable ang comment status.",
            youth: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "failed",
            message: error.message,
        }); 
    }
};

// ✅ Function para i-enable ang comment status sa youth
export const enable = async (req, res) => {
    const { admin_id } = req.body; 
    const { youth_id } = req.params; 

    try {
        if (!admin_id) {
            return res.status(403).json({
                status: "failed",
                message: "Dili pwede. Admin ra ang maka-enable."
            });
        }

        if (!youth_id) {
            return res.status(400).json({
                status: "failed",
                message: "Youth ID kinahanglan."
            });
        }

        const result = await pool.query(
            `UPDATE sk_youth
            SET comment_status = TRUE, 
            updated_at = CURRENT_TIMESTAMP
            WHERE youth_id = $1 AND deleted_at IS NULL 
            RETURNING youth_id, comment_status`,
            [youth_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "Wala nakit-an ang youth o gi-delete na."
            });
        }

        res.status(200).json({
            status: "success",
            message: "Na-enable ang comment status.",
            youth: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "failed",
            message: error.message,
        }); 
    }
};
