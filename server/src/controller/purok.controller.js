import { pool } from '../db/config.js'

export const index = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== 'official') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query('SELECT * FROM purok');
        console.log('Puroks', result.rows);
        res.status(200).json({
            status: "Success",
            data: result.rows
        });
    } catch (error) {
        console.error("Failed to fetch purok data:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const publicIndex = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM purok ORDER BY name');
        console.log('Public Puroks', result.rows);
        res.status(200).json({
            status: "Success",
            data: result.rows
        });
    } catch (error) {
        console.error("Failed to fetch public purok data:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const show = async (req, res) => {
    const { id: purok_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'official') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM purok WHERE purok_id = $1`,
            [purok_id]
        );
        console.log('Purok', result.rows);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Purok not found"
            });
        }

        res.status(200).json({
            status: "Success",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Failed to fetch purok data:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const store = async (req, res) => {
    const { name } = req.body
    const user = req.user;

    if (!user || user.userType !== 'official') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    if (!name || name.trim() === '') {
        return res.status(400).json({
            status: "Error",
            message: "Purok Name is required"
        });
    }

    try {
        const existing = await pool.query(
            `SELECT * FROM purok WHERE name = $1`,
            [name.trim()]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                status: "Error",
                message: "Purok name already exist"
            });
        }

        const result = await pool.query(
            `INSERT INTO purok (name) VALUES ($1) RETURNING *`,
            [name.trim()]
        );

        res.status(201).json({
            status: "Success",
            message: "Purok created successfully",
            data: result.rows[0]
        });


    } catch (error) {
        console.error("Failed to create purok", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
}

export const update = async (req, res) => {
    const { id: purok_id } = req.params;
    const { name } = req.body;
    const user = req.user;

    if (!user || user.userType !== 'official') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    if (!name || name.trim() === '') {
        return res.status(400).json({
            status: "Error",
            message: "Purok Name is required"
        });
    }

    try {
        const result = await pool.query(
            `UPDATE purok SET name = $1 WHERE purok_id = $2 RETURNING *`,
            [name, purok_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Purok not found"
            });
        }


        res.status(200).json({
            status: "Success",
            data: result.rows[0]
        });


    } catch (error) {
        console.error("Failed to update purok:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};


export const destroy = async (req, res) => {
    const { id: purok_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'official') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            `DELETE FROM purok WHERE purok_id = $1 RETURNING *`,
            [purok_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Purok not found"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Purok deleted successfully"
        });
    } catch (error) {
        console.error("Failed to delete purok:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const totalResidence = async (req, res) => {
    const { id: purok_id } = req.params
    const user = req.user

    if (!user || user.userType !== 'official') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            `SELECT `
        )
    } catch (error) {

    }
}

