import { pool } from "../db/config.js";

// Get all notifications for the current user
export const getNotifications = async (req, res) => {
    const user = req.user;

    if (!user || !["official", "youth"].includes(user.userType)) {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Authentication required"
        });
    }

    try {
        const recipientId = user.userType === "official" ? user.official_id : user.youth_id;   
        
        const result = await pool.query(
            `
            SELECT 
                n.notification_id,
                n.notification_type,
                n.post_id,
                n.comment_id,
                n.actor_type,
                n.actor_id,
                n.actor_name,
                n.is_read,
                n.created_at,
                p.description AS post_description,
                p.post_type
            FROM notifications n
            INNER JOIN posts p ON n.post_id = p.post_id
            WHERE n.recipient_type = $1 AND n.recipient_id = $2
            ORDER BY n.created_at DESC
            LIMIT 50
            `,
            [user.userType, recipientId]
        );

        return res.status(200).json({
            status: "Success",
            count: result.rows.length,
            data: result.rows
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            userType: user.userType,
        });
        return res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
    const user = req.user;

    if (!user || !["official", "youth"].includes(user.userType)) {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Authentication required"
        });
    }

    try {
        const recipientId = user.userType === "official" ? user.official_id : user.youth_id;
        
        const result = await pool.query(
            `
            SELECT COUNT(*) as unread_count
            FROM notifications
            WHERE recipient_type = $1 AND recipient_id = $2 AND is_read = FALSE
            `,
            [user.userType, recipientId]
        );

        const unreadCount = parseInt(result.rows[0].unread_count);

        return res.status(200).json({
            status: "Success",
            unread_count: unreadCount
        });

    } catch (error) {
        console.error("Error fetching unread count:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            userType: user.userType,
            recipientId: user.userType === "official" ? user.official_id : user.youth_id
        });
        return res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Mark a notification as read
export const markNotificationRead = async (req, res) => {
    const user = req.user;
    const { notification_id } = req.params;

    if (!user || !["official", "youth"].includes(user.userType)) {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Authentication required"
        });
    }

    try {
        const recipientId = user.userType === "official" ? user.official_id : user.youth_id;
        
        const result = await pool.query(
            `
            UPDATE notifications
            SET is_read = TRUE
            WHERE notification_id = $1 
            AND recipient_type = $2 
            AND recipient_id = $3
            RETURNING *
            `,
            [notification_id, user.userType, recipientId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Notification marked as read",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Mark all notifications as read
export const markAllNotificationsRead = async (req, res) => {
    const user = req.user;

    if (!user || !["official", "youth"].includes(user.userType)) {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Authentication required"
        });
    }

    try {
        const recipientId = user.userType === "official" ? user.official_id : user.youth_id;
        
        const result = await pool.query(
            `
            UPDATE notifications
            SET is_read = TRUE
            WHERE recipient_type = $1 
            AND recipient_id = $2 
            AND is_read = FALSE
            RETURNING notification_id
            `,
            [user.userType, recipientId]
        );

        return res.status(200).json({
            status: "Success",
            message: "All notifications marked as read",
            updated_count: result.rows.length
        });

    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Debug endpoint to check notification data
export const debugNotifications = async (req, res) => {
    const user = req.user;

    if (!user || !["official", "youth"].includes(user.userType)) {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Authentication required"
        });
    }

    try {
        const recipientId = user.userType === "official" ? user.official_id : user.youth_id;
        
        // Check total notifications
        const totalResult = await pool.query(
            "SELECT COUNT(*) as total FROM notifications WHERE recipient_type = $1 AND recipient_id = $2",
            [user.userType, recipientId]
        );

        // Check unread notifications
        const unreadResult = await pool.query(
            "SELECT COUNT(*) as unread FROM notifications WHERE recipient_type = $1 AND recipient_id = $2 AND is_read = FALSE",
            [user.userType, recipientId]
        );

        // Check recent notifications
        const recentResult = await pool.query(
            `SELECT notification_id, notification_type, post_id, comment_id, actor_name, is_read, created_at 
             FROM notifications 
             WHERE recipient_type = $1 AND recipient_id = $2 
             ORDER BY created_at DESC LIMIT 10`,
            [user.userType, recipientId]
        );

        // Check if youth exists and is verified
        let youthInfo = null;
        if (user.userType === "youth") {
            const youthCheck = await pool.query(
                "SELECT youth_id, verified, is_active, deleted_at FROM sk_youth WHERE youth_id = $1",
                [recipientId]
            );
            youthInfo = youthCheck.rows[0];
        }

        return res.status(200).json({
            status: "Success",
            debug: {
                userType: user.userType,
                recipientId: recipientId,
                recipientIdType: typeof recipientId,
                totalNotifications: parseInt(totalResult.rows[0].total),
                unreadNotifications: parseInt(unreadResult.rows[0].unread),
                recentNotifications: recentResult.rows,
                youthInfo: youthInfo
            }
        });

    } catch (error) {
        console.error("Error in debug endpoint:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error",
            error: error.message
        });
    }
};
