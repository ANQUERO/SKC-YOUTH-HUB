import jwt from "jsonwebtoken";
import { getSecretKey } from "../utils/jwt.js";

const protectRoute = (options = {}) => {
    return (req, res, next) => {
        try {
            const authorization = req.headers.authorization;
            const token = req.cookies?.jwt ||
                (authorization?.match(/^Bearer\s+(.+)$/i)?.[1]);

            if (!token) {
                if (options.optional) {
                    return next();
                }
                return res.status(401).json({
                    message: "Unauthorized - No token provided"
                });
            }

            const secret = getSecretKey();
            const decoded = jwt.verify(token, secret);

            if (!decoded || typeof decoded !== "object") {
                return res.status(401).json({
                    message: "Unauthorized - Invalid token"
                });
            }

            // Normalize roles
            const rawRoles = (Array.isArray(decoded.role)
                ? decoded.role
                : [decoded.role]
            ).filter(Boolean);

            // Set req.user
            if (decoded.userType === "official") {
                req.user = {
                    userType: "official",
                    official_id: decoded.official_id,
                    role: rawRoles,
                    email: decoded.email,
                    official_position: decoded.official_position
                };
            } else if (decoded.userType === "youth") {
                req.user = {
                    userType: "youth",
                    youth_id: decoded.youth_id,
                    email: decoded.email
                };
            } else {
                return res.status(401).json({
                    message: "Unauthorized - Invalid user type"
                });
            }

            // Role-based access check
            if (options.allowedRoles && Array.isArray(options.allowedRoles)) {
                const hasAccess = options.allowedRoles.includes(req.user.userType) ||
                    rawRoles.some((role) => options.allowedRoles.includes(role));

                if (!hasAccess) {
                    return res.status(403).json({
                        message: "Forbidden - You do not have permission to access this resource",
                    });
                }
            }

            next();

        } catch (err) {
            const isExpired = err.name === "TokenExpiredError";
            return res.status(401).json({
                message: isExpired
                    ? "Session expired. Please log in again."
                    : "Unauthorized - Invalid or expired token",
            });
        }
    };
};

export default protectRoute;
