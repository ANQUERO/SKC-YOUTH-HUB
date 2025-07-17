import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const getSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
    }
    return secret;
};

export const generateTokenAndSetCookies = (user, res, userType) => {
    const secret = getSecretKey();

    const payload = {
        userType
    };

    if (userType === 'admin') {
        payload.admin_id = user.admin_id;
        payload.role = user.role;
    } else {
        payload.youth_id = user.youth_id;
    }

    const token = jwt.sign(payload, secret, {
        expiresIn: '15d'
    });

    const isDevMode = process.env.NODE_ENV === 'development';

    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true,
        sameSite: 'lax',
        secure: !isDevMode,
        path: '/'
    });

    return token;
};
