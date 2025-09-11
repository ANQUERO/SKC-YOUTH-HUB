import { pool } from "../db/config.js";
const inferMediaType = (url) => {
    try {
        const u = String(url).toLowerCase();
        if (u.includes('/image/') || u.match(/\.(png|jpg|jpeg|gif|webp)$/)) return 'image';
        if (u.includes('/video/') || u.match(/\.(mp4|webm|mov|m4v)$/)) return 'video';
    } catch { }
    return null;
};

export const index = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT 
                p.post_id,
                p.title,
                p.description,
                p.media_type,
                p.media_url,
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
            GROUP BY 
                p.post_id, o.official_id, o.official_position,
                n.first_name, n.middle_name, n.last_name, n.suffix
            ORDER BY p.created_at DESC
            `
        );

        const posts = result.rows.map(row => ({
            post_id: row.post_id,
            title: row.title,
            description: row.description,
            media_type: row.media_type,
            media_url: row.media_url,
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
    const title = body.title || '';
    const description = body.description || '';
    const media_type = body.media_type || '';
    const media_url = body.media_url || '';

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can create posts"
        });
    }

    if (!title || !description) {
        return res.status(400).json({
            status: "Error",
            message: "Title and description are required"
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
            INSERT INTO posts (official_id, title, description, media_type, media_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING post_id, title, description, media_type, media_url, created_at, updated_at
            `,
            [officialId, title, description, finalMediaType, finalMediaUrl]
        );

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
    const { title, description, media_type, media_url } = req.body;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can update posts"
        });
    }

    try {
        const result = await pool.query(
            `
            UPDATE posts
            SET title = $1,
                description = $2,
                media_type = $3,
                media_url = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE post_id = $5 AND official_id = $6
            RETURNING *
            `,
            [title, description, media_type || null, media_url || null, post_id, user.official_id]
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
