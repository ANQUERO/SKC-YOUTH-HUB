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
                return res.status(401).json({
                    message: 'Unauthorized - No token provided'
                });
            }

            const secret = getSecretKey();
            const decoded = jwt.verify(token, secret);

            if (!decoded || typeof decoded !== 'object') {
                console.warn('❌ Invalid token payload');
                return res.status(401).json({
                    message: 'Unauthorized - Invalid token'
                });
            }

            // Set req.user from decoded JWT
            if (decoded.userType === 'admin') {
                req.user = {
                    userType: 'admin',
                    admin_id: decoded.admin_id,
                    role: decoded.role,
                };
            } else if (decoded.userType === 'youth') {
                req.user = {
                    userType: 'youth',
                    youth_id: decoded.youth_id,
                };
            } else {
                return res.status(401).json({
                    message: 'Unauthorized - Invalid user type'
                });
            }

            const { userType } = req.user;

            // Normalize roles (admin sub-roles)
            const roleMap = {
                natural_sk_admin: 'admin',
                super_sk_admin: 'admin',
            };
            const rawRole = req.user.role;
            const normalizedRole = roleMap[rawRole] || rawRole;

            // Role-based access check
            if (options.allowedRoles && Array.isArray(options.allowedRoles)) {
                let hasAccess = false;

                if (userType === 'admin') {
                    hasAccess = options.allowedRoles.includes(normalizedRole);
                } else if (userType === 'youth') {
                    hasAccess = options.allowedRoles.includes('youth');
                }

                if (!hasAccess) {
                    console.warn(`🚫 Role "${rawRole || userType}" not allowed. Expected: ${options.allowedRoles.join(', ')}`);
                    return res.status(403).json({
                        message: 'Forbidden - You do not have permission to access this resource',
                    });
                }
            }

            console.log(`✅ Authenticated as ${userType}${rawRole ? ` (role: ${rawRole})` : ''}`);
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
