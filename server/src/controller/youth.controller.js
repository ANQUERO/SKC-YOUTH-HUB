import { pool } from '../db/config.js'
import bcrypt from "bcrypt";

export const index = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            status: "Error",
            message: "Unathorized"
        })
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
            pool.query('SELECT * FROM sk_youth'),
            pool.query('SELECT * FROM sk_youth_name'),
            pool.query('SELECT * FROM sk_youth_location'),
            pool.query('SELECT * FROM sk_youth_gender'),
            pool.query('SELECT * FROM sk_youth_info'),
            pool.query('SELECT * FROM sk_youth_demographics'),
            pool.query('SELECT * FROM sk_youth_survey'),
            pool.query('SELECT * FROM sk_youth_meeting_survey'),
            pool.query('SELECT * FROM sk_youth_attachments'),
            pool.query('SELECT * FROM sk_youth_household'),
        ]);

        res.status(200).json({
            status: "Success",
            data: {
                youth: youth.rows,
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
        console.error('Database query failed:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal server error '
        })

    }
}

export const show = async (req, res) => {
    const { id: youth_id } = req.params;

    if (req.user.userType !== 'admin' && parseInt(youth_id) !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden - You cannot access this youth\'s data' });
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

        if (youth.rows.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'Youth Not found'
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


