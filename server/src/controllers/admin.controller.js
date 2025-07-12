import { hashPassword } from '../lib/index.js'
import supabase from '../db/config.js';

export const index = async (req, res) => {
    try {

        const {
            data: admins, error
        } = await supabase
            .from(sk_official_admin)
            .select('*')

        if (error) throw error

        res.status(200).json({
            status: 'success',
            admins,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
}

export const show = async (req, res) => {

    try {
        const { admin_id } = req.params;

        if (!admin_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const {
            data: admin, error
        } = await supabase
            .from('sk_official_admin')
            .select('*')
            .eq('admin_id', admin_id)
            .maybeSingle();

        if (error) throw error;

        if (!admin) {
            return res.status(404).json({
                status: 'failed',
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            status: 'success',
            admin,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

export const update = async (req, res) => {
    try {
        const { admin_id } = req.params;

        if (!admin_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const allowedFields = ['first_name', 'last_name', 'email', 'role', 'position', 'password'];
        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                if (field === 'password') {
                    updates[field] = await hashPassword(req.body.password);
                } else {
                    updates[field] = req.body[field];
                }
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                status: "failed",
                message: "No valid fields provided for update",
            });
        }

        const { data: updatedAdmin, error } = await supabase
            .from('sk_official_admin')
            .update(updates)
            .eq('admin_id', admin_id)
            .select()
            .maybeSingle();

        if (error) throw error;

        res.status(200).json({
            status: 'success',
            message: 'Admin updated successfully',
            admin: updatedAdmin,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

export const disable = async (req, res) => {
    const { admin_id } = req.params;
    const { role } = req.body;

    if (!admin_id) {
        return res.status(400).json({
            status: "failed",
            message: "Admin ID is required"
        });
    }

    if (role !== 'super_sk_admin') {
        return res.status(403).json({
            status: "failed",
            message: "You do not have permission to disable an admin account"
        });
    }

    try {
        const { data: admin, error: findError } = await supabase
            .from('sk_official_admin')
            .select('*')
            .eq('admin_id', admin_id)
            .maybeSingle();

        if (findError) throw findError;

        if (!admin) {
            return res.status(404).json({
                status: 'failed',
                message: 'Admin not found'
            });
        }

        if (admin.role === 'super_sk_admin') {
            return res.status(400).json({
                status: 'failed',
                message: 'You cannot disable another admin if you are not a super admin'
            });
        }

        const { data: disabledAdmin, error: updateError } = await supabase
            .from('sk_official_admin')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('admin_id', admin_id)
            .select()
            .maybeSingle();

        if (updateError) throw updateError;

        return res.status(200).json({
            status: 'success',
            message: 'Admin account disabled successfully',
            admin: disabledAdmin
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'failed',
            message: 'An error occurred while disabling the admin account',
            error: error.message
        });
    }
};


export const enable = async (req, res) => {
    const { admin_id } = req.params;
    const { role } = req.body;

    try {
        if (!admin_id) {
            return res.status(400).json({
                status: "failed",
                message: "Admin ID is required"
            });
        }

        if (role !== 'super_sk_admin') {
            return res.status(403).json({
                status: "failed",
                message: "You do not have permission to enable an admin account"
            });
        }

        const { data: updatedAdmin, error } = await supabase
            .from('sk_official_admin')
            .update({ is_active: true, updated_at: new Date().toISOString() })
            .eq('admin_id', admin_id)
            .select()
            .maybeSingle();

        if (error) throw error;

        return res.status(200).json({
            status: 'success',
            message: 'Admin account enabled successfully',
            admin: updatedAdmin
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'failed',
            message: 'An error occurred while enabling the admin account',
            error: error.message
        });
    }
};

