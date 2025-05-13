import { pool } from '../db/config.js';

export const createPost = async (req, res) => {
    try {
        const {
            admin_id,
            title,
            description,
        } = req.body;

        const newPost = await Post.create({
            admin_id,
            title,
            description
        });
        res.status(201).json(newPost);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });

    };

};