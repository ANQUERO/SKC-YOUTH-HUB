import { pool } from '../db/config.js';
import { hashPassword } from '../lib/index.js'

export const index = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM sk_official_admin'
        );
        res.status(200).json({
            status: 'success',
            admins: result.rows,
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
        const { admin_id } = req.params;

        if (!admin_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const result = await pool.query({
            text: `SELECT * FROM sk_official_admin WHERE admin_id = $1`,
            values: [admin_id],
        });

        const admin = result.rows[0];

        if (!admin) {
            return res.status(404).json({
                status: 'failed',
                message: 'Admin not found',
            });
        }

        res.status(200).json({
            status: 'success',
            admin,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

export const update = async (req, res) => {
    try {

        const { admin_id } = req.params;

        if (!admin_id) {
            return res.status(400).json({ error: "User id is required" });
        }

        const allowedFields = ['first_name', 'last_name', 'email', 'role', 'position', 'password'];
        const updates = [];
        const values = [];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                // Hash the password if it's present
                if (field === 'password') {
                    const hashedPassword = await hashPassword(req.body.password);
                    updates.push(`${field} = $${values.length + 1}`);
                    values.push(hashedPassword);
                } else {
                    updates.push(`${field} = $${values.length + 1}`);
                    values.push(req.body[field]);
                }
            }
        }

        if (updates.length === 0) {
            return res.status(200).json({
                status: "failed",
                message: "No valid fields provided for update",
            });
        }

        const adminIdPosition = values.length + 1;
        values.push(admin_id);

        const result = await pool.query(
            `UPDATE sk_official_admin SET ${updates.join(', ')} WHERE admin_id = $${adminIdPosition} RETURNING *`,
            values
        );

        res.status(200).json({
            status: 'success',
            message: 'Admin updated successfully',
            admin: result.rows[0],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

export const disable = async (req, res) => {

    const { admin_id } = req.params;
    const { role } = req.body;

    if (!admin_id) {
        return res.status(400).json({
            status: "failed",
            message: "Admin ID is required"
        });
    }

    if (role !== 'super_sk_admin') {
        return res.status(403).json({
            status: "failed",
            message: "You do not have permission to disable an admin account"
        });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM sk_official_admin WHERE admin_id = $1',
            [admin_id]
        );

        const admin = result.rows[0];

        if (!admin) {
            return res.status(404).json({
                status: 'failed',
                message: 'Admin not found'
            });
        }

        if (admin.role === 'super_sk_admin') {
            return res.status(400).json({
                status: 'failed',
                message: 'You cannot disable another admin if you are not a super admin'
            });
        }

        const updateResult = await pool.query(
            `UPDATE sk_official_admin 
            SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP 
            WHERE admin_id = $1 
             RETURNING *`,
            [admin_id]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Admin account disabled successfully',
            admin: updateResult.rows[0]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'failed',
            message: 'An error occurred while disabling the admin account',
            error: error.message
        });
    }
};

export const enable = async (req, res) => {
    const { admin_id } = req.params;
    const { role } = req.body;

    try {
        if (!admin_id) {
            return res.status(400).json({
                status: "failed",
                message: "Admin ID is required"
            });
        }

        if (role !== 'super_sk_admin') {
            return res.status(403).json({
                status: "failed",
                message: "You do not have permission to disable an admin account"
            });
        }

        const updateResult = await pool.query(
            `UPDATE sk_official_admin 
             SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP 
             WHERE admin_id = $1 
             RETURNING *`,
            [admin_id]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Admin account Enabled successfully',
            admin: updateResult.rows[0]
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'failed',
            message: 'An error occurred while disabling the admin account',
            error: error.message
        });
    }

}



