import { pool } from '../db/config.js';

export const unverified = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - Only admins can access this resource'
        });
    }

    try {
        const result = await pool.query(`
            SELECT
                y.youth_id,
                y.email,
                y.verified,
                yn.first_name,
                yn.middle_name,
                yn.last_name,
                yn.suffix,
                yl.region,
                yl.province,
                yl.municipality,
                yl.barangay,
                yg.gender,
                yi.age,
                yi.contact,
                yi.birthday,
                yd.civil_status,
                yd.youth_age_gap,
                yd.youth_classification,
                yd.educational_background,
                yd.work_status,
                ys.registered_voter,
                ys.registered_national_voter,
                yh.household,
                ya.file_name, 
                ya.file_type,
                ya.file_url
            FROM sk_youth y
            LEFT JOIN sk_youth_name yn ON y.youth_id = yn.youth_id
            LEFT JOIN sk_youth_location yl ON y.youth_id = yl.youth_id
            LEFT JOIN sk_youth_gender yg ON y.youth_id = yg.youth_id
            LEFT JOIN sk_youth_info yi ON y.youth_id = yi.youth_id
            LEFT JOIN sk_youth_demographics yd ON y.youth_id = yd.youth_id
            LEFT JOIN sk_youth_household yh ON y.youth_id = yh.youth_id
            LEFT JOIN sk_youth_attachments ya ON y.youth_id = ya.youth_id
            LEFT JOIN sk_youth_survey ys ON y.youth_id = ys.youth_id
            WHERE y.verified = false AND y.deleted_at IS NULL;
        `);

        res.status(200).json({
            status: 'Success',
            youth: result.rows
        });
    } catch (error) {
        console.error('Failed to fetch unverified youth data:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal server error'
        });
    }
};

export const verifying = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - Only admins can access this resource'
        });
    }

    try {
        await pool.query(
            'UPDATE sk_youth SET verified = true, updated_at = CURRENT_TIMESTAMP WHERE youth_id = $1',
            [youth_id]
        );

        res.status(200).json({
            status: 'Success',
            message: 'Youth verified successfully'
        });
    } catch (error) {
        console.error('Failed to verify youth:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal server error'
        });
    }
};

export const deleteSignup = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - Only admins can access this resource'
        });
    }

    try {
        await pool.query(
            'UPDATE sk_youth SET deleted_at = CURRENT_TIMESTAMP WHERE youth_id = $1',
            [youth_id]
        );
        res.status(200).json({
            status: 'Success',
            message: 'Youth signup deleted successfully'
        });
    } catch (error) {
        console.error('Failed to delete youth signup:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal server error'
        });
    }
};

export const deletedSignup = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        

    } catch (error) {

    }

}