import { pool } from "../db/config.js";
import bcrypt from "bcrypt";

export const index = async (req, res) => {
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
                y.youth_id,
                y.email,
                y.verified,
                CONCAT_WS(' ', yn.suffix, yn.first_name, yn.middle_name, yn.last_name) AS full_name,
                yi.age,
                yg.gender,
                p.name AS purok,
                ys.registered_voter
            FROM sk_youth y
            LEFT JOIN sk_youth_name yn ON y.youth_id = yn.youth_id
            LEFT JOIN sk_youth_info yi ON y.youth_id = yi.youth_id
            LEFT JOIN sk_youth_gender yg ON y.youth_id = yg.youth_id
            LEFT JOIN sk_youth_survey ys ON y.youth_id = ys.youth_id
            LEFT JOIN sk_youth_location yl ON y.youth_id = yl.youth_id
            LEFT JOIN purok p ON yl.purok_id = p.purok_id
        `);

        res.status(200).json({
            status: "Success",
            youth: result.rows
        });

    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const show = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;

    const isSelf = user.userType === "youth" && user.youth_id === parseInt(youth_id);
    const isAdmin = user.userType === "official";

    if (!isSelf && !isAdmin) {
        return res.status(403).json({
            message: "Forbidden - You cannot access this youth's data"
        });
    }

    try {

        const { rows } = await pool.query(`
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
            ORDER BY yn.created_at DESC
            LIMIT 1;
            `,
            [youth_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Youth not found"
            });
        }

        const youth = rows[0];

        const { rows: attachments } = await pool.query(
            `
            SELECT file_name, file_type, file_url
            FROM sk_youth_attachments
            WHERE youth_id = $1
            `, [youth_id]
        );

        const { rows: households } = await pool.query(
            `
            SELECT household
            FROM sk_youth_household
            WHERE youth_id = $1
            `, [youth_id]
        );

        res.status(200).json({
            status: "Success",
            data: {
                ...youth,
                attachments,
                households
            }
        });

    } catch (error) {
        console.error("Failed to fetch youth details:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};

export const store = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can create youth profiles"
        });
    }

    const {
        email,
        password,
        name,
        location,
        gender,
        info,
        demographics,
        survey,
        meetingSurvey,
        attachments,
        household
    } = req.body;

    // Basic validation
    if (!email || !password || !name?.first_name || !name?.last_name) {
        return res.status(400).json({
            status: "Error",
            message: "Missing required fields: email, password, first_name, last_name"
        });
    }

    const client = await pool.connect();
    let purokId = location.purok_id || null;

    try {
        await client.query("BEGIN");

        if (!purokId && location?.purok) {
            const purokResult = await client.query(
                "SELECT purok_id FROM purok WHERE name = $1 LIMIT 1",
                [location.purok]
            );

            if (purokResult.rows.length > 0) {
                purokId = purokResult.rows[0].purok_id;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into sk_youth - set verified to true for admin-created accounts
        const result = await client.query(`
            INSERT INTO sk_youth (email, password, verified)
            VALUES ($1, $2, true)
            RETURNING youth_id
        `, [email, hashedPassword]);

        const youth_id = result.rows[0].youth_id;

        // Insert into other tables using youth_id
        await client.query(`
            INSERT INTO sk_youth_name (youth_id, first_name, middle_name, last_name, suffix)
            VALUES ($1, $2, $3, $4, $5)
        `, [
            youth_id,
            name.first_name,
            name.middle_name || null,
            name.last_name,
            name.suffix || null
        ]);

        await client.query(`
            INSERT INTO sk_youth_location (youth_id, region, province, municipality, barangay, purok_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            youth_id,
            location.region,
            location.province,
            location.municipality,
            location.barangay,
            purokId
        ]);

        await client.query(`
            INSERT INTO sk_youth_gender (youth_id, gender)
            VALUES ($1, $2)
        `, [youth_id, gender.gender]);

        await client.query(`
            INSERT INTO sk_youth_info (youth_id, age, contact_number, birthday)
            VALUES ($1, $2, $3, $4)
        `, [youth_id, info.age, info.contact, info.birthday]);

        // FIXED: Make sure demographics contains youth_age_gap
        await client.query(`
            INSERT INTO sk_youth_demographics (
                youth_id, civil_status, youth_age_gap, youth_classification,
                educational_background, work_status
            ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            youth_id,
            demographics.civil_status,
            demographics.youth_age_gap,  // This should come from the frontend
            demographics.youth_classification,
            demographics.educational_background,
            demographics.work_status
        ]);

        await client.query(`
            INSERT INTO sk_youth_survey (
                youth_id, registered_voter, registered_national_voter, vote_last_election
            ) VALUES ($1, $2, $3, $4)
        `, [
            youth_id,
            survey.registered_voter,
            survey.registered_national_voter,
            survey.vote_last_election
        ]);

        await client.query(`
            INSERT INTO sk_youth_meeting_survey (youth_id, attended, times_attended, reason_not_attend)
            VALUES ($1, $2, $3, $4)
        `, [
            youth_id,
            meetingSurvey.attended,
            meetingSurvey.times_attended,
            meetingSurvey.reason_not_attend
        ]);

        if (attachments && attachments.length > 0) {
            for (const att of attachments) {
                await client.query(`
                    INSERT INTO sk_youth_attachments (youth_id, file_name, file_type, file_url)
                    VALUES ($1, $2, $3, $4)
                `, [youth_id, att.file_name, att.file_type, att.file_url]);
            }
        }

        if (household) {
            await client.query(`
                INSERT INTO sk_youth_household (youth_id, household)
                VALUES ($1, $2)
            `, [youth_id, household.household]);
        }

        await client.query("COMMIT");

        return res.status(201).json({
            status: "Success",
            message: "Youth profile created successfully",
            youth_id
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Insert error:", error);
        return res.status(500).json({
            status: "Error",
            message: "Failed to create youth profile",
            error: error.message
        });
    } finally {
        client.release();
    }
};

export const update = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;
    const updateData = req.body;

    // Check if user has permission
    const isSelf = user.userType === "youth" && user.youth_id === parseInt(youth_id);
    const isAdmin = user.userType === "official";

    if (!isSelf && !isAdmin) {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - You can only update your own profile or must be an admin",
        });
    }

    // Check if update data is provided
    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({
            status: "Error",
            message: "No update data provided"
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Check if youth exists
        const youthCheck = await client.query(
            "SELECT youth_id FROM sk_youth WHERE youth_id = $1",
            [youth_id]
        );

        if (youthCheck.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Youth not found"
            });
        }

        // Update sk_youth table (email/password if provided)
        if (updateData.email || updateData.password) {
            let updateFields = [];
            let values = [];
            let paramCount = 1;

            if (updateData.email) {
                updateFields.push(`email = $${paramCount}`);
                values.push(updateData.email);
                paramCount++;
            }

            if (updateData.password) {
                const hashedPassword = await bcrypt.hash(updateData.password, 10);
                updateFields.push(`password = $${paramCount}`);
                values.push(hashedPassword);
                paramCount++;
            }

            updateFields.push("updated_at = CURRENT_TIMESTAMP");
            values.push(youth_id);

            await client.query(
                `UPDATE sk_youth SET ${updateFields.join(", ")} WHERE youth_id = $${paramCount}`,
                values
            );
        }

        // Update sk_youth_name table - only if name data is provided
        if (updateData.name && Object.keys(updateData.name).length > 0) {
            const { first_name, middle_name, last_name, suffix } = updateData.name;

            // Build dynamic query for partial name update
            let nameFields = [];
            let nameValues = [];
            let nameParamCount = 1;

            if (first_name !== undefined) {
                nameFields.push(`first_name = $${nameParamCount}`);
                nameValues.push(first_name);
                nameParamCount++;
            }

            if (middle_name !== undefined) {
                nameFields.push(`middle_name = $${nameParamCount}`);
                nameValues.push(middle_name || null); // Allow null for middle_name
                nameParamCount++;
            }

            if (last_name !== undefined) {
                nameFields.push(`last_name = $${nameParamCount}`);
                nameValues.push(last_name);
                nameParamCount++;
            }

            if (suffix !== undefined) {
                nameFields.push(`suffix = $${nameParamCount}`);
                nameValues.push(suffix || null); // Allow null for suffix
                nameParamCount++;
            }

            if (nameFields.length > 0) {
                nameValues.push(youth_id);
                await client.query(`
                    UPDATE sk_youth_name 
                    SET ${nameFields.join(", ")} 
                    WHERE youth_id = $${nameParamCount}
                `, nameValues);
            }
        }

        // Update sk_youth_location table - only if location data is provided
        if (updateData.location && Object.keys(updateData.location).length > 0) {
            let locationFields = [];
            let locationValues = [];
            let locationParamCount = 1;

            if (updateData.location.region !== undefined) {
                locationFields.push(`region = $${locationParamCount}`);
                locationValues.push(updateData.location.region);
                locationParamCount++;
            }

            if (updateData.location.province !== undefined) {
                locationFields.push(`province = $${locationParamCount}`);
                locationValues.push(updateData.location.province);
                locationParamCount++;
            }

            if (updateData.location.municipality !== undefined) {
                locationFields.push(`municipality = $${locationParamCount}`);
                locationValues.push(updateData.location.municipality);
                locationParamCount++;
            }

            if (updateData.location.barangay !== undefined) {
                locationFields.push(`barangay = $${locationParamCount}`);
                locationValues.push(updateData.location.barangay);
                locationParamCount++;
            }

            // Handle purok/purok_id
            if (updateData.location.purok !== undefined || updateData.location.purok_id !== undefined) {
                let finalPurokId = updateData.location.purok_id;

                if (!finalPurokId && updateData.location.purok) {
                    const purokResult = await client.query(
                        "SELECT purok_id FROM purok WHERE name = $1 LIMIT 1",
                        [updateData.location.purok]
                    );
                    if (purokResult.rows.length > 0) {
                        finalPurokId = purokResult.rows[0].purok_id;
                    }
                }

                locationFields.push(`purok_id = $${locationParamCount}`);
                locationValues.push(finalPurokId);
                locationParamCount++;
            }

            if (locationFields.length > 0) {
                locationValues.push(youth_id);
                await client.query(`
                    UPDATE sk_youth_location 
                    SET ${locationFields.join(", ")} 
                    WHERE youth_id = $${locationParamCount}
                `, locationValues);
            }
        }

        // Update sk_youth_gender table - only if gender data is provided
        if (updateData.gender && updateData.gender.gender !== undefined) {
            await client.query(`
                UPDATE sk_youth_gender 
                SET gender = $1 
                WHERE youth_id = $2
            `, [updateData.gender.gender, youth_id]);
        }

        // Update sk_youth_info table - only if info data is provided
        if (updateData.info && Object.keys(updateData.info).length > 0) {
            let infoFields = [];
            let infoValues = [];
            let infoParamCount = 1;

            if (updateData.info.age !== undefined) {
                infoFields.push(`age = $${infoParamCount}`);
                infoValues.push(updateData.info.age);
                infoParamCount++;
            }

            if (updateData.info.contact_number !== undefined) {
                infoFields.push(`contact_number = $${infoParamCount}`);
                infoValues.push(updateData.info.contact_number);
                infoParamCount++;
            }

            if (updateData.info.birthday !== undefined) {
                infoFields.push(`birthday = $${infoParamCount}`);
                infoValues.push(updateData.info.birthday);
                infoParamCount++;
            }

            if (infoFields.length > 0) {
                infoValues.push(youth_id);
                await client.query(`
                    UPDATE sk_youth_info 
                    SET ${infoFields.join(", ")} 
                    WHERE youth_id = $${infoParamCount}
                `, infoValues);
            }
        }

        // Update sk_youth_demographics table - only if demographics data is provided
        if (updateData.demographics && Object.keys(updateData.demographics).length > 0) {
            let demoFields = [];
            let demoValues = [];
            let demoParamCount = 1;

            const demographics = updateData.demographics;

            if (demographics.civil_status !== undefined) {
                demoFields.push(`civil_status = $${demoParamCount}`);
                demoValues.push(demographics.civil_status);
                demoParamCount++;
            }

            if (demographics.youth_age_gap !== undefined) {
                demoFields.push(`youth_age_gap = $${demoParamCount}`);
                demoValues.push(demographics.youth_age_gap);
                demoParamCount++;
            }

            if (demographics.youth_classification !== undefined) {
                demoFields.push(`youth_classification = $${demoParamCount}`);
                demoValues.push(demographics.youth_classification);
                demoParamCount++;
            }

            if (demographics.educational_background !== undefined) {
                demoFields.push(`educational_background = $${demoParamCount}`);
                demoValues.push(demographics.educational_background);
                demoParamCount++;
            }

            if (demographics.work_status !== undefined) {
                demoFields.push(`work_status = $${demoParamCount}`);
                demoValues.push(demographics.work_status);
                demoParamCount++;
            }

            if (demoFields.length > 0) {
                demoValues.push(youth_id);
                await client.query(`
                    UPDATE sk_youth_demographics 
                    SET ${demoFields.join(", ")} 
                    WHERE youth_id = $${demoParamCount}
                `, demoValues);
            }
        }

        // Update sk_youth_survey table - only if survey data is provided
        if (updateData.survey && Object.keys(updateData.survey).length > 0) {
            let surveyFields = [];
            let surveyValues = [];
            let surveyParamCount = 1;

            const survey = updateData.survey;

            if (survey.registered_voter !== undefined) {
                surveyFields.push(`registered_voter = $${surveyParamCount}`);
                surveyValues.push(survey.registered_voter);
                surveyParamCount++;
            }

            if (survey.registered_national_voter !== undefined) {
                surveyFields.push(`registered_national_voter = $${surveyParamCount}`);
                surveyValues.push(survey.registered_national_voter);
                surveyParamCount++;
            }

            if (survey.vote_last_election !== undefined) {
                surveyFields.push(`vote_last_election = $${surveyParamCount}`);
                surveyValues.push(survey.vote_last_election);
                surveyParamCount++;
            }

            if (surveyFields.length > 0) {
                surveyValues.push(youth_id);
                await client.query(`
                    UPDATE sk_youth_survey 
                    SET ${surveyFields.join(", ")} 
                    WHERE youth_id = $${surveyParamCount}
                `, surveyValues);
            }
        }

        // Update sk_youth_meeting_survey table - only if meetingSurvey data is provided
        if (updateData.meetingSurvey && Object.keys(updateData.meetingSurvey).length > 0) {
            let meetingFields = [];
            let meetingValues = [];
            let meetingParamCount = 1;

            const meetingSurvey = updateData.meetingSurvey;

            if (meetingSurvey.attended !== undefined) {
                meetingFields.push(`attended = $${meetingParamCount}`);
                meetingValues.push(meetingSurvey.attended);
                meetingParamCount++;
            }

            if (meetingSurvey.times_attended !== undefined) {
                meetingFields.push(`times_attended = $${meetingParamCount}`);
                meetingValues.push(meetingSurvey.times_attended);
                meetingParamCount++;
            }

            if (meetingSurvey.reason_not_attend !== undefined) {
                meetingFields.push(`reason_not_attend = $${meetingParamCount}`);
                meetingValues.push(meetingSurvey.reason_not_attend);
                meetingParamCount++;
            }

            if (meetingFields.length > 0) {
                meetingValues.push(youth_id);
                await client.query(`
                    UPDATE sk_youth_meeting_survey 
                    SET ${meetingFields.join(", ")} 
                    WHERE youth_id = $${meetingParamCount}
                `, meetingValues);
            }
        }

        // Handle attachments - only if attachments array is provided
        if (updateData.attachments !== undefined) {
            if (Array.isArray(updateData.attachments)) {
                // Delete existing attachments
                await client.query(
                    "DELETE FROM sk_youth_attachments WHERE youth_id = $1",
                    [youth_id]
                );

                // Insert new attachments if array is not empty
                if (updateData.attachments.length > 0) {
                    for (const att of updateData.attachments) {
                        await client.query(`
                            INSERT INTO sk_youth_attachments (youth_id, file_name, file_type, file_url)
                            VALUES ($1, $2, $3, $4)
                        `, [youth_id, att.file_name, att.file_type, att.file_url]);
                    }
                }
            } else if (updateData.attachments === null) {
                // Clear all attachments if null is provided
                await client.query(
                    "DELETE FROM sk_youth_attachments WHERE youth_id = $1",
                    [youth_id]
                );
            }
        }

        // Handle household - only if household data is provided
        if (updateData.household !== undefined) {
            if (updateData.household === null) {
                // Clear household if null is provided
                await client.query(
                    "DELETE FROM sk_youth_household WHERE youth_id = $1",
                    [youth_id]
                );
            } else if (updateData.household.household !== undefined) {
                // Delete existing household entries
                await client.query(
                    "DELETE FROM sk_youth_household WHERE youth_id = $1",
                    [youth_id]
                );

                // Insert new household entry
                await client.query(`
                    INSERT INTO sk_youth_household (youth_id, household)
                    VALUES ($1, $2)
                `, [youth_id, updateData.household.household]);
            }
        }

        await client.query("COMMIT");

        return res.status(200).json({
            status: "Success",
            message: "Youth profile updated successfully",
            youth_id
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Update error:", error);
        return res.status(500).json({
            status: "Error",
            message: "Failed to update youth profile",
            error: error.message
        });
    } finally {
        client.release();
    }
};

export const destroy = async (req, res) => {
    const { id: youth_id } = req.params;
    const user = req.user;

    // Only admins can delete youth profiles
    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can delete youth profiles"
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Check if youth exists
        const youthCheck = await client.query(
            "SELECT youth_id FROM sk_youth WHERE youth_id = $1",
            [youth_id]
        );

        if (youthCheck.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Youth not found"
            });
        }

        // Delete all related records in the correct order (to maintain foreign key constraints)
        // Delete from child tables first
        await client.query("DELETE FROM sk_youth_attachments WHERE youth_id = $1", [youth_id]);
        await client.query("DELETE FROM sk_youth_household WHERE youth_id = $1", [youth_id]);
        await client.query("DELETE FROM sk_youth_meeting_survey WHERE youth_id = $1", [youth_id]);
        await client.query("DELETE FROM sk_youth_survey WHERE youth_id = $1", [youth_id]);
        await client.query("DELETE FROM sk_youth_demographics WHERE youth_id = $1", [youth_id]);
        await client.query("DELETE FROM sk_youth_info WHERE youth_id = $1", [youth_id]);
        await client.query("DELETE FROM sk_youth_gender WHERE youth_id = $1", [youth_id]);
        await client.query("DELETE FROM sk_youth_location WHERE youth_id = $1", [youth_id]);
        await client.query("DELETE FROM sk_youth_name WHERE youth_id = $1", [youth_id]);

        // Finally delete from main table
        await client.query("DELETE FROM sk_youth WHERE youth_id = $1", [youth_id]);

        await client.query("COMMIT");

        return res.status(200).json({
            status: "Success",
            message: "Youth profile deleted successfully"
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Delete error:", error);
        return res.status(500).json({
            status: "Error",
            message: "Failed to delete youth profile",
            error: error.message
        });
    } finally {
        client.release();
    }
};
