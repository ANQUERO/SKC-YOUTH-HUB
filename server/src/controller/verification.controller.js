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
            WHERE y.verified = false AND y.deleted_at IS NULL
            ORDER BY y.youth_id, yn.created_at DESC;
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
        await pool.query(
        )


    } catch (error) {

    }

}