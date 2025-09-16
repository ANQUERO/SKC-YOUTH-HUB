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
                meetingHousehold,
                profilePicture
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
                `, [youth_id]),

                pool.query(`
                    SELECT file_url as profile_picture
                    FROM sk_youth_attachments
                    WHERE youth_id = $1 AND file_type LIKE 'image%'
                    ORDER BY attachment_id DESC
                    LIMIT 1
                `, [youth_id])
            ]);

            return res.status(200).json({
                status: "Success",
                data: {
                    accountName: {
                        ...accountName.rows[0],
                        profile_picture: profilePicture.rows[0]?.profile_picture || null
                    } || null,
                    genderInfo: genderInfo.rows[0] || null,
                    demoSurvey: demoSurvey.rows[0] || null,
                    meetingHousehold: meetingHousehold.rows[0] || null
                }
            });
        }

        if (user.userType === 'official') {
            const official_id = user.official_id;

            const [account, name, info, profilePicture] = await Promise.all([
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
                `, [official_id]),

                pool.query(`
                    SELECT file_url as profile_picture
                    FROM sk_official_avatar
                    WHERE official_id = $1 AND file_type LIKE 'image%'
                    ORDER BY attachment_id DESC
                    LIMIT 1
                `, [official_id])
            ]);

            return res.status(200).json({
                status: "Success",
                data: {
                    account: {
                        ...account.rows[0],
                        profile_picture: profilePicture.rows[0]?.profile_picture || null
                    } || null,
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

export const updateProfilePicture = async (req, res) => {
    const user = req.user;
    const uploadedImages = res.locals.uploaded_images;

    if (!user) {
        return res.status(401).json({
            status: 'Error',
            message: 'Unauthorized - No user found'
        });
    }

    if (!uploadedImages || uploadedImages.length === 0) {
        return res.status(400).json({
            status: 'Error',
            message: 'No image uploaded'
        });
    }

    try {
        const profilePictureUrl = uploadedImages[0]; // Take the first uploaded image
        const fileName = req.files[0].originalname;
        const fileType = req.files[0].mimetype;

        if (user.userType === 'youth') {
            const youth_id = user.youth_id;

            // Insert profile picture into sk_youth_attachments table
            await pool.query(
                `INSERT INTO sk_youth_attachments (youth_id, file_name, file_type, file_url) 
                 VALUES ($1, $2, $3, $4)`,
                [youth_id, fileName, fileType, profilePictureUrl]
            );

            return res.status(200).json({
                status: 'Success',
                message: 'Profile picture updated successfully',
                profile_picture: profilePictureUrl
            });
        }

        if (user.userType === 'official') {
            const official_id = user.official_id;

            // Insert profile picture into sk_official_avatar table
            await pool.query(
                `INSERT INTO sk_official_avatar (official_id, file_name, file_type, file_url) 
                 VALUES ($1, $2, $3, $4)`,
                [official_id, fileName, fileType, profilePictureUrl]
            );

            return res.status(200).json({
                status: 'Success',
                message: 'Profile picture updated successfully',
                profile_picture: profilePictureUrl
            });
        }

        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - Unsupported user type'
        });

    } catch (error) {
        console.error("Failed to update profile picture:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const updateProfile = async (req, res) => {
    const user = req.user;
    const updateData = req.body;

    if (!user) {
        return res.status(401).json({
            status: 'Error',
            message: 'Unauthorized - No user found'
        });
    }

    try {
        if (user.userType === 'youth') {
            const youth_id = user.youth_id;
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                // Update youth name if provided
                if (updateData.name) {
                    await client.query(`
                        UPDATE sk_youth_name 
                        SET first_name = $1, middle_name = $2, last_name = $3, suffix = $4
                        WHERE youth_id = $5
                    `, [
                        updateData.name.first_name,
                        updateData.name.middle_name || null,
                        updateData.name.last_name,
                        updateData.name.suffix || null,
                        youth_id
                    ]);
                }

                // Update youth info if provided
                if (updateData.info) {
                    await client.query(`
                        UPDATE sk_youth_info 
                        SET age = $1, contact_number = $2, birthday = $3
                        WHERE youth_id = $4
                    `, [
                        updateData.info.age,
                        updateData.info.contact_number,
                        updateData.info.birthday,
                        youth_id
                    ]);
                }

                // Update youth gender if provided
                if (updateData.gender) {
                    await client.query(`
                        UPDATE sk_youth_gender 
                        SET gender = $1
                        WHERE youth_id = $2
                    `, [updateData.gender.gender, youth_id]);
                }

                // Update demographics if provided
                if (updateData.demographics) {
                    await client.query(`
                        UPDATE sk_youth_demographics 
                        SET civil_status = $1, youth_age_gap = $2, youth_classification = $3,
                            educational_background = $4, work_status = $5
                        WHERE youth_id = $6
                    `, [
                        updateData.demographics.civil_status,
                        updateData.demographics.youth_age_gap,
                        updateData.demographics.youth_classification,
                        updateData.demographics.educational_background,
                        updateData.demographics.work_status,
                        youth_id
                    ]);
                }

                // Update survey if provided
                if (updateData.survey) {
                    await client.query(`
                        UPDATE sk_youth_survey 
                        SET registered_voter = $1, registered_national_voter = $2, vote_last_election = $3
                        WHERE youth_id = $4
                    `, [
                        updateData.survey.registered_voter,
                        updateData.survey.registered_national_voter,
                        updateData.survey.vote_last_election,
                        youth_id
                    ]);
                }

                // Update meeting survey if provided
                if (updateData.meetingSurvey) {
                    await client.query(`
                        UPDATE sk_youth_meeting_survey 
                        SET attended = $1, times_attended = $2, reason_not_attend = $3
                        WHERE youth_id = $4
                    `, [
                        updateData.meetingSurvey.attended,
                        updateData.meetingSurvey.times_attended,
                        updateData.meetingSurvey.reason_not_attend,
                        youth_id
                    ]);
                }

                await client.query('COMMIT');

                return res.status(200).json({
                    status: 'Success',
                    message: 'Youth profile updated successfully'
                });

            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        }

        if (user.userType === 'official') {
            const official_id = user.official_id;
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                // Update official name if provided
                if (updateData.name) {
                    await client.query(`
                        UPDATE sk_official_name 
                        SET first_name = $1, middle_name = $2, last_name = $3, suffix = $4
                        WHERE official_id = $5
                    `, [
                        updateData.name.first_name,
                        updateData.name.middle_name || null,
                        updateData.name.last_name,
                        updateData.name.suffix || null,
                        official_id
                    ]);
                }

                // Update official info if provided
                if (updateData.info) {
                    await client.query(`
                        UPDATE sk_official_info 
                        SET contact_number = $1, gender = $2, age = $3
                        WHERE official_id = $4
                    `, [
                        updateData.info.contact_number,
                        updateData.info.gender,
                        updateData.info.age,
                        official_id
                    ]);
                }

                // Update official account if provided
                if (updateData.account) {
                    await client.query(`
                        UPDATE sk_official 
                        SET official_position = $1, role = $2
                        WHERE official_id = $3
                    `, [
                        updateData.account.official_position,
                        updateData.account.role,
                        official_id
                    ]);
                }

                await client.query('COMMIT');

                return res.status(200).json({
                    status: 'Success',
                    message: 'Official profile updated successfully'
                });

            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        }

        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - Unsupported user type'
        });

    } catch (error) {
        console.error("Failed to update profile:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};