import { pool } from "../db/config.js";

const inferMediaType = (url) => {
    try {
        const u = String(url).toLowerCase();
        if (u.includes("/image/") || u.match(/\.(png|jpg|jpeg|gif|webp)$/)) {return "image";}
        if (u.includes("/video/") || u.match(/\.(mp4|webm|mov|m4v)$/)) {return "video";}
    } catch { }
    return null;
};

export const index = async (req, res) => {
    const user = req.user;

    try {
        // Build the query with conditional filtering for hidden posts
        let whereClause = "";
        if (!user || user.userType !== "official") {
            whereClause = "WHERE p.is_hidden = FALSE";
        }

        const result = await pool.query(
            `
            SELECT 
                p.post_id,
                p.description,
                p.post_type,
                p.media_type,
                p.media_url,
                p.is_hidden,
                p.hidden_by,
                p.hidden_reason,
                p.created_at,
                p.updated_at,
                o.official_id,
                o.official_position,
                n.first_name,
                n.middle_name,
                n.last_name,
                n.suffix,
                COUNT(DISTINCT c.comment_id) AS comments_count,
                COUNT(DISTINCT r.reaction_id) AS reactions_count
            FROM posts p
            INNER JOIN sk_official o ON p.official_id = o.official_id
            LEFT JOIN sk_official_name n ON o.official_id = n.official_id
            LEFT JOIN post_comments c ON p.post_id = c.post_id
            LEFT JOIN post_reactions r ON p.post_id = r.post_id
            ${whereClause}
            GROUP BY 
                p.post_id, o.official_id, o.official_position,
                n.first_name, n.middle_name, n.last_name, n.suffix,
                p.post_type, p.is_hidden, p.hidden_by, p.hidden_reason
            ORDER BY p.created_at DESC
            `
        );

        const posts = result.rows.map(row => ({
            post_id: row.post_id,
            description: row.description,
            type: row.post_type || "post",
            media_type: row.media_type,
            media_url: row.media_url,
            is_hidden: row.is_hidden,
            hidden_by: row.hidden_by,
            hidden_reason: row.hidden_reason,
            created_at: row.created_at,
            updated_at: row.updated_at,
            official: {
                official_id: row.official_id,
                position: row.official_position,
                name: `${row.first_name || ""} ${row.middle_name || ""} ${row.last_name || ""} ${row.suffix || ""}`.trim()
            },
            comments_count: Number(row.comments_count),
            reactions_count: Number(row.reactions_count)
        }));

        res.status(200).json({
            status: "Success",
            data: posts
        });
    } catch (error) {
        console.error("Failed to fetch posts data", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Create post
export const createPost = async (req, res) => {
    const user = req.user;
    const body = req.body || {};
    const description = body.description || "";
    const post_type = body.type || body.post_type || "post";
    const media_type = body.media_type || "";
    const media_url = body.media_url || "";

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can create posts"
        });
    }

    // Validate post_type
    const validTypes = ["post", "announcement", "activity"];
    if (!validTypes.includes(post_type)) {
        return res.status(400).json({
            status: "Error",
            message: "Invalid post type. Must be one of: post, announcement, activity"
        });
    }

    try {
        const officialId = user.official_id;
        if (!officialId) {
            return res.status(400).json({
                status: "Error",
                message: "Missing official_id for current user"
            });
        }

        const uploaded = Array.isArray(res.locals.uploaded_images) ? res.locals.uploaded_images : [];
        const finalMediaUrl = uploaded[0] || media_url || null;
        const finalMediaType = finalMediaUrl ? (media_type || inferMediaType(finalMediaUrl)) : null;

        const result = await pool.query(
            `
            INSERT INTO posts (official_id, description, post_type, media_type, media_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING post_id, description, post_type, media_type, media_url, created_at, updated_at
            `,
            [officialId, description, post_type, finalMediaType, finalMediaUrl]
        );

        const postId = result.rows[0].post_id;

        // Notify everyone about the new post
        try {
            // Get post author's name
            const authorNameResult = await pool.query(
                `SELECT CONCAT(first_name, ' ', last_name) as name 
                 FROM sk_official_name WHERE official_id = $1`,
                [officialId]
            );
            const actorName = authorNameResult.rows[0]?.name || "An official";

            // Get all active officials (excluding the post author)
            const officialsResult = await pool.query(
                `SELECT official_id FROM sk_official 
                 WHERE is_active = TRUE AND deleted_at IS NULL AND official_id != $1`,
                [officialId]
            );

            // Get all verified and active youth members
            const youthResult = await pool.query(
                `SELECT youth_id FROM sk_youth 
                 WHERE verified = TRUE AND is_active = TRUE AND deleted_at IS NULL`
            );

            // Create notifications for all officials
            for (const official of officialsResult.rows) {
                await pool.query(
                    `
                    INSERT INTO notifications 
                    (recipient_type, recipient_id, notification_type, post_id, actor_type, actor_id, actor_name)
                    VALUES ('official', $1, 'post', $2, 'official', $3, $4)
                    `,
                    [official.official_id, postId, officialId, actorName]
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
                        VALUES ('youth', $1, 'post', $2, 'official', $3, $4)
                        `,
                        [youth.youth_id, postId, officialId, actorName]
                    );
                } catch (insertError) {
                    console.error(`Error creating notification for youth ${youth.youth_id}:`, insertError);
                }
            }
            console.log(`Successfully created ${youthResult.rows.length} notifications for youth members`);
        } catch (notifError) {
            // Log error but don't fail the post creation
            console.error("Error creating notifications:", notifError);
            console.error("Notification error details:", {
                message: notifError.message,
                stack: notifError.stack,
                postId,
                officialId
            });
        }

        res.status(201).json({
            status: "Success",
            message: "Post created successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Failed to create post:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Update post
export const updatePost = async (req, res) => {
    const user = req.user;
    const { id: post_id } = req.params;
    const { description, type, post_type, media_type, media_url } = req.body;
    const finalPostType = type || post_type;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can update posts"
        });
    }

    // Validate post_type if provided
    if (finalPostType) {
        const validTypes = ["post", "announcement", "activity"];
        if (!validTypes.includes(finalPostType)) {
            return res.status(400).json({
                status: "Error",
                message: "Invalid post type. Must be one of: post, announcement, activity"
            });
        }
    }

    try {
        const result = await pool.query(
            `
            UPDATE posts
            SET
                description = $1,
                post_type = COALESCE($2, post_type),
                media_type = $3,
                media_url = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE post_id = $5 AND official_id = $6
            RETURNING *
            `,
            [description, finalPostType || null, media_type || null, media_url || null, post_id, user.official_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Post not found or you do not have permission to update it"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Post updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Failed to update post:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Soft delete post
export const deletePost = async (req, res) => {
    const user = req.user;
    const { id: post_id } = req.params;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can delete posts"
        });
    }

    try {
        const result = await pool.query(
            `
            UPDATE posts
            SET deleted_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE post_id = $1 AND official_id = $2
            RETURNING *
            `,
            [post_id, user.official_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Post not found or already deleted"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Post deleted successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Failed to delete post:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Hide post (moderation action)
export const hidePost = async (req, res) => {
    const { post_id } = req.params;
    const { reason } = req.body;
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can hide posts"
        });
    }

    try {
        const { rows } = await pool.query(
            `
            UPDATE posts
            SET is_hidden = TRUE, hidden_by = $1, hidden_reason = $2, updated_at = CURRENT_TIMESTAMP
            WHERE post_id = $3
            RETURNING *
            `,
            [user.official_id, reason || "Hidden by moderator", post_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Post not found"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Post hidden successfully",
            data: rows[0]
        });

    } catch (error) {
        console.error("Error hiding post:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};

// Unhide post
export const unhidePost = async (req, res) => {
    const { post_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can unhide posts"
        });
    }

    try {
        const { rows } = await pool.query(
            `
            UPDATE posts
            SET is_hidden = FALSE, hidden_by = NULL, hidden_reason = NULL, updated_at = CURRENT_TIMESTAMP
            WHERE post_id = $1
            RETURNING *
            `,
            [post_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Post not found"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Post unhidden successfully",
            data: rows[0]
        });

    } catch (error) {
        console.error("Error unhiding post:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};

export const destroy = async (req, res) => {
  const { id: form_id } = req.params;
  const user = req.user;

  if (!user || user.userType !== "official") {
    return res.status(403).json({
      status: "Error",
      message: "Forbidden - Only officials can delete forms",
    });
  }

  try {
    const result = await pool.query(
      `
      UPDATE forms
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE form_id = $1 AND deleted_at IS NULL
      RETURNING *
      `,
      [form_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "Form not found or already deleted",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Form deleted successfully (soft delete)",
    });
  } catch (error) {
    console.error("Error deleting form:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};

/**
 * POST /api/forms/:id/reply
 * Add a youth reply to a form
 */
export const reply = async (req, res) => {
  const { id: form_id } = req.params;
  const user = req.user;
  const { response } = req.body;

  if (!user || user.userType !== "youth") {
    return res.status(403).json({
      status: "Error",
      message: "Forbidden - Only youth can reply to forms",
    });
  }

  if (!response) {
    return res.status(400).json({
      status: "Error",
      message: "Response text is required",
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO replied_forms (form_id, youth_id, response)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [form_id, user.youth_id, response]
    );

    return res.status(201).json({
      status: "Success",
      message: "Reply submitted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error submitting reply:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};
