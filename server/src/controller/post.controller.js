// controller/post.controller.js
import { pool } from "../db/config.js";

const inferMediaType = (url) => {
    try {
        const u = String(url).toLowerCase();
        
        // Check for video extensions
        if (u.match(/\.(mp4|webm|mov|m4v|avi|mkv|flv|wmv|mpg|mpeg)$/)) {
            return "video";
        }
        
        // Check for image extensions
        if (u.match(/\.(png|jpg|jpeg|gif|webp|svg|bmp)$/)) {
            return "image";
        }
        
        // Check Cloudinary URL patterns
        if (u.includes("/video/") || u.includes("/upload/v")) {
            return "video";
        }
        if (u.includes("/image/") || u.includes("/upload/i")) {
            return "image";
        }
    } catch (error) {
        console.error("Error inferring media type", error);
    }
    return "unknown";
};

// Helper function to process Cloudinary uploaded files
const processCloudinaryFiles = (uploadedUrls = [], originalFiles = []) => {
    return uploadedUrls.map((url, index) => {
        const originalFile = originalFiles[index] || {};
        return {
            url: url,
            mimetype: originalFile.mimetype,
            size: originalFile.size,
            originalName: originalFile.originalname,
            mediaType: inferMediaType(url, originalFile.mimetype),
            displayOrder: index
        };
    });
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
                p.is_hidden,
                p.hidden_by,
                p.hidden_reason,
                p.created_at,
                p.updated_at,
                p.deleted_at,
                o.official_id,
                o.official_position,
                n.first_name,
                n.middle_name,
                n.last_name,
                n.suffix,
                -- Get all media for this post as JSON array
                COALESCE(
                    json_agg(
                        json_build_object(
                            'media_id', pm.media_id,
                            'url', pm.media_url,
                            'type', pm.media_type,
                            'mimetype', pm.mimetype,
                            'file_size', pm.file_size,
                            'display_order', pm.display_order
                        ) ORDER BY pm.display_order ASC
                    ) FILTER (WHERE pm.media_id IS NOT NULL),
                    '[]'::json
                ) as media,
                COUNT(DISTINCT c.comment_id) AS comments_count,
                COUNT(DISTINCT r.reaction_id) AS reactions_count
            FROM posts p
            INNER JOIN sk_official o ON p.official_id = o.official_id
            LEFT JOIN sk_official_name n ON o.official_id = n.official_id
            LEFT JOIN post_media pm ON p.post_id = pm.post_id
            LEFT JOIN post_comments c ON p.post_id = c.post_id
            LEFT JOIN post_reactions r ON p.post_id = r.post_id
            ${whereClause}
            AND p.deleted_at IS NULL
            GROUP BY 
                p.post_id, o.official_id, o.official_position,
                n.first_name, n.middle_name, n.last_name, n.suffix
            ORDER BY p.created_at DESC
            `
        );

        const posts = result.rows.map(row => ({
            post_id: row.post_id,
            description: row.description,
            type: row.post_type || "post",
            media: row.media, // Array of media objects
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

// Create post with multiple media files
export const createPost = async (req, res) => {
    const user = req.user;
    const body = req.body || {};
    const description = body.description || "";
    const post_type = body.type || body.post_type || "post";

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

        // Get uploaded files from middleware
        const uploadedUrls = Array.isArray(res.locals.uploaded_images) 
            ? res.locals.uploaded_images 
            : [];

        // Start transaction
        await pool.query("BEGIN");

        // Insert the post (without media_type and media_url in the main posts table)
        const postResult = await pool.query(
            `
            INSERT INTO posts (official_id, description, post_type)
            VALUES ($1, $2, $3)
            RETURNING post_id, description, post_type, created_at, updated_at
            `,
            [officialId, description, post_type]
        );

        const postId = postResult.rows[0].post_id;

        // Insert media files if any
        if (uploadedUrls.length > 0) {
            const processedMedia = processCloudinaryFiles(uploadedUrls, req.files || []);
            
            for (const [index, media] of processedMedia.entries()) {
                await pool.query(
                    `
                    INSERT INTO post_media 
                    (post_id, media_url, media_type, mimetype, file_size, display_order)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    `,
                    [
                        postId,
                        media.url,
                        media.mediaType,
                        media.mimetype,
                        media.size,
                        index
                    ]
                );
            }

            // For backward compatibility, update the first media to the posts table
            await pool.query(
                `
                UPDATE posts 
                SET media_type = $1, media_url = $2 
                WHERE post_id = $3
                `,
                [processedMedia[0].mediaType, processedMedia[0].url, postId]
            );
        }

        await pool.query("COMMIT");

        // Get the complete post with media for response
        const completePostResult = await pool.query(
            `
            SELECT 
                p.*,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'media_id', pm.media_id,
                            'url', pm.media_url,
                            'type', pm.media_type,
                            'mimetype', pm.mimetype,
                            'file_size', pm.file_size,
                            'display_order', pm.display_order
                        ) ORDER BY pm.display_order ASC
                    ) FILTER (WHERE pm.media_id IS NOT NULL),
                    '[]'::json
                ) as media,
                o.official_id,
                o.official_position,
                n.first_name,
                n.middle_name,
                n.last_name,
                n.suffix
            FROM posts p
            INNER JOIN sk_official o ON p.official_id = o.official_id
            LEFT JOIN sk_official_name n ON o.official_id = n.official_id
            LEFT JOIN post_media pm ON p.post_id = pm.post_id
            WHERE p.post_id = $1
            GROUP BY 
                p.post_id, o.official_id, o.official_position,
                n.first_name, n.middle_name, n.last_name, n.suffix
            `,
            [postId]
        );

        // Format the response
        const postData = completePostResult.rows[0];
        const formattedPost = {
            ...postData,
            official: {
                official_id: postData.official_id,
                position: postData.official_position,
                name: `${postData.first_name || ""} ${postData.middle_name || ""} ${postData.last_name || ""} ${postData.suffix || ""}`.trim()
            },
            media: postData.media || []
        };

        // Remove the individual name fields from the main object
        delete formattedPost.first_name;
        delete formattedPost.middle_name;
        delete formattedPost.last_name;
        delete formattedPost.suffix;
        delete formattedPost.official_id;
        delete formattedPost.official_position;

        // Notify everyone about the new post
        try {
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
            console.error("Error creating notifications:", notifError);
        }

        res.status(201).json({
            status: "Success",
            message: "Post created successfully",
            data: formattedPost
        });

    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Failed to create post:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Get single post with media
export const getPost = async (req, res) => {
    const { id: post_id } = req.params;
    const user = req.user;

    try {
        const result = await pool.query(
            `
            SELECT 
                p.*,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'media_id', pm.media_id,
                            'url', pm.media_url,
                            'type', pm.media_type,
                            'mimetype', pm.mimetype,
                            'file_size', pm.file_size,
                            'display_order', pm.display_order
                        ) ORDER BY pm.display_order ASC
                    ) FILTER (WHERE pm.media_id IS NOT NULL),
                    '[]'::json
                ) as media,
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
            LEFT JOIN post_media pm ON p.post_id = pm.post_id
            LEFT JOIN post_comments c ON p.post_id = c.post_id
            LEFT JOIN post_reactions r ON p.post_id = r.post_id
            WHERE p.post_id = $1 
                AND (p.is_hidden = FALSE OR $2::boolean = true)
                AND p.deleted_at IS NULL
            GROUP BY 
                p.post_id, o.official_id, o.official_position,
                n.first_name, n.middle_name, n.last_name, n.suffix
            `,
            [post_id, user && user.userType === "official"]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Post not found"
            });
        }

        const post = result.rows[0];
        const formattedPost = {
            ...post,
            official: {
                official_id: post.official_id,
                position: post.official_position,
                name: `${post.first_name || ""} ${post.middle_name || ""} ${post.last_name || ""} ${post.suffix || ""}`.trim()
            },
            media: post.media || []
        };

        // Remove the individual name fields from the main object
        delete formattedPost.first_name;
        delete formattedPost.middle_name;
        delete formattedPost.last_name;
        delete formattedPost.suffix;
        delete formattedPost.official_id;
        delete formattedPost.official_position;

        res.status(200).json({
            status: "Success",
            data: formattedPost
        });

    } catch (error) {
        console.error("Failed to fetch post:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Update post with multiple media files
export const updatePost = async (req, res) => {
    const user = req.user;
    const { id: post_id } = req.params;
    const body = req.body || {};
    const description = body.description || "";
    const post_type = body.type || body.post_type;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can update posts"
        });
    }

    if (post_type) {
        const validTypes = ["post", "announcement", "activity"];
        if (!validTypes.includes(post_type)) {
            return res.status(400).json({
                status: "Error",
                message: "Invalid post type. Must be one of: post, announcement, activity"
            });
        }
    }

    try {
        await pool.query("BEGIN");

        // Update post basic info
        const postResult = await pool.query(
            `
            UPDATE posts
            SET
                description = $1,
                post_type = COALESCE($2, post_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE post_id = $3 AND official_id = $4
            RETURNING *
            `,
            [description, post_type || null, post_id, user.official_id]
        );

        if (postResult.rows.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({
                status: "Error",
                message: "Post not found or you do not have permission to update it"
            });
        }

        // Handle media updates if new files are uploaded
        const uploadedUrls = Array.isArray(res.locals.uploaded_images) 
            ? res.locals.uploaded_images 
            : [];

        if (uploadedUrls.length > 0) {
            // Option: Replace all existing media
            // Delete existing media
            await pool.query("DELETE FROM post_media WHERE post_id = $1", [post_id]);

            // Insert new media
            const processedMedia = processCloudinaryFiles(uploadedUrls, req.files || []);
            
            for (const [index, media] of processedMedia.entries()) {
                await pool.query(
                    `
                    INSERT INTO post_media 
                    (post_id, media_url, media_type, mimetype, file_size, display_order)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    `,
                    [
                        post_id,
                        media.url,
                        media.mediaType,
                        media.mimetype,
                        media.size,
                        index
                    ]
                );
            }

            // Update the first media to the posts table for backward compatibility
            if (processedMedia.length > 0) {
                await pool.query(
                    `
                    UPDATE posts 
                    SET media_type = $1, media_url = $2 
                    WHERE post_id = $3
                    `,
                    [processedMedia[0].mediaType, processedMedia[0].url, post_id]
                );
            }
        }

        await pool.query("COMMIT");

        // Get updated post with media
        const updatedPostResult = await pool.query(
            `
            SELECT 
                p.*,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'media_id', pm.media_id,
                            'url', pm.media_url,
                            'type', pm.media_type,
                            'mimetype', pm.mimetype,
                            'display_order', pm.display_order
                        ) ORDER BY pm.display_order ASC
                    ) FILTER (WHERE pm.media_id IS NOT NULL),
                    '[]'::json
                ) as media,
                o.official_id,
                o.official_position,
                n.first_name,
                n.middle_name,
                n.last_name,
                n.suffix
            FROM posts p
            INNER JOIN sk_official o ON p.official_id = o.official_id
            LEFT JOIN sk_official_name n ON o.official_id = n.official_id
            LEFT JOIN post_media pm ON p.post_id = pm.post_id
            WHERE p.post_id = $1
            GROUP BY 
                p.post_id, o.official_id, o.official_position,
                n.first_name, n.middle_name, n.last_name, n.suffix
            `,
            [post_id]
        );

        const updatedPost = updatedPostResult.rows[0];
        const formattedPost = {
            ...updatedPost,
            official: {
                official_id: updatedPost.official_id,
                position: updatedPost.official_position,
                name: `${updatedPost.first_name || ""} ${updatedPost.middle_name || ""} ${updatedPost.last_name || ""} ${updatedPost.suffix || ""}`.trim()
            },
            media: updatedPost.media || []
        };

        // Remove the individual name fields
        delete formattedPost.first_name;
        delete formattedPost.middle_name;
        delete formattedPost.last_name;
        delete formattedPost.suffix;
        delete formattedPost.official_id;
        delete formattedPost.official_position;

        res.status(200).json({
            status: "Success",
            message: "Post updated successfully",
            data: formattedPost
        });

    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Failed to update post:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Delete media from post
export const deleteMedia = async (req, res) => {
    const { post_id, media_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can delete media"
        });
    }

    try {
        // Verify the post belongs to the user
        const postCheck = await pool.query(
            "SELECT 1 FROM posts WHERE post_id = $1 AND official_id = $2",
            [post_id, user.official_id]
        );

        if (postCheck.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Post not found or you don't have permission"
            });
        }

        const result = await pool.query(
            "DELETE FROM post_media WHERE media_id = $1 AND post_id = $2 RETURNING *",
            [media_id, post_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Media not found"
            });
        }

        // Check if this was the first media (for backward compatibility)
        const remainingMedia = await pool.query(
            "SELECT media_url, media_type FROM post_media WHERE post_id = $1 ORDER BY display_order ASC LIMIT 1",
            [post_id]
        );

        if (remainingMedia.rows.length > 0) {
            // Update posts table with the first remaining media
            await pool.query(
                "UPDATE posts SET media_url = $1, media_type = $2 WHERE post_id = $3",
                [remainingMedia.rows[0].media_url, remainingMedia.rows[0].media_type, post_id]
            );
        } else {
            // No media left, clear the fields
            await pool.query(
                "UPDATE posts SET media_url = NULL, media_type = NULL WHERE post_id = $1",
                [post_id]
            );
        }

        res.status(200).json({
            status: "Success",
            message: "Media deleted successfully"
        });

    } catch (error) {
        console.error("Failed to delete media:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Reorder media
export const reorderMedia = async (req, res) => {
    const { post_id } = req.params;
    const { media_order } = req.body; // Array of media IDs in new order
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can reorder media"
        });
    }

    if (!Array.isArray(media_order) || media_order.length === 0) {
        return res.status(400).json({
            status: "Error",
            message: "media_order must be a non-empty array"
        });
    }

    try {
        await pool.query("BEGIN");

        // Verify the post belongs to the user
        const postCheck = await pool.query(
            "SELECT 1 FROM posts WHERE post_id = $1 AND official_id = $2",
            [post_id, user.official_id]
        );

        if (postCheck.rows.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({
                status: "Error",
                message: "Post not found or you don't have permission"
            });
        }

        // Update display order for each media item
        for (let i = 0; i < media_order.length; i++) {
            await pool.query(
                "UPDATE post_media SET display_order = $1 WHERE media_id = $2 AND post_id = $3",
                [i, media_order[i], post_id]
            );
        }

        // Update the first media in posts table for backward compatibility
        const firstMedia = await pool.query(
            "SELECT media_url, media_type FROM post_media WHERE post_id = $1 ORDER BY display_order ASC LIMIT 1",
            [post_id]
        );

        if (firstMedia.rows.length > 0) {
            await pool.query(
                "UPDATE posts SET media_url = $1, media_type = $2 WHERE post_id = $3",
                [firstMedia.rows[0].media_url, firstMedia.rows[0].media_type, post_id]
            );
        }

        await pool.query("COMMIT");

        res.status(200).json({
            status: "Success",
            message: "Media reordered successfully"
        });

    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Failed to reorder media:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Delete post
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
        await pool.query("BEGIN");

        // Soft delete the post
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
            await pool.query("ROLLBACK");
            return res.status(404).json({
                status: "Error",
                message: "Post not found or already deleted"
            });
        }

        // Note: post_media records will be automatically deleted due to ON DELETE CASCADE

        await pool.query("COMMIT");

        res.status(200).json({
            status: "Success",
            message: "Post deleted successfully",
            data: result.rows[0]
        });

    } catch (error) {
        await pool.query("ROLLBACK");
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