// Pag-import sa database connection pool gikan sa config file
import { pool } from '../db/config.js';

// Pag-import sa hashPassword function para i-encrypt ang password
import { hashPassword } from '../lib/index.js'

// Function para kuhaon ang tanang admin records
export const index = async (req, res) => {
    try {
        // Pag-query sa database para kuhaon ang tanang admins
        const result = await pool.query(
            'SELECT * FROM sk_official_admin'
        );

        // Pagbalik og successful response ug ang listahan sa admins
        res.status(200).json({
            status: 'success',
            admins: result.rows,
        });

    } catch (error) { 
        // Kung naa'y error, i-log ug i-send balik ang error message
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
}

// Function para kuhaon ang usa ka admin base sa iyang admin_id
export const show = async (req, res) => {
    try {
        // Pagkuha sa admin_id gikan sa URL parameters
        const { admin_id } = req.params;

        // Kung walay admin_id, mo-return og error
        if (!admin_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Pag-query sa database para kuhaon ang admin nga mo-match sa admin_id
        const result = await pool.query({
            text: `SELECT * FROM sk_official_admin WHERE admin_id = $1`,
            values: [admin_id],
        });

        // Pagkuha sa una nga resulta
        const admin = result.rows[0];

        // Kung wala gi-kita ang admin, mo-return og 404 error
        if (!admin) {
            return res.status(404).json({
                status: 'failed',
                message: 'Admin not found',
            });
        }

        // Kung successful, i-return ang admin data
        res.status(200).json({
            status: 'success',
            admin,
        });

    } catch (error) {
        // Kung naa'y error, i-log ug i-return ang error message
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

// Function para i-update ang usa ka admin record
export const update = async (req, res) => {
    try {
        // Pagkuha sa admin_id gikan sa URL parameters
        const { admin_id } = req.params;

        // Kung walay admin_id, mo-return og error
        if (!admin_id) {
            return res.status(400).json({ error: "User id is required" });
        }

        // Listahan sa mga field nga pwede i-update
        const allowedFields = ['first_name', 'last_name', 'email', 'role', 'position', 'password'];
        const updates = [];
        const values = [];

        // Loop para tan-awon kung unsa sa allowedFields ang naa sa request body
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                // Kung password ang field, i-hash una ang password
                if (field === 'password') {
                    const hashedPassword = await hashPassword(req.body.password);
                    updates.push(`${field} = $${values.length + 1}`);
                    values.push(hashedPassword);
                } else {
                    // Kung dili password, i-add lang diretso
                    updates.push(`${field} = $${values.length + 1}`);
                    values.push(req.body[field]);
                }
            }
        }

        // Kung walay gi-provide nga field para i-update, mo-return og error
        if (updates.length === 0) {
            return res.status(200).json({
                status: "failed",
                message: "No valid fields provided for update",
            });
        }

        // Ibutang ang admin_id sa pinakababa nga parameter value
        const adminIdPosition = values.length + 1;
        values.push(admin_id);

        // Pag-update sa database gamit ang gathered fields ug values
        const result = await pool.query(
            `UPDATE sk_official_admin SET ${updates.join(', ')} WHERE admin_id = $${adminIdPosition} RETURNING *`,
            values
        );

        // Pag-return sa updated admin
        res.status(200).json({
            status: 'success',
            message: 'Admin updated successfully',
            admin: result.rows[0],
        });

    } catch (error) {
        // Error handling
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

// Function para i-disable ang usa ka admin account
export const disable = async (req, res) => {
    // Pagkuha sa admin_id ug role gikan sa request
    const { admin_id } = req.params;
    const { role } = req.body;

    // Kung walay admin_id, i-return ang error
    if (!admin_id) {
        return res.status(400).json({
            status: "failed",
            message: "Admin ID is required"
        });
    }

    // Kung dili super_sk_admin ang role, walay access
    if (role !== 'super_sk_admin') {
        return res.status(403).json({
            status: "failed",
            message: "You do not have permission to disable an admin account"
        });
    }

    try {
        // Pag-check kung ang admin exists
        const result = await pool.query(
            'SELECT * FROM sk_official_admin WHERE admin_id = $1',
            [admin_id]
        );

        const admin = result.rows[0];

        // Kung wala gi-kita ang admin
        if (!admin) {
            return res.status(404).json({
                status: 'failed',
                message: 'Admin not found'
            });
        }

        // Kung super admin ang gusto i-disable, i-block ang request
        if (admin.role === 'super_sk_admin') {
            return res.status(400).json({
                status: 'failed',
                message: 'You cannot disable another admin if you are not a super admin'
            });
        }

        // Pag-disable sa admin: set is_active = FALSE ug i-update ang timestamp
        const updateResult = await pool.query(
            `UPDATE sk_official_admin 
            SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP 
            WHERE admin_id = $1 
             RETURNING *`,
            [admin_id]
        );

        // Pagbalik og success message
        return res.status(200).json({
            status: 'success',
            message: 'Admin account disabled successfully',
            admin: updateResult.rows[0]
        });

    } catch (error) {
        // Pag handle sa error
        console.error(error);
        return res.status(500).json({
            status: 'failed',
            message: 'An error occurred while disabling the admin account',
            error: error.message
        });
    }
};

// Function para i-enable balik ang admin account
export const enable = async (req, res) => {
    const { admin_id } = req.params;
    const { role } = req.body;

    try {
        // Kung walay admin_id, i-return og error
        if (!admin_id) {
            return res.status(400).json({
                status: "failed",
                message: "Admin ID is required"
            });
        }

        // Kung dili super_sk_admin, walay permission
        if (role !== 'super_sk_admin') {
            return res.status(403).json({
                status: "failed",
                message: "You do not have permission to disable an admin account"
            });
        }

        // I-enable ang admin account: set is_active = TRUE
        const updateResult = await pool.query(
            `UPDATE sk_official_admin 
            SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP 
            WHERE admin_id = $1 
             RETURNING *`,
            [admin_id]
        );

        // Pagbalik og success response
        return res.status(200).json({
            status: 'success',
            message: 'Admin account Enabled successfully',
            admin: updateResult.rows[0]
        });

    } catch (error) {
        // Pag handle sa error
        console.error(error);
        return res.status(500).json({
            status: 'failed',
            message: 'An error occurred while disabling the admin account',
            error: error.message
        });
    }
};
