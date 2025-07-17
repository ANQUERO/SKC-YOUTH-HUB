import { pool } from '../db/config.js';

export const index = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
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

        console.log('🧑‍💻 Full Youth Record:', {
            youth: youth.rows[0],
            name: name.rows,
            location: location.rows,
            gender: gender.rows,
            info: info.rows,
        });

        res.status(200).json({
            status: "Success",
            data: {
                youth: youth.rows,
                name: name.rows,
                location: location.rows,
                gender: gender.rows,
                info: info.rows,
            }
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
