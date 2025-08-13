export const store = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== 'admin') {
        return res.status(403).json({
            status: 'Error',
            message: 'Forbidden - Only admins can create youth profiles'
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

    const client = await pool.connect();
    let purokId = location.purok_id || null;

    try {
        await client.query('BEGIN');

        // Optional: Lookup purok by name if purok_id not provided
        if (!purokId && location?.purok) {
            const purokResult = await client.query(
                `SELECT purok_id FROM purok WHERE name = $1 LIMIT 1`,
                [location.purok]
            );
            if (purokResult.rows.length > 0) {
                purokId = purokResult.rows[0].purok_id;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await client.query(`
INSERT INTO sk_youth (email, password)
VALUES ($1, $2)
RETURNING youth_id
`, [email, hashedPassword]);

        const youth_id = result.rows[0].youth_id;

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
INSERT INTO sk_youth_info (youth_id, age, contact, birthday)
VALUES ($1, $2, $3, $4)
`, [youth_id, info.age, info.contact, info.birthday]);

        await client.query(`
INSERT INTO sk_youth_demographics (
youth_id, civil_status, youth_age_gap, youth_classification,
educational_background, work_status
) VALUES ($1, $2, $3, $4, $5, $6)
`, [
            youth_id,
            demographics.civil_status,
            demographics.youth_age_gap,
            demographics.youth_classification,
            demographics.educational_background,
            demographics.work_status
        ]);

        const normalizeYesNo = val => {
            if (typeof val === 'string') {
                const lower = val.trim().toLowerCase();
                return lower === 'yes' ? 'yes' : 'no';
            }
            return 'no';
        };

        await client.query(`
INSERT INTO sk_youth_survey (
youth_id, registered_voter, registered_national_voter, vote_last_election
) VALUES ($1, $2, $3, $4)
`, [
            youth_id,
            normalizeYesNo(survey.registered_voter),
            normalizeYesNo(survey.registered_national_voter),
            normalizeYesNo(survey.vote_last_election)
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

        if (attachments?.length > 0) {
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

        await client.query('COMMIT');

        return res.status(201).json({
            status: 'Success',
            message: 'Youth profile created successfully',
            youth_id
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Insert error:', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Failed to create youth profile',
            error: error.message
        });
    } finally {
        client.release();
    }
};