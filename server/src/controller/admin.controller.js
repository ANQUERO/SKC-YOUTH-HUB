import { pool } from '../db/config.js';

export const index = async (req, res) => {
    const user = req.user;

    // Only allow admin users
    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query('SELECT * FROM sk_official_admin');

        res.status(200).json({
            status: "Success",
            data: result.rows
        });

    } catch (error) {
        console.error("Failed to fetch admin data:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const show = async (req, res) => {
    const { id: admin_id } = req.params;
    const user = req.user;

    // Only allow admin users
    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query('SELECT * FROM sk_official_admin WHERE admin_id = $1', [admin_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            status: "Success",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Failed to fetch admin data:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};
