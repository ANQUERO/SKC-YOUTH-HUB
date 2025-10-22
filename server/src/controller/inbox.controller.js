import {pool} from '../db/config.js'

export const index = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== 'offcial') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query('SELECT * FROM forms');
        
        res.status(200).json({
            status: "Success",
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
}

export const show = async (req, res) => {
    const {id: form_id} = req.params;
    const user = req.user;

    if (!user || user.userType !== 'official') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admin can access this resource"
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT * FROM forms WHERE form_id = $1
            `, [form_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Form not found "
            });
        }

        res.status(200).json({
            status: "Success",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Failed to fetch forms data: ", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }

    
}