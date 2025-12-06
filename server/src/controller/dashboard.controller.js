import { pool } from "../db/config.js";

export const getTotalVoters = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(`
            SELECT
            SUM(CASE WHEN registered_voter = 'yes' THEN 1 ELSE 0 END) AS registered_voters,
            SUM(CASE WHEN registered_voter = 'no' THEN 1 ELSE 0 END) AS unregistered_voters,
            COUNT (*) AS total_youths 
            FROM sk_youth_survey
            `);

        res.status(200).json({
            status: "Success",
            registered_voters: result.rows[0].registered_voters,
            unregistered_voters: result.rows[0].unregistered_voters,
            total_youths: result.rows[0].total_youths
        });

    } catch (error) {
        console.error("Database query failed", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const getTotalGender = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(404).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(`
            SELECT 
            gender, 
            COUNT(*) AS total
            FROM sk_youth_gender
            GROUP BY gender
            `);

        res.status(200).json({
            status: "Success",
            data: result.rows
        });

    } catch (error) {
        console.error("Database query failed", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const getResidentsPerPurok = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(`
           SELECT 
           p.name AS purok,
           COUNT(sl.youth_id) AS total_residents
           FROM purok p 
           LEFT JOIN sk_youth_location sl ON p.purok_id = sl.purok_id
           LEFT JOIN sk_youth y ON sl.youth_id = y.youth_id
           WHERE y.deleted_at IS NULL
           GROUP BY p.name
           ORDER BY p.name
            `);

        res.status(200).json({
            status: "Success",
            data: result.rows
        });

    } catch (error) {
        console.error("Database query failed", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

// Get recent activity history (comments, replies, reactions, signups)
export const getRecentActivity = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const limit = parseInt(req.query.limit) || 20;

        // Get recent comments (excluding replies)
        const commentsResult = await pool.query(`
            SELECT 
                pc.comment_id,
                pc.post_id,
                pc.content,
                pc.created_at,
                pc.user_type,
                pc.user_id,
                CASE 
                    WHEN pc.user_type = 'official' THEN 
                        (SELECT CONCAT(n.first_name, ' ', n.last_name) FROM sk_official_name n WHERE n.official_id = pc.user_id)
                    WHEN pc.user_type = 'youth' THEN 
                        (SELECT CONCAT(n.first_name, ' ', n.last_name) FROM sk_youth_name n WHERE n.youth_id = pc.user_id)
                END AS user_name,
                p.description AS post_description
            FROM post_comments pc
            INNER JOIN posts p ON pc.post_id = p.post_id
            WHERE pc.parent_comment_id IS NULL
            ORDER BY pc.created_at DESC
            LIMIT $1
        `, [limit]);

        // Get recent replies
        const repliesResult = await pool.query(`
            SELECT 
                pc.comment_id,
                pc.post_id,
                pc.parent_comment_id,
                pc.content,
                pc.created_at,
                pc.user_type,
                pc.user_id,
                CASE 
                    WHEN pc.user_type = 'official' THEN 
                        (SELECT CONCAT(n.first_name, ' ', n.last_name) FROM sk_official_name n WHERE n.official_id = pc.user_id)
                    WHEN pc.user_type = 'youth' THEN 
                        (SELECT CONCAT(n.first_name, ' ', n.last_name) FROM sk_youth_name n WHERE n.youth_id = pc.user_id)
                END AS user_name,
                p.description AS post_description
            FROM post_comments pc
            INNER JOIN posts p ON pc.post_id = p.post_id
            WHERE pc.parent_comment_id IS NOT NULL
            ORDER BY pc.created_at DESC
            LIMIT $1
        `, [limit]);

        // Get recent reactions
        const reactionsResult = await pool.query(`
            SELECT 
                pr.reaction_id,
                pr.post_id,
                pr.type,
                pr.reacted_at,
                pr.user_type,
                pr.user_id,
                CASE 
                    WHEN pr.user_type = 'official' THEN 
                        (SELECT CONCAT(n.first_name, ' ', n.last_name) FROM sk_official_name n WHERE n.official_id = pr.user_id)
                    WHEN pr.user_type = 'youth' THEN 
                        (SELECT CONCAT(n.first_name, ' ', n.last_name) FROM sk_youth_name n WHERE n.youth_id = pr.user_id)
                END AS user_name,
                p.description AS post_description
            FROM post_reactions pr
            INNER JOIN posts p ON pr.post_id = p.post_id
            ORDER BY pr.reacted_at DESC
            LIMIT $1
        `, [limit]);

        // Get recent youth signups
        const signupsResult = await pool.query(`
            SELECT 
                y.youth_id,
                y.email,
                y.created_at,
                CONCAT(n.first_name, ' ', n.last_name) AS user_name
            FROM sk_youth y
            LEFT JOIN sk_youth_name n ON y.youth_id = n.youth_id
            WHERE y.deleted_at IS NULL
            ORDER BY y.created_at DESC
            LIMIT $1
        `, [limit]);

        // Combine and sort all activities
        const activities = [
            ...commentsResult.rows.map(c => ({
                id: `comment-${c.comment_id}`,
                type: "comment",
                activity_type: "Commented",
                user_name: c.user_name || "Unknown",
                user_type: c.user_type,
                content: c.content,
                post_id: c.post_id,
                post_description: c.post_description,
                created_at: c.created_at
            })),
            ...repliesResult.rows.map(r => ({
                id: `reply-${r.comment_id}`,
                type: "reply",
                activity_type: "Replied to a comment",
                user_name: r.user_name || "Unknown",
                user_type: r.user_type,
                content: r.content,
                post_id: r.post_id,
                post_description: r.post_description,
                parent_comment_id: r.parent_comment_id,
                created_at: r.created_at
            })),
            ...reactionsResult.rows.map(re => ({
                id: `reaction-${re.reaction_id}`,
                type: "reaction",
                activity_type: `Reacted ${re.type === "like" ? "👍" : re.type === "heart" ? "❤️" : "😮"}`,
                user_name: re.user_name || "Unknown",
                user_type: re.user_type,
                reaction_type: re.type,
                post_id: re.post_id,
                post_description: re.post_description,
                created_at: re.reacted_at
            })),
            ...signupsResult.rows.map(s => ({
                id: `signup-${s.youth_id}`,
                type: "signup",
                activity_type: "Signed up",
                user_name: s.user_name || "Unknown",
                user_type: "youth",
                email: s.email,
                created_at: s.created_at
            }))
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, limit);

        res.status(200).json({
            status: "Success",
            data: activities
        });

    } catch (error) {
        console.error("Error fetching recent activity:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};