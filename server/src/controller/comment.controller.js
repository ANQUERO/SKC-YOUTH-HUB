import { pool } from "../db/config.js";

// Add a comment or reply
export const createComment = async (req, res) => {
    const user = req.user;
    const { post_id } = req.params;
    const { content, parent_comment_id } = req.body;

    if (!user || !["official", "youth"].includes(user.userType)) {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials and youth can comment"
        });
    }

    if (!content || content.trim() === "") {
        return res.status(400).json({
            status: "Error",
            message: "Content is required"
        });
    }

    try {
        const { rows } = await pool.query(
            `
            INSERT INTO post_comments (post_id, user_type, user_id, content, parent_comment_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [post_id, user.userType, user.user_id, content.trim(), parent_comment_id || null]
        );

        return res.status(201).json({
            status: "Success",
            message: "Comment added successfully",
            data: rows[0]
        });

    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};

// Update comment
export const updateComment = async (req, res) => {
    const user = req.user;
    const { comment_id } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
        return res.status(400).json({
            status: "Error",
            message: "Content is required"
        });
    }

    try {
        const { rows } = await pool.query(
            `
            UPDATE post_comments
            SET content = $1, updated_at = CURRENT_TIMESTAMP
            WHERE comment_id = $2 AND user_type = $3 AND user_id = $4 AND deleted_at IS NULL
            RETURNING *
            `,
            [content.trim(), comment_id, user.userType, user.user_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Comment not found or you are not the owner"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Comment updated successfully",
            data: rows[0]
        });

    } catch (error) {
        console.error("Error updating comment:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};

// Delete (soft delete) comment
export const deleteComment = async (req, res) => {
    const user = req.user;
    const { comment_id } = req.params;

    try {
        const { rows } = await pool.query(
            `
            UPDATE post_comments
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE comment_id = $1 AND user_type = $2 AND user_id = $3 AND deleted_at IS NULL
            RETURNING *
            `,
            [comment_id, user.userType, user.user_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Comment not found or you are not the owner"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};

// Fetch all comments (nested structure)
export const getComments = async (req, res) => {
    const { post_id } = req.params;

    try {
        const { rows } = await pool.query(
            `
            SELECT 
                c.comment_id,
                c.parent_comment_id,
                c.content,
                c.user_type,
                c.user_id,
                c.created_at,
                c.updated_at,
                CASE 
                    WHEN c.user_type = 'official' THEN (SELECT CONCAT(n.first_name, ' ', n.last_name) FROM sk_official_name n WHERE n.official_id = c.user_id)
                    WHEN c.user_type = 'youth' THEN (SELECT CONCAT(n.first_name, ' ', n.last_name) FROM sk_youth_name n WHERE n.youth_id = c.user_id)
                END AS user_name
            FROM post_comments c
            WHERE c.post_id = $1 AND c.deleted_at IS NULL
            ORDER BY c.created_at ASC
            `,
            [post_id]
        );

        // Build nested comment tree
        const commentMap = {};
        const rootComments = [];

        rows.forEach(comment => {
            comment.replies = [];
            commentMap[comment.comment_id] = comment;

            if (comment.parent_comment_id) {
                const parent = commentMap[comment.parent_comment_id];
                if (parent) {
                    parent.replies.push(comment);
                }
            } else {
                rootComments.push(comment);
            }
        });

        return res.status(200).json({
            status: "Success",
            count: rows.length,
            data: rootComments
        });

    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};
