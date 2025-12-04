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

            // Notify everyone about the new reaction
            try {
                // Get actor's name
                let actorName = "";
                if (user.userType === "official") {
                    const nameResult = await pool.query(
                        `SELECT CONCAT(first_name, ' ', last_name) as name 
                         FROM sk_official_name WHERE official_id = $1`,
                        [authorId]
                    );
                    actorName = nameResult.rows[0]?.name || "An official";
                } else {
                    const nameResult = await pool.query(
                        `SELECT CONCAT(first_name, ' ', last_name) as name 
                         FROM sk_youth_name WHERE youth_id = $1`,
                        [authorId]
                    );
                    actorName = nameResult.rows[0]?.name || "A youth member";
                }

                // Get all active officials (excluding the reaction author if they're an official)
                let officialsResult;
                if (user.userType === "official") {
                    officialsResult = await pool.query(
                        `SELECT official_id FROM sk_official 
                         WHERE is_active = TRUE AND deleted_at IS NULL AND official_id != $1`,
                        [authorId]
                    );
                } else {
                    officialsResult = await pool.query(
                        `SELECT official_id FROM sk_official 
                         WHERE is_active = TRUE AND deleted_at IS NULL`
                    );
                }

                // Get all verified and active youth members (excluding the reaction author if they're a youth)
                let youthResult;
                if (user.userType === "youth") {
                    youthResult = await pool.query(
                        `SELECT youth_id FROM sk_youth 
                         WHERE verified = TRUE AND is_active = TRUE AND deleted_at IS NULL AND youth_id != $1`,
                        [authorId]
                    );
                } else {
                    youthResult = await pool.query(
                        `SELECT youth_id FROM sk_youth 
                         WHERE verified = TRUE AND is_active = TRUE AND deleted_at IS NULL`
                    );
                }

                // Create notifications for all officials
                for (const official of officialsResult.rows) {
                    await pool.query(
                        `
                        INSERT INTO notifications 
                        (recipient_type, recipient_id, notification_type, post_id, actor_type, actor_id, actor_name)
                        VALUES ('official', $1, 'reaction', $2, $3, $4, $5)
                        `,
                        [official.official_id, post_id, user.userType, authorId, actorName]
                    );
                }

                // Create notifications for all youth members
                console.log(`Creating notifications for ${youthResult.rows.length} youth members`);
                for (const youth of youthResult.rows) {
                    try {
                        await pool.query(
                            `
                            INSERT INTO notifications 
                            (recipient_type, recipient_id, notification_type, post_id, actor_type, actor_id, actor_name)
                            VALUES ('youth', $1, 'reaction', $2, $3, $4, $5)
                            `,
                            [youth.youth_id, post_id, user.userType, authorId, actorName]
                        );
                    } catch (insertError) {
                        console.error(`Error creating notification for youth ${youth.youth_id}:`, insertError);
                    }
                }
                console.log(`Successfully created ${youthResult.rows.length} notifications for youth members`);
            } catch (notifError) {
                // Log error but don't fail the reaction creation
                console.error("Error creating notifications:", notifError);
                console.error("Notification error details:", {
                    message: notifError.message,
                    stack: notifError.stack,
                    post_id,
                    authorId,
                    userType: user.userType
                });
            }
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
