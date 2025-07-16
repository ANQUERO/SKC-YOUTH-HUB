import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const getSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new error("JWT is not defined in environment variables");
    }
    return secret;
}

const protectRoute = () => {
    return (req, res, next) => {
        console.log('Protect Route Middleware');

        try {
            const token =
                req.cookies?.jwt ||
                (req.headers.authorization && req.headers.authorization.replace('Bearer ', '')) ||
                (req.headers.cookie &&
                    req.headers.cookie
                        .split(';')
                        .find((c) => c.trim().startsWith('jwt='))
                        ?.split('=')[1]);

            if (!token) {
                console.error('No token found');
                return res.status(401).json({ message: 'Unauthorized - No token provided' });
            }

            const secret = getSecretKey();
            const decoded = jwt.verify(token, secret);

            if (!decoded) {
                console.error('Token verification failed');
                return res.status(401).json({ message: 'Unauthorized - Invalid token' });
            }

            req.user = decoded;
            console.log('Token verified, user attached:', decoded);
            next();
        } catch (err) {
            console.error('Error verifying token:', err.message || err);
            return res.status(401).json({ message: 'Unauthorized - Token invalid or expired' });
        }
    };
};

export default protectRoute;