import { pool } from '../db/config.js';
import bcrypt from 'bcrypt';

export const index = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query('SELECT * FROM sk_official_admin');
        console.log('Admins', result.rows);
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

    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM sk_official_admin WHERE admin_id = $1',
            [admin_id]
        );
        console.log('Admins', result.rows);


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

export const update = async (req, res) => {
    const { id: admin_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'admin' || parseInt(admin_id) !== user.admin_id) {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - You can only update your own account"
        });
    }

    try {
        const fields = { ...req.body };

        // Handle password separately if provided
        if (fields.password) {
            const saltRounds = 10;
            fields.password = await bcrypt.hash(fields.password, saltRounds);
        } else {
            delete fields.password; // Remove if not updating
        }

        const entries = Object.entries(fields).filter(([_, v]) => v !== undefined && v !== null);
        if (entries.length === 0) {
            return res.status(400).json({
                status: "Error",
                message: "No valid fields provided for update"
            });
        }

        // Build dynamic query
        const setClause = entries
            .map(([key], i) => `${key} = $${i + 1}`)
            .join(', ');

        const values = entries.map(([_, v]) => v);

        const query = `
            UPDATE sk_official_admin
            SET ${setClause}, updated_at = NOW()
            WHERE admin_id = $${values.length + 1}
            RETURNING *;
        `;

        const result = await pool.query(query, [...values, admin_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Admin not found"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Admin profile updated successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update error:', error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const destroy = async (req, res) => {
    const { id: admin_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            'UPDATE sk_official_admin SET is_active = false WHERE admin_id = $1 RETURNING *',
            [admin_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Admin not found"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Admin account disabled successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Failed to disable admin account:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
}

export const enable = async (req, res) => {
    const { id: admin_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            'UPDATE sk_official_admin SET is_active = true WHERE admin_id = $1 RETURNING *',
            [admin_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Admin not found"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Admin account enabled successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Failed to enable admin account:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }

}

export const disableComment = async (req, res) => {
    const { id: admin_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            'UPDATE sk_official_admin SET comment_at = true WHERE admin_id = $1 RETURNING *',
            [admin_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Admin not found"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Admin comment disabled successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Failed to disable admin comment:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }


}

export const enableComment = async (req, res) => {
    const { id: admin_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            'UPDATE sk_official_admin SET comment_at = false WHERE admin_id = $1 RETURNING *',
            [admin_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Admin not found"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Admin comment enabled successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Failed to enable admin comment:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }

}