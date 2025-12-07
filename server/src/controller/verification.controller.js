import { pool } from "../db/config.js";

export const unverified = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(`
            SELECT DISTINCT ON (y.youth_id)
                y.youth_id,
                y.email,
                y.verified,
                y.created_at,
                yn.first_name,
                yn.middle_name,
                yn.last_name,
                yn.suffix
            FROM sk_youth y
            LEFT JOIN sk_youth_name yn ON y.youth_id = yn.youth_id
            WHERE y.verified = false
            ORDER BY y.youth_id
        `);

        res.status(200).json({
            status: "Success",
            youth: result.rows
        });
    } catch (error) {
        console.error("Failed to fetch unverified youth data:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const getYouthDetails = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource",
        });
    }

    try {

        const { rows } = await pool.query(
            `
            SELECT 
                y.youth_id,
                y.email,
                y.verified,
                y.created_at,
                y.updated_at,
                yn.first_name,
                yn.middle_name,
                yn.last_name,
                yn.suffix,
                yl.region,
                yl.province,
                yl.municipality,
                yl.barangay,
                p.name AS purok,
                yi.age,
                yi.contact_number,
                yi.birthday,
                yg.gender,
                yd.civil_status,
                yd.youth_age_gap,
                yd.youth_classification,
                yd.educational_background,
                yd.work_status,
                ys.registered_voter,
                ys.registered_national_voter,
                ys.vote_last_election,
                yms.attended,
                yms.times_attended,
                yms.reason_not_attend
            FROM sk_youth y
            LEFT JOIN sk_youth_name yn ON y.youth_id = yn.youth_id
            LEFT JOIN sk_youth_location yl ON y.youth_id = yl.youth_id
            LEFT JOIN purok p ON yl.purok_id = p.purok_id
            LEFT JOIN sk_youth_info yi ON y.youth_id = yi.youth_id
            LEFT JOIN sk_youth_gender yg ON y.youth_id = yg.youth_id
            LEFT JOIN sk_youth_demographics yd ON y.youth_id = yd.youth_id
            LEFT JOIN sk_youth_survey ys ON y.youth_id = ys.youth_id
            LEFT JOIN sk_youth_meeting_survey yms ON y.youth_id = yms.youth_id
            WHERE y.youth_id = $1
            ORDER BY y.youth_id
            LIMIT 1;
            `,
            [youth_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Youth not found",
            });
        }

        const youth = rows[0];

        const { rows: attachments } = await pool.query(
            `SELECT file_name, file_type, file_url
             FROM sk_youth_attachments 
             WHERE youth_id = $1`,
            [youth_id]
        );

        const { rows: households } = await pool.query(
            `SELECT household 
             FROM sk_youth_household 
             WHERE youth_id = $1`,
            [youth_id]
        );

        res.status(200).json({
            status: "Success",
            data: {
                ...youth,
                attachments,
                households,
            },
        });
    } catch (error) {
        console.error("Failed to fetch youth details:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const verifying = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            "UPDATE sk_youth SET verified = true, updated_at = CURRENT_TIMESTAMP WHERE youth_id = $1",
            [youth_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Youth not found"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Youth verified successfully"
        });
    } catch (error) {
        console.error("Failed to verify youth:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const deleteSignup = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            "UPDATE sk_youth SET deleted_at = CURRENT_TIMESTAMP WHERE youth_id = $1",
            [youth_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Youth signup not found"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Youth signup deleted successfully"
        });
    } catch (error) {
        console.error("Failed to delete youth signup:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const deletedSignup = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const { rows } = await pool.query(
            `
            SELECT DISTINCT ON (y.youth_id)
                y.youth_id,
                y.email,
                y.verified,
                y.created_at,
                yn.first_name,
                yn.middle_name,
                yn.last_name,
                yn.suffix
            FROM sk_youth y
            LEFT JOIN sk_youth_name yn ON y.youth_id = yn.youth_id
            WHERE y.deleted_at IS NOT NULL
            ORDER BY y.youth_id;
            `
        );

        res.status(200).json({
            status: "Success",
            data: rows
        });
    } catch (error) {
        console.error("Failed to fetch deleted youth signups:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};
