import dotenv from 'dotenv';
import multer from 'multer';
import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

export const uploadMulter = multer({
    storage: multer.memoryStorage(),
}).any();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadCloudinary = async (req, res, next) => {
    const urls = [];

    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'auto',
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        urls.push(result.secure_url);
                        resolve();
                    }
                );

                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        });

        try {
            await Promise.all(uploadPromises);
            res.locals.uploaded_images = urls;
            next();
        } catch (err) {
            console.error('Cloudinary upload error:', err);
            res.status(500).json({
                error: 'Failed to upload images to Cloudinary',
            });
        }
    } else {
        res.locals.uploaded_images = [];
        next();
    }
};
