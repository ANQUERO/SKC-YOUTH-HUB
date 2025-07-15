import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const getSecretKey = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    return secret;
};

const generateTokenAndSetCookies = (user, res) => {
    const secret = getSecretKey();

    const token = jwt.sign({ userID: user.id }, secret, {
        expiresIn: "15d",
    });

    const isDevMode = process.env.NODE_ENV === "development";

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true,                   // Prevent XSS
        sameSite: "lax",                  // Allow cross-site requests in development
        secure: !isDevMode,               // Only send cookie over HTTPS in production
        path: "/",                        // Available to all routes
        domain: undefined                 // No domain restrictions
    });

    return token;
};

export {
    generateTokenAndSetCookies,
    getSecretKey
};
