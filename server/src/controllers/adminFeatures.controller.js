import supabase from '../db/config.js';
import { hashPassword } from '../lib/index.js';

// 🧾 Get all youth data (admin-only)
export const index = async (req, res) => {
    const { admin_id } = req.query;
    if (!admin_id) return res.status(403).json({ status: 'failed', message: 'Dili pwede. Para ra ni sa admin.' });

    try {
        // Ensure admin exists
        const { data: admin } = await supabase.from('admins').select('admin_id').eq('admin_id', admin_id).single();
        if (!admin) return res.status(403).json({ status: 'failed', message: 'Invalid admin.' });

        const tables = [
            'sk_youth',
            'sk_youth_name',
            'sk_youth_location',
            'sk_youth_gender',
            'sk_youth_info',
            'sk_youth_demographics',
            'sk_youth_survey',
            'sk_youth_meeting_survey',
            'sk_youth_household'
        ];

        const results = await Promise.all(tables.map(tbl =>
            supabase.from(tbl).select('*').is('deleted_at', null)
        ));

        res.status(200).json({
            status: 'success',
            youths: Object.fromEntries(tables.map((tbl, i) => [tbl.split('sk_youth_')[1] || 'youth', results[i].data]))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failed', message: err.message });
    }
};

// 📝 Create youth (signup w/ nested body data)
export const create = async (req, res) => {
    const {
        username, password, name, location, gender, info,
        demographics, survey, meetingSurvey, household
    } = req.body;

    if (!username || !password || !name || !location || !gender || !info || !demographics || !survey || !meetingSurvey || !household) {
        return res.status(400).json({ status: 'failed', message: 'Kompletohon ang tanang datos.' });
    }

    try {
        const hashedPassword = await hashPassword(password);

        const { data: youth, error: youthErr } = await supabase
            .from('sk_youth')
            .insert([{ username, password: hashedPassword }])
            .select('youth_id')
            .single();
        if (youthErr) throw youthErr;

        const youth_id = youth.youth_id;
        const inserts = [
            supabase.from('sk_youth_name').insert([{ youth_id, ...name }]),
            supabase.from('sk_youth_location').insert([{ youth_id, ...location }]),
            supabase.from('sk_youth_gender').insert([{ youth_id, gender }]),
            supabase.from('sk_youth_info').insert([{ youth_id, ...info }]),
            supabase.from('sk_youth_demographics').insert([{ youth_id, ...demographics }]),
            supabase.from('sk_youth_survey').insert([{ youth_id, ...survey }]),
            supabase.from('sk_youth_meeting_survey').insert([{ youth_id, ...meetingSurvey }]),
            supabase.from('sk_youth_household').insert([{ youth_id, household }])
        ];

        for (const ins of inserts) {
            const { error } = await ins;
            if (error) throw error;
        }

        res.status(201).json({ status: 'success', message: 'Malampusong narehistro ang youth.', youth_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failed', message: err.message });
    }
};

// 🗑️ Soft delete youth (admin-only)
export const destroy = async (req, res) => {
    const { youth_id } = req.params;
    const { admin_id } = req.body;

    if (!youth_id || !admin_id) {
        return res.status(400).json({ status: 'failed', message: 'Kinahanglan ang Youth ID ug Admin ID.' });
    }

    try {
        const { data: admin } = await supabase.from('admins').select('admin_id').eq('admin_id', admin_id).single();
        if (!admin) return res.status(403).json({ status: 'failed', message: 'Dili awtorisado: Wala ang admin.' });

        const { data, error } = await supabase
            .from('sk_youth')
            .update({ deleted_at: new Date().toISOString() })
            .eq('youth_id', youth_id)
            .is('deleted_at', null)
            .select()
            .single();

        if (error || !data) {
            return res.status(404).json({ status: 'failed', message: 'Wala nakit-an o gi-delete na.' });
        }

        res.status(200).json({ status: 'success', message: 'Malampusong gi-soft delete ang youth.', deleted: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failed', message: err.message });
    }
};

// ♻️ Restore soft-deleted youth (admin-only)
export const restore = async (req, res) => {
    const { youth_id } = req.params;
    const { admin_id } = req.body;

    if (!youth_id || !admin_id) {
        return res.status(400).json({ status: 'failed', message: 'Kinahanglan ang Youth ID ug Admin ID.' });
    }

    try {
        const { data: admin } = await supabase.from('admins').select('admin_id').eq('admin_id', admin_id).single();
        if (!admin) return res.status(403).json({ status: 'failed', message: 'Dili awtorisado: Admin wala.' });

        const { data, error } = await supabase
            .from('sk_youth')
            .update({ deleted_at: null })
            .eq('youth_id', youth_id)
            .not('deleted_at', 'is', null)
            .select()
            .single();

        if (error || !data) {
            return res.status(404).json({ status: 'failed', message: 'Wala nakit-an o wala gi-delete.' });
        }

        res.status(200).json({ status: 'success', message: 'Malampusong gi-restore ang youth.', restored: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failed', message: err.message });
    }
};

// 🚫 Disable comment status (admin-only)
export const disable = async (req, res) => {
    const { youth_id } = req.params;
    const { admin_id } = req.body;

    if (!admin_id) return res.status(403).json({ status: 'failed', message: 'Dili pwede. Admin ra ang maka-disable.' });
    if (!youth_id) return res.status(400).json({ status: 'failed', message: 'Youth ID kinahanglan.' });

    try {
        const { data, error } = await supabase
            .from('sk_youth')
            .update({ comment_status: false, updated_at: new Date().toISOString() })
            .eq('youth_id', youth_id)
            .is('deleted_at', null)
            .select('youth_id, comment_status')
            .single();

        if (error || !data) {
            return res.status(404).json({ status: 'failed', message: 'Wala nakit-an ang youth o gi-delete na.' });
        }

        res.status(200).json({ status: 'success', message: 'Na-disable ang comment status.', youth: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failed', message: err.message });
    }
};

// ✅ Enable comment status (admin-only)
export const enable = async (req, res) => {
    const { youth_id } = req.params;
    const { admin_id } = req.body;

    if (!admin_id) return res.status(403).json({ status: 'failed', message: 'Dili pwede. Admin ra ang maka-enable.' });
    if (!youth_id) return res.status(400).json({ status: 'failed', message: 'Youth ID kinahanglan.' });

    try {
        const { data, error } = await supabase
            .from('sk_youth')
            .update({ comment_status: true, updated_at: new Date().toISOString() })
            .eq('youth_id', youth_id)
            .is('deleted_at', null)
            .select('youth_id, comment_status')
            .single();

        if (error || !data) {
            return res.status(404).json({ status: 'failed', message: 'Wala nakit-an ang youth o gi-delete na.' });
        }

        res.status(200).json({ status: 'success', message: 'Na-enable ang comment status.', youth: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failed', message: err.message });
    }
};
