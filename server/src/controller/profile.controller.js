import { pool } from '../db/config.js'

export const showProfile = async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            status: 'Error',
            message: 'Unauthorized - No user found'
        });
    }

    try {
        if (user.userType === 'youth') {
            const youth_id = user.youth_id; // make sure this matches your middleware

            const [
                accountName,
                genderInfo,
                demoSurvey,
                meetingHousehold
            ] = await Promise.all([
                pool.query(`
                    SELECT y.youth_id, y.email, y.verified, yn.first_name, yn.middle_name, yn.last_name, yn.suffix
                    FROM sk_youth y
                    LEFT JOIN sk_youth_name yn ON y.youth_id = yn.youth_id
                    WHERE y.youth_id = $1
                `, [youth_id]),

                pool.query(`
                    SELECT y.youth_id, g.gender, yi.age, yi.contact_number, yi.birthday
                    FROM sk_youth y
                    LEFT JOIN sk_youth_gender g ON y.youth_id = g.youth_id
                    LEFT JOIN sk_youth_info yi ON y.youth_id = yi.youth_id
                    WHERE y.youth_id = $1
                `, [youth_id]),

                pool.query(`
                    SELECT y.youth_id, yd.civil_status, yd.youth_age_gap, yd.youth_classification,
                           yd.educational_background, yd.work_status,
                           ys.registered_voter, ys.registered_national_voter, ys.vote_last_election
                    FROM sk_youth y
                    LEFT JOIN sk_youth_demographics yd ON y.youth_id = yd.youth_id
                    LEFT JOIN sk_youth_survey ys ON y.youth_id = ys.youth_id
                    WHERE y.youth_id = $1
                `, [youth_id]),

                pool.query(`
                    SELECT y.youth_id, ym.attended, ym.times_attended, ym.reason_not_attend, yh.household
                    FROM sk_youth y
                    LEFT JOIN sk_youth_meeting_survey ym ON y.youth_id = ym.youth_id
                    LEFT JOIN sk_youth_household yh ON y.youth_id = yh.youth_id
                    WHERE y.youth_id = $1
                `, [youth_id])
            ]);

            return res.status(200).json({
                status: "Success",
                data: {
                    accountName: accountName.rows[0] || null,
                    genderInfo: genderInfo.rows[0] || null,
                    demoSurvey: demoSurvey.rows[0] || null,
                    meetingHousehold: meetingHousehold.rows[0] || null
                }
            });
        }

        if (user.userType === 'official') {
            const official_id = user.official_id;

            const [account, name, info] = await Promise.all([
                pool.query(`
                    SELECT official_id, email, official_position, role, is_active, created_at, updated_at
                    FROM sk_official
                    WHERE official_id = $1
                `, [official_id]),

                pool.query(`
                    SELECT official_id, first_name, middle_name, last_name, suffix
                    FROM sk_official_name
                    WHERE official_id = $1
                `, [official_id]),

                pool.query(`
                    SELECT official_id, contact_number, gender, age
                    FROM sk_official_info
                    WHERE official_id = $1
                `, [official_id])
            ]);

            return res.status(200).json({
                status: "Success",
                data: {
                    account: account.rows[0] || null,
                    name: name.rows[0] || null,
                    info: info.rows[0] || null
                }
            });
        }

        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - Unsupported user type'
        });

    } catch (error) {
        console.error("Failed to fetch full profile:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};
