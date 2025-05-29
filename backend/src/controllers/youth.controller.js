import { pool } from '../db/config.js';
import { hashPassword } from '../lib/index.js'

export const index = async (req, res) => {

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
            household
        ] = await Promise.all([
            pool.query('SELECT * FROM sk_youth'),
            pool.query('SELECT * FROM sk_youth_name'),
            pool.query('SELECT * FROM sk_youth_location'),
            pool.query('SELECT * FROM sk_youth_gender'),
            pool.query('SELECT * FROM sk_youth_info'),
            pool.query('SELECT * FROM sk_youth_demographics'),
            pool.query('SELECT * FROM sk_youth_survey'),
            pool.query('SELECT * FROM sk_youth_meeting_survey'),
            pool.query('SELECT * FROM sk_youth_household'),
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
}


export const show = async (req, res) => {

    try {
        const { youth_id } = req.params;

        if (!youth_id) {
            return res.status(400).json({
                status: "failed",
                message: "User ID is required"
            });
        }

        const youth_acc = await pool.query({
            text: `SELECT * FROM sk_youth WHERE youth_id = $1`,
            values: [youth_id]
        });

        const youthAccount = youth_acc.rows[0];

        if (!youthAccount) {
            return res.status(404).json({
                status: "failed",
                message: "Youth not found"
            });
        }

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
            pool.query('SELECT * FROM sk_youth WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_name WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_location WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_gender WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_info WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_demographics WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_survey WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_meeting_survey WHERE youth_id = $1', [youth_id]),
            pool.query('SELECT * FROM sk_youth_household WHERE youth_id = $1', [youth_id]),
        ]);

        res.status(200).json({
            status: 'success',
            youth: {
                youth: youth.rows[0],
                name: name.rows[0],
                location: location.rows[0],
                gender: gender.rows[0],
                info: info.rows[0],
                demographics: demographics.rows[0],
                survey: survey.rows[0],
                meetingSurvey: meetingSurvey.rows[0],
                household: household.rows[0],
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });

    }
}


export const update = async (req, res) => {
    const { youth_id } = req.params;
    const fieldsToUpdate = req.body;

    try {
        if (!youth_id) {
            return res.status(400).json({
                status: 'failed',
                message: 'Youth ID is required',
            });
        }

        const keys = Object.keys(fieldsToUpdate);
        if (keys.length === 0) {
            return res.status(400).json({
                status: 'failed',
                message: 'No fields provided to update',
            });
        }

        const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');
        const values = Object.values(fieldsToUpdate);

        const result = await pool.query(
            `UPDATE sk_youth SET ${setClause} WHERE youth_id = $${keys.length + 1} AND deleted_at IS NULL RETURNING *`,
            [...values, youth_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Youth not found or has been deleted',
            });
        }

        res.status(200).json({
            status: 'success',
            updated: result.rows[0],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

