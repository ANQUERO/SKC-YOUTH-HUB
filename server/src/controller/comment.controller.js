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
        // Check if user is banned from commenting
        if (user.userType === "youth") {
            const youthCheck = await pool.query(
                "SELECT comment_status FROM sk_youth WHERE youth_id = $1",
                [user.youth_id]
            );
            if (youthCheck.rows.length === 0 || !youthCheck.rows[0].comment_status) {
                return res.status(403).json({
                    status: "Error",
                    message: "You are banned from commenting"
                });
            }
        } else if (user.userType === "official") {
            const officialCheck = await pool.query(
                "SELECT is_active FROM sk_official WHERE official_id = $1",
                [user.official_id]
            );
            if (officialCheck.rows.length === 0 || !officialCheck.rows[0].is_active) {
                return res.status(403).json({
                    status: "Error",
                    message: "Your account is deactivated"
                });
            }
        }

        const authorId = user.userType === "official" ? user.official_id : user.youth_id;
        const { rows } = await pool.query(
            `
            INSERT INTO post_comments (post_id, user_type, user_id, content, parent_comment_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [post_id, user.userType, authorId, content.trim(), parent_comment_id || null]
        );

        // Notify everyone about the new comment/reply
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

            // Get all active officials (excluding the comment author if they're an official)
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

            // Get all verified and active youth members (excluding the comment author if they're a youth)
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

            const commentId = rows[0].comment_id;

            // Create notifications for all officials
            for (const official of officialsResult.rows) {
                await pool.query(
                    `
                    INSERT INTO notifications 
                    (recipient_type, recipient_id, notification_type, post_id, comment_id, actor_type, actor_id, actor_name)
                    VALUES ('official', $1, 'comment', $2, $3, $4, $5, $6)
                    `,
                    [official.official_id, post_id, commentId, user.userType, authorId, actorName]
                );
            }

            // Create notifications for all youth members
            console.log(`Creating notifications for ${youthResult.rows.length} youth members`);
            for (const youth of youthResult.rows) {
                try {
                    await pool.query(
                        `
                        INSERT INTO notifications 
                        (recipient_type, recipient_id, notification_type, post_id, comment_id, actor_type, actor_id, actor_name)
                        VALUES ('youth', $1, 'comment', $2, $3, $4, $5, $6)
                        `,
                        [youth.youth_id, post_id, commentId, user.userType, authorId, actorName]
                    );
                } catch (insertError) {
                    console.error(`Error creating notification for youth ${youth.youth_id}:`, insertError);
                }
            }
            console.log(`Successfully created ${youthResult.rows.length} notifications for youth members`);
        } catch (notifError) {
            // Log error but don't fail the comment creation
            console.error("Error creating notifications:", notifError);
            console.error("Notification error details:", {
                message: notifError.message,
                stack: notifError.stack,
                post_id,
                commentId: rows[0]?.comment_id,
                authorId,
                userType: user.userType
            });
        }

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
        const authorId = user.userType === "official" ? user.official_id : user.youth_id;
        const { rows } = await pool.query(
            `
            UPDATE post_comments
            SET content = $1, updated_at = CURRENT_TIMESTAMP
            WHERE comment_id = $2 AND user_type = $3 AND user_id = $4
            RETURNING *
            `,
            [content.trim(), comment_id, user.userType, authorId]
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

// Delete comment (permanent deletion)
export const deleteComment = async (req, res) => {
    const user = req.user;
    const { comment_id } = req.params;

    try {
        let rows;
        if (user.userType === "official") {
            // Officials can delete any comment
            const result = await pool.query(
                `
                DELETE FROM post_comments
                WHERE comment_id = $1
                RETURNING *
                `,
                [comment_id]
            );
            rows = result.rows;
        } else {
            // Youth can only delete their own comments
            const authorId = user.youth_id;
            const result = await pool.query(
                `
                DELETE FROM post_comments
                WHERE comment_id = $1 AND user_type = 'youth' AND user_id = $2
                RETURNING *
                `,
                [comment_id, authorId]
            );
            rows = result.rows;
        }

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

// Hide comment (moderation action)
export const hideComment = async (req, res) => {
    const user = req.user;
    const { comment_id } = req.params;
    const { reason } = req.body;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can hide comments"
        });
    }

    try {
        const { rows } = await pool.query(
            `
            UPDATE post_comments
            SET is_hidden = TRUE, hidden_by = $1, hidden_reason = $2, updated_at = CURRENT_TIMESTAMP
            WHERE comment_id = $3
            RETURNING *
            `,
            [user.official_id, reason || "Hidden by moderator", comment_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Comment not found"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Comment hidden successfully",
            data: rows[0]
        });

    } catch (error) {
        console.error("Error hiding comment:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};

// Unhide comment
export const unhideComment = async (req, res) => {
    const user = req.user;
    const { comment_id } = req.params;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can unhide comments"
        });
    }

    try {
        const { rows } = await pool.query(
            `
            UPDATE post_comments
            SET is_hidden = FALSE, hidden_by = NULL, hidden_reason = NULL, updated_at = CURRENT_TIMESTAMP
            WHERE comment_id = $1
            RETURNING *
            `,
            [comment_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Comment not found"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Comment unhidden successfully",
            data: rows[0]
        });

    } catch (error) {
        console.error("Error unhiding comment:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};

// Ban user from commenting
export const banUserFromCommenting = async (req, res) => {
    const user = req.user;
    const { user_id, user_type } = req.params;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can ban users"
        });
    }

    // Check if current user has permission to ban
    if (user.userType === "official") {
        const currentUserRole = await pool.query(
            "SELECT role FROM sk_official WHERE official_id = $1",
            [user.official_id]
        );

        if (currentUserRole.rows.length === 0) {
            return res.status(403).json({
                status: "Error",
                message: "User not found"
            });
        }

        const currentRole = currentUserRole.rows[0].role;

        // Super officials can ban anyone, natural officials can only ban youth
        if (currentRole === "natural_official" && user_type === "official") {
            return res.status(403).json({
                status: "Error",
                message: "Natural officials can only ban youth members"
            });
        }
    }

    try {
        let result;
        if (user_type === "youth") {
            result = await pool.query(
                "UPDATE sk_youth SET comment_status = FALSE WHERE youth_id = $1 RETURNING *",
                [user_id]
            );
        } else if (user_type === "official") {
            result = await pool.query(
                "UPDATE sk_official SET is_active = FALSE WHERE official_id = $1 RETURNING *",
                [user_id]
            );
        } else {
            return res.status(400).json({
                status: "Error",
                message: "Invalid user type"
            });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "User not found"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: `${user_type} banned successfully`,
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Error banning user:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};

// Unban user from commenting
export const unbanUserFromCommenting = async (req, res) => {
    const user = req.user;
    const { user_id, user_type } = req.params;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can unban users"
        });
    }

    try {
        let result;
        if (user_type === "youth") {
            result = await pool.query(
                "UPDATE sk_youth SET comment_status = TRUE WHERE youth_id = $1 RETURNING *",
                [user_id]
            );
        } else if (user_type === "official") {
            result = await pool.query(
                "UPDATE sk_official SET is_active = TRUE WHERE official_id = $1 RETURNING *",
                [user_id]
            );
        } else {
            return res.status(400).json({
                status: "Error",
                message: "Invalid user type"
            });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "User not found"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: `${user_type} unbanned successfully`,
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Error unbanning user:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};

// Fetch all comments (nested structure)
export const getComments = async (req, res) => {
    const { post_id } = req.params;
    const user = req.user;

    try {
        const { rows } = await pool.query(
            `
            SELECT 
                c.comment_id,
                c.parent_comment_id,
                c.content,
                c.user_type,
                c.user_id,
                c.is_hidden,
                c.hidden_by,
                c.hidden_reason,
                c.created_at,
                c.updated_at,
                CASE 
                    WHEN c.user_type = 'official' THEN (SELECT CONCAT(n.first_name, ' ', n.last_name) FROM sk_official_name n WHERE n.official_id = c.user_id)
                    WHEN c.user_type = 'youth' THEN (SELECT CONCAT(n.first_name, ' ', n.last_name) FROM sk_youth_name n WHERE n.youth_id = c.user_id)
                END AS user_name,
                CASE 
                    WHEN c.user_type = 'official' THEN (SELECT o.role FROM sk_official o WHERE o.official_id = c.user_id)
                    ELSE NULL
                END AS user_role
            FROM post_comments c
            WHERE c.post_id = $1
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

        // Filter out hidden comments for non-officials
        const filterHiddenComments = (comments) => {
            return comments.filter(comment => {
                if (comment.is_hidden && (!user || user.userType !== "official")) {
                    return false;
                }
                if (comment.replies && comment.replies.length > 0) {
                    comment.replies = filterHiddenComments(comment.replies);
                }
                return true;
            });
        };

        const filteredComments = user && user.userType === "official" ? rootComments : filterHiddenComments(rootComments);

        return res.status(200).json({
            status: "Success",
            count: rows.length,
            data: filteredComments
        });

    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};
