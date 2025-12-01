import { pool } from "../db/config.js";

export const index = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query("SELECT * FROM forms");
        console.log("Forms", result.rows);
        res.status(200).json({
            status: "Error",
            message: "Internal server error"
        });
    } catch (error) {
        console.error("Failed to fetch Forms:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const show = async (req, res) => {
    const { id: form_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {

        const { rows } = await pool.query(
            `
           SELECT 
                f.form_id,
                f.title,
                f.description,
                f.created_at,
                f.updated_at,
                f.deleted_at,
                o.official_id,
                o.full_name AS official_name,
                o.position AS official_position,
                r.replied_id,
                r.youth_id,
                r.response
            FROM forms f
            INNER JOIN sk_official o 
                ON f.official_id = o.official_id
            LEFT JOIN replied_forms r 
                ON f.form_id = r.form_id
            WHERE f.form_id = $1
            AND f.deleted_at IS NULL
            `, [form_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Form not found"
            });
        }

        const form = {
            form_id: rows[0].form_id,
            title: rows[0].title,
            description: rows[0].description,
            created_at: rows[0].created_at,
            updated_at: rows[0].updated_at,
            deleted_at: rows[0].deleted_at,
            official: {
                official_id: rows[0].official_id,
                name: rows[0].official_name,
                position: rows[0].official_position
            },
            replies: rows
                .filter(row => row.replied_id)
                .map(row => ({
                    replied_id: row.replied_id,
                    youth_id: row.youth_id,
                    response: row.response
                }))
        };

        return res.status(200).json({
            status: "Success",
            data: form
        });

    } catch (error) {
        console.error("Failed to fetch form details: ", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const createForm = async (req, res) => {
    const user = req.user;
    const { title, description } = req.body;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    if (!title || title.trim() === "" || !description || description.trim() === "") {
        return res.status(400).json({
            status: "Error",
            message: "Title and description is required"
        });
    }

    try {
        const { rows } = await pool.query(
            `
            INSERT INTO froms (official_Id, title, description)
            VALUES ($1, $2, $3)
            RETURNNING form_id, official_id, title, description, created_at, updated_at
            `, [user.official_id, title.trim(), description.trim()]
        );

        return res.status(201).json({
            status: "Success",
            message: "Form created successfully",
            data: rows[0]
        });

    } catch (error) {
        console.error("Failed to create a form: ", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const updateForm = async (req, res) => {
    const user = req.user;
    const { id: form_id } = req.params;
    const {
        title,
        description
    } = req.body;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can update forms"
        });
    }

    if (!title || title.trim() === "" || !description || description.trim() === "") {
        return res.status(400).json({
            status: "Error",
            message: "Title and description is required"
        });
    }

    try {

        const { rows } = await pool.query(
            `
            UPDATE form 
            SET title = $1
                description = $2
                updated_at = CURRENT_TIMESTAMP
            WHERE form_id = $3
              AND official_id = 4
              AND deleted_at IS NULL
            RETURNING form_id, official_id, title, description, created_at, updated_at
            `,
            [
                title.trim(),
                description.trim(),
                form_id,
                user.official_id
            ]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Form not found"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Form updated successfully",
            data: rows[0]
        });
    } catch (error) {

        console.error("Error updating form:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });

    }
};

export const deletForm = async (req, res) => {
    const user = req.user;
    const { id: form_id } = req.params;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can update forms"
        });
    }

    try {
        const { rows } = await pool.query(
            `
             UPDATE forms
            SET deleted_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE form_id = $1
              AND official_id = $2
              AND deleted_at IS NULL
            RETURNING form_id, official_id, title, description, created_at, updated_at, deleted_at
            `, [
            form_id, user.official_id
        ]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Form not found or already deleted"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Form deleted successfully",
            data: rows[0]
        });

    } catch (error) {
        console.error("Error deleting form:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};