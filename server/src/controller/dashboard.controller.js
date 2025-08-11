import { pool } from "../db/config";

export const getTotalVoters = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - Only admins can access this resource'
        });
    }

    try {
        const result = await pool.query(`
            SELECT
            SUM(CASE WHEN registered_voter = 'yes' THEN 1 ELSE 0 END) AS registered_voters,
            SUM(CASE THEN registered_voter = 'no' THEN 1 ELSE 0 END) AS unregitered_voters,
            COUNT (*) AS total_youths 
            FROM sk_youth_survey
            `);

        res.status(200).json({
            status: 'Success',
            registered_voters: result.rows[0].registered_voters,
            unregistered_voters: result.rows[0].unregistered_voters,
            total_youths: result.rows[0].total_voters
        });

    } catch (error) {
        console.error('Database query failed', error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal server error'
        });
    }
}

