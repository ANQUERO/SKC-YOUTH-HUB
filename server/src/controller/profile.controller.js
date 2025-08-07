import { pool } from "../db/config";

export const show = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'youth') {
        return res.status(403).json({
            status: "Error",
            message: "Only youth can access their own profile"
        });
    }

    try {

        const result = await pool.query(
            `
            SELECT 
            y.youth_id,
            y.email,
            y.verified,
            CONCAT_WS(' ', 
            yn.suffix, 
            yn.first_name, 
            yn.middle_name,
            yn.last_name
            ) AS full_name,
             yl.region,
             yl.province,
             yl.municipality,
             yl.barangay,
             p.name AS purok,
             yg.gender,
             yi.age,
             yi.contact,
             yi.birthday,
             yd.civil_status,
             yd.youth_age_gap,
             yd.youth_classification,
             yd.educational_background,
             yd.work_status,
             ys.registered_voter
             FROM sk_youth y
             LEFT JOIN sk_youth_name ON y.youth_id = yn.youth_id
             LEFT JOIN sk_youth_name ON y.youth_id = yn.youth_id
            `
        )
        res.status(200).json({
            status: "Success",
            profile: result.rows
        });

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error'
        });
    }
};