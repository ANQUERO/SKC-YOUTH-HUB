import { pool } from '../db/config.js';

export const createPost = async (req, res) => {
    const { admin_id, title, description } = req.body;

    if (!admin_id || !title || !description) {
        return res.status(400).json({ status: 'failed', message: 'Missing required fields' });
    }

    // Validate admin
    const admin = await pool.query(`SELECT * FROM sk_official_admin WHERE admin_id = $1`, [admin_id]);
    if (admin.rowCount === 0) {
        return res.status(403).json({ status: 'failed', message: 'Invalid admin ID' });
    }

    try {
        const result = await pool.query(`
            INSERT INTO posts (admin_id, title, description)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [admin_id, title, description]
        );

        res.status(201).json({ status: 'success', post: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'failed', message: error.message });
    }
};

export const getPosts = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM posts WHERE deleted_at IS NULL ORDER BY created_at DESC`);
        res.status(200).json({ status: 'success', posts: result.rows });
    } catch (error) {
        res.status(500).json({ status: 'failed', message: error.message });
    }
};

export const addComment = async (req, res) => {
    const { post_id } = req.params;
    const { user_type, user_id, content, parent_comment_id } = req.body;

    if (!['admin', 'user'].includes(user_type)) {
        return res.status(400).json({ status: 'failed', message: 'Invalid user type' });
    }

    if (!user_id || !content) {
        return res.status(400).json({ status: 'failed', message: 'Missing user_id or content' });
    }

    // Validate user
    const table = user_type === 'admin' ? 'sk_official_admin' : 'sk_youth';
    const id_field = user_type === 'admin' ? 'admin_id' : 'youth_id';
    const check = await pool.query(`SELECT 1 FROM ${table} WHERE ${id_field} = $1`, [user_id]);

    if (check.rowCount === 0) {
        return res.status(403).json({ status: 'failed', message: 'Invalid user ID' });
    }

    try {
        const result = await pool.query(`
            INSERT INTO post_comments (post_id, user_type, user_id, content, parent_comment_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [post_id, user_type, user_id, content, parent_comment_id || null]
        );

        res.status(201).json({ status: 'success', comment: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'failed', message: error.message });
    }
};

export const addReaction = async (req, res) => {
    const { post_id } = req.params;
    const { user_type, user_id, type } = req.body;

    if (!['admin', 'user'].includes(user_type)) {
        return res.status(400).json({ status: 'failed', message: 'Invalid user type' });
    }

    if (!user_id || !type) {
        return res.status(400).json({ status: 'failed', message: 'Missing user_id or reaction type' });
    }

    if (!['like', 'heart', 'wow'].includes(type)) {
        return res.status(400).json({ status: 'failed', message: 'Invalid reaction type' });
    }

    // Validate user
    const table = user_type === 'admin' ? 'sk_official_admin' : 'sk_youth';
    const id_field = user_type === 'admin' ? 'admin_id' : 'youth_id';
    const check = await pool.query(`SELECT 1 FROM ${table} WHERE ${id_field} = $1`, [user_id]);

    if (check.rowCount === 0) {
        return res.status(403).json({ status: 'failed', message: 'Invalid user ID' });
    }

    try {
        const result = await pool.query(`
            INSERT INTO post_reactions (post_id, user_type, user_id, type)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [post_id, user_type, user_id, type]
        );

        res.status(201).json({ status: 'success', reaction: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'failed', message: error.message });
    }
};

//Admin and Youth Features

export const editComment = async (req, res) => {
    const { comment_id } = req.params;
    const { user_id, user_type, content } = req.body;

    try {
        const comment = await pool.query(
            `SELECT * FROM post_comments WHERE comment_id = $1 AND deleted_at IS NULL`,
            [comment_id]
        );

        if (comment.rows.length === 0) {
            return res.status(404).json({ status: 'failed', message: 'Comment not found' });
        }

        const c = comment.rows[0];
        if (c.user_id !== user_id || c.user_type !== user_type) {
            return res.status(403).json({ status: 'failed', message: 'Unauthorized to edit this comment' });
        }

        await pool.query(
            `UPDATE post_comments SET content = $1, is_edited = TRUE, updated_at = CURRENT_TIMESTAMP WHERE comment_id = $2`,
            [content, comment_id]
        );

        res.status(200).json({ status: 'success', message: 'Comment edited successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failed', message: err.message });
    }
};

export const deleteComment = async (req, res) => {
    const { comment_id } = req.params;
    const { user_id, user_type } = req.body;

    try {
        const comment = await pool.query(
            `SELECT * FROM post_comments WHERE comment_id = $1 AND deleted_at IS NULL`,
            [comment_id]
        );

        if (comment.rows.length === 0) {
            return res.status(404).json({ status: 'failed', message: 'Comment not found' });
        }

        const c = comment.rows[0];
        if (c.user_id !== user_id || c.user_type !== user_type) {
            return res.status(403).json({ status: 'failed', message: 'Unauthorized to delete this comment' });
        }

        await pool.query(
            `UPDATE post_comments SET deleted_at = CURRENT_TIMESTAMP WHERE comment_id = $1`,
            [comment_id]
        );

        res.status(200).json({ status: 'success', message: 'Comment deleted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failed', message: err.message });
    }
};

export const hideComment = async (req, res) => {
    const { comment_id } = req.params;
    const { admin_id } = req.body;

    try {
        const comment = await pool.query(
            `SELECT * FROM post_comments WHERE comment_id = $1 AND deleted_at IS NULL`,
            [comment_id]
        );

        if (comment.rows.length === 0) {
            return res.status(404).json({ status: 'failed', message: 'Comment not found' });
        }

        const c = comment.rows[0];
        if (c.user_type !== 'user') {
            return res.status(400).json({ status: 'failed', message: 'Only user comments can be hidden' });
        }

        await pool.query(
            `UPDATE post_comments SET hidden_by_admin = TRUE WHERE comment_id = $1`,
            [comment_id]
        );

        res.status(200).json({ status: 'success', message: 'Comment hidden by admin' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failed', message: err.message });
    }
};

export const deleteReaction = async (req, res) => {
    const { reaction_id } = req.params;
    const { user_id, user_type } = req.body;

    try {
        const reaction = await pool.query(
            `SELECT * FROM post_reactions WHERE reaction_id = $1 AND deleted_at IS NULL`,
            [reaction_id]
        );

        if (reaction.rows.length === 0) {
            return res.status(404).json({ status: 'failed', message: 'Reaction not found' });
        }

        const r = reaction.rows[0];
        if (r.user_id !== user_id || r.user_type !== user_type) {
            return res.status(403).json({ status: 'failed', message: 'Unauthorized to delete this reaction' });
        }

        await pool.query(
            `UPDATE post_reactions SET deleted_at = CURRENT_TIMESTAMP WHERE reaction_id = $1`,
            [reaction_id]
        );

        res.status(200).json({ status: 'success', message: 'Reaction deleted' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failed', message: err.message });
    }
};



