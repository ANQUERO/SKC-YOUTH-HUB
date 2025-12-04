import { pool } from "../db/config.js";

// Get all feedback forms with replies for inbox (officials only)
export const index = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can access inbox",
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
                COUNT(DISTINCT r.replied_id) as reply_count,
                COUNT(DISTINCT CASE WHEN r.replied_id IS NOT NULL THEN r.youth_id END) as unique_repliers
            FROM forms f
            LEFT JOIN replied_forms r ON f.form_id = r.form_id
            WHERE f.deleted_at IS NULL
            GROUP BY f.form_id, f.title, f.description, f.created_at, f.updated_at
            ORDER BY f.created_at DESC
            `
        );

        res.status(200).json({
            status: "Success",
            data: result.rows,
        });
    } catch (error) {
        console.error("Failed to fetch inbox:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
        });
    }
};

// Get feedback form with all replies (for inbox detail view)
export const show = async (req, res) => {
    const { id: form_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can access inbox",
        });
    }

    try {
        // Get form details
        const formResult = await pool.query(
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
            WHERE f.form_id = $1 AND f.deleted_at IS NULL
            `, [form_id]
        );

        if (formResult.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Feedback form not found",
            });
        }

        // Get all replies with youth information
        const repliesResult = await pool.query(
            `
            SELECT 
                r.replied_id,
                r.youth_id,
                r.response,
                r.form_id,
                CONCAT(yn.first_name, ' ', yn.last_name) AS youth_name,
                y.email AS youth_email
            FROM replied_forms r
            INNER JOIN sk_youth y ON r.youth_id = y.youth_id
            LEFT JOIN sk_youth_name yn ON r.youth_id = yn.youth_id
            WHERE r.form_id = $1
            ORDER BY r.replied_id DESC
            `, [form_id]
        );

        const form = {
            form_id: formResult.rows[0].form_id,
            title: formResult.rows[0].title,
            description: formResult.rows[0].description,
            created_at: formResult.rows[0].created_at,
            updated_at: formResult.rows[0].updated_at,
            official: {
                official_id: formResult.rows[0].official_id,
                name: formResult.rows[0].official_name,
                position: formResult.rows[0].official_position
            },
            replies: repliesResult.rows.map(row => ({
                replied_id: row.replied_id,
                youth_id: row.youth_id,
                youth_name: row.youth_name,
                youth_email: row.youth_email,
                response: row.response
            }))
        };

        res.status(200).json({
            status: "Success",
            data: form,
        });
    } catch (error) {
        console.error("Failed to fetch inbox details:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error",
        });
    }
};
