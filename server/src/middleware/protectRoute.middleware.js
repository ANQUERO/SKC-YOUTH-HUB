import jwt from 'jsonwebtoken';
import { getSecretKey } from '../utils/jwt.js';

const protectRoute = (options = {}) => {
    return (req, res, next) => {
        console.log('🔐 Protect Route Middleware');

        try {
            const token =
                req.cookies?.jwt ||
                (req.headers.authorization && req.headers.authorization.replace('Bearer ', ''));

            if (!token) {
                console.warn('🚫 No token found');
                return res.status(401).json({ message: 'Unauthorized - No token provided' });
            }

            const secret = getSecretKey();
            const decoded = jwt.verify(token, secret);

            if (!decoded || typeof decoded !== 'object') {
                console.warn('❌ Invalid token payload');
                return res.status(401).json({ message: 'Unauthorized - Invalid token' });
            }

            // Restructure decoded payload into req.user
            if (decoded.userType === 'admin') {
                req.user = {
                    userType: 'admin',
                    admin_id: decoded.admin_id,
                    role: decoded.role
                };
            } else if (decoded.userType === 'youth') {
                req.user = {
                    userType: 'youth',
                    youth_id: decoded.youth_id
                };
            } else {
                return res.status(401).json({ message: 'Unauthorized - Invalid user type' });
            }

            // Optional role check
            if (options.allowedRoles && Array.isArray(options.allowedRoles)) {
                const userRole = req.user.role;
                const hasRole = options.allowedRoles.includes(userRole);

                if (!hasRole) {
                    console.warn(`🚫 Role "${userRole}" not allowed. Expected: ${options.allowedRoles.join(', ')}`);
                    return res.status(403).json({
                        message: 'Forbidden - You do not have permission to access this resource',
                    });
                }
            }

            console.log(`✅ Authenticated as ${req.user.userType}`, req.user);

            next();
        } catch (err) {
            const isExpired = err.name === 'TokenExpiredError';
            console.error('❗ JWT Error:', isExpired ? 'Token expired' : err.message);

            return res.status(401).json({
                message: isExpired
                    ? 'Session expired. Please log in again.'
                    : 'Unauthorized - Invalid or expired token',
            });
        }
    };
};

export default protectRoute;
