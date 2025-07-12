import supabase from '../db/config.js';
import { hashPassword } from '../lib/index.js';

// ✅ Get all youth data
export const index = async (req, res) => {
    try {
        const tables = [
            'sk_youth',
            'sk_youth_name',
            'sk_youth_location',
            'sk_youth_gender',
            'sk_youth_info',
            'sk_youth_demographics',
            'sk_youth_survey',
            'sk_youth_meeting_survey',
            'sk_youth_household',
        ];

        const results = await Promise.all(
            tables.map(table => supabase.from(table).select('*'))
        );

        const [youth, name, location, gender, info, demographics, survey, meetingSurvey, household] = results.map(r => r.data);

        res.status(200).json({
            status: 'success',
            youths: { youth, name, location, gender, info, demographics, survey, meetingSurvey, household },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'failed', message: error.message });
    }
};

// ✅ Get one youth record
export const show = async (req, res) => {
    const { youth_id } = req.params;

    if (!youth_id) {
        return res.status(400).json({ status: 'failed', message: 'User ID is required' });
    }

    try {
        const check = await supabase.from('sk_youth').select('*').eq('youth_id', youth_id).single();

        if (!check.data) {
            return res.status(404).json({ status: 'failed', message: 'Youth not found' });
        }

        const tables = [
            'sk_youth',
            'sk_youth_name',
            'sk_youth_location',
            'sk_youth_gender',
            'sk_youth_info',
            'sk_youth_demographics',
            'sk_youth_survey',
            'sk_youth_meeting_survey',
            'sk_youth_household',
        ];

        const results = await Promise.all(
            tables.map(table =>
                supabase.from(table).select('*').eq('youth_id', youth_id).single()
            )
        );

        const [youth, name, location, gender, info, demographics, survey, meetingSurvey, household] = results.map(r => r.data);

        res.status(200).json({
            status: 'success',
            youth: { youth, name, location, gender, info, demographics, survey, meetingSurvey, household },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'failed', message: error.message });
    }
};

// ✅ Update user data (including hashed password if provided)
export const update = async (req, res) => {
    const { youth_id } = req.params;
    const fieldsToUpdate = req.body;

    if (!youth_id) {
        return res.status(400).json({
            status: 'failed',
            message: 'Youth ID is required',
        });
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({
            status: 'failed',
            message: 'No fields provided to update',
        });
    }

    try {
        const updateData = { ...fieldsToUpdate };

        // ✅ If password is being updated, hash it
        if (updateData.password) {
            updateData.password = await hashPassword(updateData.password);
        }

        const { data, error } = await supabase
            .from('sk_youth')
            .update(updateData)
            .eq('youth_id', youth_id)
            .is('deleted_at', null)
            .select()
            .single();

        if (error || !data) {
            return res.status(404).json({
                status: 'failed',
                message: 'Youth not found or update failed',
                error: error?.message,
            });
        }

        res.status(200).json({
            status: 'success',
            updated: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};
