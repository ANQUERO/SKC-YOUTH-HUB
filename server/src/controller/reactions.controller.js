import { pool } from "../db/config.js";

// Add or update a reaction
export const createReaction = async (req, res) => {
    const user = req.user;
    const { post_id } = req.params;
    const { type } = req.body; // like, heart, wow

    if (!user || !["official", "youth"].includes(user.userType)) {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials and youth can react"
        });
    }

    if (!["like", "heart", "wow"].includes(type)) {
        return res.status(400).json({
            status: "Error",
            message: "Invalid reaction type"
        });
    }

    try {
        const authorId = user.userType === "official" ? user.official_id : user.youth_id;
        // Check if user already reacted to this post
        const check = await pool.query(
            `
            SELECT reaction_id FROM post_reactions
            WHERE post_id = $1 AND user_type = $2 AND user_id = $3
            `,
            [post_id, user.userType, authorId]
        );

        let reaction;

        if (check.rows.length > 0) {
            // Update reaction type if already exists
            const update = await pool.query(
                `
                UPDATE post_reactions
                SET type = $1, reacted_at = CURRENT_TIMESTAMP
                WHERE reaction_id = $2
                RETURNING *
                `,
                [type, check.rows[0].reaction_id]
            );
            reaction = update.rows[0];
        } else {
            // Insert new reaction
            const insert = await pool.query(
                `
                INSERT INTO post_reactions (post_id, user_type, user_id, type)
                VALUES ($1, $2, $3, $4)
                RETURNING *
                `,
                [post_id, user.userType, authorId, type]
            );
            reaction = insert.rows[0];
        }

        return res.status(201).json({
            status: "Success",
            message: "Reaction saved",
            data: reaction
        });

    } catch (error) {
        console.error("Error creating reaction:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Remove (soft delete) a reaction
export const removeReaction = async (req, res) => {
    const user = req.user;
    const { post_id } = req.params;

    if (!user || !["official", "youth"].includes(user.userType)) {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials and youth can remove reactions"
        });
    }

    try {
        const authorId = user.userType === "official" ? user.official_id : user.youth_id;
        const result = await pool.query(
            `
            DELETE FROM post_reactions
            WHERE post_id = $1 AND user_type = $2 AND user_id = $3
            RETURNING *
            `,
            [post_id, user.userType, authorId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Reaction not found"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Reaction removed"
        });

    } catch (error) {
        console.error("Error removing reaction:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Get all reactions of a post (with counts + users)
export const getReactions = async (req, res) => {
    const { post_id } = req.params;

    try {
        const result = await pool.query(
            `
            SELECT 
                r.reaction_id,
                r.type,
                r.user_type,
                r.user_id,
                r.reacted_at,
                CASE 
                    WHEN r.user_type = 'official' THEN (SELECT CONCAT(n.first_name, ' ', n.last_name) FROM sk_official_name n WHERE n.official_id = r.user_id)
                    WHEN r.user_type = 'youth' THEN (SELECT CONCAT(n.first_name, ' ', n.last_name) FROM sk_youth_name n WHERE n.youth_id = r.user_id)
                END AS user_name
            FROM post_reactions r
            WHERE r.post_id = $1
            ORDER BY r.reacted_at DESC
            `,
            [post_id]
        );

        return res.status(200).json({
            status: "Success",
            count: result.rows.length,
            data: result.rows
        });

    } catch (error) {
        console.error("Error fetching reactions:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};
