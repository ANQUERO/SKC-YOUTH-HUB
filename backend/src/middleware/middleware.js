import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = async (req, res) => {
    const authHeader = req?.headers?.authorization;

    if (!authHeader || !authHeader?.startsWith("Bearer")) {
        return res
        .status(401).json({
            status: "failed",
            message: "Authentication failed"
        });
    };

    const token = authHeader?.split(" ")[1];

    try {
        const adminToken = jwt.verify(token, process.env.JWT_SECRET);

        req.body.admin = {
            adminId : adminToken.adminId,
        };
    } catch (error) {
        console.log(error);
        return res
        .status(401)
        .json({
            status: "auth_failed",
            message: "Authentication failed"
        });
    };
    
};

export default authMiddleware;