import { pool } from "../db/config";

export const index = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== 'official') {
        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - Only officials can access this rousource'
        });
    }

    try {
        const result = await pool.query('SELECT * FROM posts')
        console.log('Post', result.rows);
        res.status(200).json({
            status: 'Success',
            data: result.rows
        });
    } catch (error) {
        console.error('Failed to fetch posts data', error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal server error'
        });
    }
}

export const show = async (req, res) => {
    const { id: post_id } = req.params
    const user = req.user;

    if (!user || user.userType !== 'official') {
        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - Only officials can access this rousource'
        })
    }

    try {
        const result = await pool.query(
            `SELECT * FROM posts WHERE post_id = $1`,
            [post_id]
        );
        console.log(result.rows);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'Post not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Failed to fetch posts data', error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal server error'
        });

    }
}
