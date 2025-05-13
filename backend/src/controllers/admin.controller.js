import { pool } from '../db/config.js';


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
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "User id is required" });
        }

        const result = await pool.query({
            text: `SELECT * FROM sk_official_admin WHERE id  = $1`,
            values: [email],
        });

        const admin = result.rows[0];

        if (!id) {
            return res.status(401).json({
                status: 'failed',
                message: 'Admins not found'
            });
        }

        res.status(200).json({
            status: 'success',
            admin
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "failed",
            message: error.message,
        });
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "User id is required" });
        }

        const allowedFields = ['first_name', 'last_name', 'email', 'organization', 'password'];
        const updates = [];
        const values = [];

        allowedFields.forEach((field, index) => {
            if (req.body[field] !== undefined) {
                updates.push(`${field} = $${values, length + 1}`);
                values.push(req.body[field]);
            }
        });

        if (updates.length === 0) {
            return res.status(200).json({
                status: "failed",
                message: "No valid fields provided for update",
            });
        };

        values.push(id);

        const result = await pool.query(
            `UPDATE sk_official_admin SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`
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


}

export const disable = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(200).json({
            status: "failed",
            message: "Super Admin ID is required"
        });
    }

    

}


