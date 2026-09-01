import dotenv from "dotenv";
import multer from "multer";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";
import { UPLOAD_LIMITS } from "../utils/uploadLimits.js";

dotenv.config();

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        files: UPLOAD_LIMITS.maxFiles,
        // Busboy emits its limit event at equality, so add one byte to keep
        // the advertised maximum inclusive.
        fileSize: UPLOAD_LIMITS.multerFileSizeLimitBytes,
        fields: UPLOAD_LIMITS.maxFields,
    },
    fileFilter(req, file, callback) {
        void req;
        const allowed = file.mimetype.startsWith("image/") ||
            file.mimetype.startsWith("video/") ||
            file.mimetype === "application/pdf";

        callback(
            allowed ? null : new multer.MulterError("LIMIT_UNEXPECTED_FILE"),
            allowed,
        );
    },
}).any();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadCloudinary = async (req, res, next) => {
    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "auto"
                    },
                    (error, result) => {
                        if (error) {return reject(error);}
                        resolve(result.secure_url);
                    }
                );

                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        });

        try {
            // Promise.all preserves input order even when uploads finish in a
            // different order, keeping each URL paired with its original file.
            const urls = await Promise.all(uploadPromises);
            res.locals.uploaded_images = urls;
            next();
        } catch (err) {
            console.error("Cloudinary upload error:", err);
            res.status(500).json({
                error: "Failed to upload images to Cloudinary",
            });
        }
    } else {
        res.locals.uploaded_images = [];
        next();
    }
};
