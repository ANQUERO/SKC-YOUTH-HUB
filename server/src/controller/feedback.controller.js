import { pool } from "../db/config.js";

// Get all feedback forms (for youth to view and answer)
export const getFeedbackForms = async (req, res) => {
    const user = req.user;

    if (!user || !["official", "youth"].includes(user.userType)) {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Authentication required"
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT 
                f.form_id,
                f.title,
                f.description,
                f.created_at,
                f.updated_at,
                CONCAT(n.first_name, ' ', n.last_name) AS official_name,
                o.official_position,
                COUNT(r.replied_id) as reply_count
            FROM forms f
            INNER JOIN sk_official o ON f.official_id = o.official_id
            LEFT JOIN sk_official_name n ON o.official_id = n.official_id
            LEFT JOIN replied_forms r ON f.form_id = r.form_id
            WHERE f.deleted_at IS NULL AND f.is_hidden = FALSE
            GROUP BY f.form_id, f.title, f.description, f.created_at, f.updated_at, n.first_name, n.last_name, o.official_position
            ORDER BY f.created_at DESC
            `
        );

        return res.status(200).json({
            status: "Success",
            data: result.rows
        });
    } catch (error) {
        console.error("Failed to fetch feedback forms:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Get a single feedback form (for youth to answer)
export const getFeedbackForm = async (req, res) => {
    const { id: form_id } = req.params;
    const user = req.user;

    if (!user || !["official", "youth"].includes(user.userType)) {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Authentication required"
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT 
                f.form_id,
                f.title,
                f.description,
                f.created_at,
                f.updated_at,
                CONCAT(n.first_name, ' ', n.last_name) AS official_name,
                o.official_position
            FROM forms f
            INNER JOIN sk_official o ON f.official_id = o.official_id
            LEFT JOIN sk_official_name n ON o.official_id = n.official_id
            WHERE f.form_id = $1 AND f.deleted_at IS NULL AND f.is_hidden = FALSE
            `, [form_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Feedback form not found"
            });
        }

        // Check if youth has already replied
        let hasReplied = false;
        if (user.userType === "youth") {
            const replyCheck = await pool.query(
                `SELECT replied_id FROM replied_forms WHERE form_id = $1 AND youth_id = $2`,
                [form_id, user.youth_id]
            );
            hasReplied = replyCheck.rows.length > 0;
        }

        return res.status(200).json({
            status: "Success",
            data: {
                ...result.rows[0],
                has_replied: hasReplied
            }
        });
    } catch (error) {
        console.error("Failed to fetch feedback form:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Create feedback form (officials only)
export const createFeedbackForm = async (req, res) => {
    const user = req.user;
    const { title, description } = req.body;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can create feedback forms"
        });
    }

    if (!title || title.trim() === "" || !description || description.trim() === "") {
        return res.status(400).json({
            status: "Error",
            message: "Title and description are required"
        });
    }

    try {
        const { rows } = await pool.query(
            `
            INSERT INTO forms (official_id, title, description)
            VALUES ($1, $2, $3)
            RETURNING form_id, official_id, title, description, created_at, updated_at
            `, [user.official_id, title.trim(), description.trim()]
        );

        return res.status(201).json({
            status: "Success",
            message: "Feedback form created successfully",
            data: rows[0]
        });
    } catch (error) {
        console.error("Failed to create feedback form:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Submit feedback reply (youth only)
export const submitFeedbackReply = async (req, res) => {
    const { id: form_id } = req.params;
    const user = req.user;
    const { response } = req.body;

    if (!user || user.userType !== "youth") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only youth can submit feedback replies"
        });
    }

    if (!response || response.trim() === "") {
        return res.status(400).json({
            status: "Error",
            message: "Response is required"
        });
    }

    try {
        // Check if form exists and is not hidden
        const formCheck = await pool.query(
            `SELECT form_id FROM forms WHERE form_id = $1 AND deleted_at IS NULL AND is_hidden = FALSE`,
            [form_id]
        );

        if (formCheck.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Feedback form not found"
            });
        }

        // Check if youth has already replied
        const existingReply = await pool.query(
            `SELECT replied_id FROM replied_forms WHERE form_id = $1 AND youth_id = $2`,
            [form_id, user.youth_id]
        );

        if (existingReply.rows.length > 0) {
            // Update existing reply
            const { rows } = await pool.query(
                `
                UPDATE replied_forms
                SET response = $1
                WHERE form_id = $2 AND youth_id = $3
                RETURNING *
                `,
                [response.trim(), form_id, user.youth_id]
            );

            return res.status(200).json({
                status: "Success",
                message: "Feedback reply updated successfully",
                data: rows[0]
            });
        } else {
            // Create new reply
            const { rows } = await pool.query(
                `
                INSERT INTO replied_forms (form_id, youth_id, response)
                VALUES ($1, $2, $3)
                RETURNING *
                `,
                [form_id, user.youth_id, response.trim()]
            );

            return res.status(201).json({
                status: "Success",
                message: "Feedback reply submitted successfully",
                data: rows[0]
            });
        }
    } catch (error) {
        console.error("Failed to submit feedback reply:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

