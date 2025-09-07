import { pool } from '../db/config.js'

export const showAccountName = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'youth') {
        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - You cannot access this youth data'
        });
    }

    try {
        const { rows } = await pool.query(`
            SELECT 
            y.youth_id,
            y.email,
            y.verified,
            yn.first_name,
            yn.middle_name,
            yn.last_name,
            yn.suffix
            FROM sk_youth y
            LEFT JOIN sk_youth_name yn ON y.youth_id = yn.youth_id
            WHERE y.youth_id = $1
            `,
            [youth_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'Youth not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            data: rows[0]
        });


    } catch (error) {
        console.error('Failed to fetch youth showAccountName:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal server error'
        });
    }
}

export const showGenderInfo = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'youth') {
        return res.status(404).json({
            status: 'Error',
            message: 'Forbidden - You cannot access this youth data'
        });
    }

    try {
        const { rows } = await pool.query(`
            SELECT
            y.youth_id,
            g.gender,
            yi.age,
            yi.contact_number,
            yi.birthday
            FROM sk_youth y
            LEFT JOIN sk_youth_gender g ON y.youth_id = g.youth_id
            LEFT JOIN sk_youth_info yi ON y.youth_id = yi.youth_id
            WHERE y.youth_id = $1 
            `,
            [youth_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'Youth not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            data: rows[0]
        });

    } catch (error) {
        console.error('Failed to fetch youth showAccountName:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal server error'
        });
    }
}

export const showDemoSurvey = async (req, res) => {
    const { id: youth_id } = req.params
    const user = req.user;

    if (!user || user.userType !== 'youth') {
        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - You cannot access this youth data'
        });
    }

    try {
        const { rows } = await pool.query(`
            SELECT
            y.youth_id, 
            yd.civil_status,
            yd.youth_age_gap,
            yd.youth_classification,
            yd.educational_background,
            yd.work_status,
            ys.registered_voter,
            ys.registered_national_voter,
            ys.vote_last_election
            FROM sk_youth y 
            LEFT JOIN sk_youth_demographics yd ON y.youth_id = yd.youth_id 
            LEFT JOIN sk_youth_survey yn ON y.youth_id = yn.youth_id
            WHERE y.youth_id = $1 
            `,
            [youth_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'Error',
                data: rows[0]
            });
        }

        res.status(200).json({
            status: 'Success',
            data: rows[0]
        });

    } catch (error) {
        console.error('Failed to fetch youth showAccountName:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal server error'
        });
    }
}

export const showMeetingHousehold = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'youth') {
        return res.json({
            status: 'Error',
            message: 'Forbidden - You cannot access this youth data'
        });
    }

    try {
        const { rows } = await pool.query(`
            SELECT
            y.youth_id,
            ym.attended,
            ym.times_attended,
            ym.reason_not_attend,
            yh.household
            FROM sk_youth y
            LEFT JOIN sk_youth_meeting_survey ym ON y.youth_id = ym,.youth_id
            LEFT JOIN sk_youth_household yh ON y.youth_id = yh,.youth_id
            WHERE y.youth_id = $1
            `,
            [youth_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'Youth not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            data: rows[0]
        });
    } catch (error) {
        console.error('Failed to fetch youth showAccountName:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal server error'
        });
    }
}

