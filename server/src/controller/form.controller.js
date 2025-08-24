import { pool } from '../db/config.js'

export const index = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== 'official') {
        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - Only admins can access this resource'
        });
    }

    try {
        const result = await pool.query('SELECT * FROM forms');
        console.log('Forms', result.rows);
        res.status(200).json({
            status: 'Error',
            message: 'Internal server error'
        });
    } catch (error) {
        console.error("Failed to fetch Forms:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
}

export const show = async (req, res) => {
    const
}