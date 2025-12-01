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

export const ageDistribution = async (req, res) => {
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
            age FROM WHERE 
            
            `);
    } catch (error) {
        
    } 
};