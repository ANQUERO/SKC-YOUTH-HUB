import supabase from '../db/config.js';

export const createPost = async (req, res) => {
    const { admin_id, title, description } = req.body;
    if (!admin_id || !title || !description)
        return res.status(400).json({ status: 'failed', message: 'Missing required fields' });

    // Validate admin
    const { data: admin, error: adminErr } = await supabase
        .from('sk_official_admin')
        .select('admin_id')
        .eq('admin_id', admin_id)
        .maybeSingle();

    if (adminErr) throw adminErr;
    if (!admin) return res.status(403).json({ status: 'failed', message: 'Invalid admin ID' });

    const { data: post, error } = await supabase
        .from('posts')
        .insert([{ admin_id, title, description }])
        .select()
        .maybeSingle();

    if (error) throw error;
    res.status(201).json({ status: 'success', post });
};


export const getPosts = async (req, res) => {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ status: 'success', posts });
};

export const addComment = async (req, res) => {
    const { post_id } = req.params;
    const { user_type, user_id, content, parent_comment_id } = req.body;

    if (!['admin', 'user'].includes(user_type))
        return res.status(400).json({ status: 'failed', message: 'Invalid user type' });
    if (!user_id || !content)
        return res.status(400).json({ status: 'failed', message: 'Missing user_id or content' });

    const table = user_type === 'admin' ? 'sk_official_admin' : 'sk_youth';
    const idField = user_type === 'admin' ? 'admin_id' : 'youth_id';

    const { data: user, error: userErr } = await supabase
        .from(table)
        .select(idField)
        .eq(idField, user_id)
        .maybeSingle();

    if (userErr) throw userErr;
    if (!user) return res.status(403).json({ status: 'failed', message: 'Invalid user ID' });

    const { data: comment, error } = await supabase
        .from('post_comments')
        .insert([{ post_id, user_type, user_id, content, parent_comment_id }])
        .select()
        .maybeSingle();

    if (error) throw error;
    res.status(201).json({ status: 'success', comment });
};


export const addReaction = async (req, res) => {
    const { post_id } = req.params;
    const { user_type, user_id, type } = req.body;

    if (!['admin', 'user'].includes(user_type))
        return res.status(400).json({ status: 'failed', message: 'Invalid user type' });
    if (!user_id || !type)
        return res.status(400).json({ status: 'failed', message: 'Missing user_id or reaction type' });
    if (!['like', 'heart', 'wow'].includes(type))
        return res.status(400).json({ status: 'failed', message: 'Invalid reaction type' });

    const table = user_type === 'admin' ? 'sk_official_admin' : 'sk_youth';
    const idField = user_type === 'admin' ? 'admin_id' : 'youth_id';

    const { data: user, error: userErr } = await supabase
        .from(table)
        .select(idField)
        .eq(idField, user_id)
        .maybeSingle();

    if (userErr) throw userErr;
    if (!user) return res.status(403).json({ status: 'failed', message: 'Invalid user ID' });

    const { data: reaction, error } = await supabase
        .from('post_reactions')
        .insert([{ post_id, user_type, user_id, type }])
        .select()
        .maybeSingle();

    if (error) throw error;
    res.status(201).json({ status: 'success', reaction });
};


//Admin and Youth Features
export const editComment = async (req, res) => {
    const { comment_id } = req.params;
    const { user_id, user_type, content } = req.body;

    const { data: comment, error: cErr } = await supabase
        .from('post_comments')
        .select('*')
        .eq('comment_id', comment_id)
        .is('deleted_at', null)
        .maybeSingle();

    if (cErr) throw cErr;
    if (!comment) return res.status(404).json({ status: 'failed', message: 'Comment not found' });
    if (comment.user_id !== user_id || comment.user_type !== user_type)
        return res.status(403).json({ status: 'failed', message: 'Unauthorized' });

    const { error } = await supabase
        .from('post_comments')
        .update({ content, is_edited: true, updated_at: new Date().toISOString() })
        .eq('comment_id', comment_id);

    if (error) throw error;
    res.status(200).json({ status: 'success', message: 'Comment edited' });
};

export const deleteComment = async (req, res) => {
    const { comment_id } = req.params;
    const { user_id, user_type } = req.body;

    const { data: comment, error: cErr } = await supabase
        .from('post_comments')
        .select('*')
        .eq('comment_id', comment_id)
        .is('deleted_at', null)
        .maybeSingle();

    if (cErr) throw cErr;
    if (!comment) return res.status(404).json({ status: 'failed', message: 'Comment not found' });
    if (comment.user_id !== user_id || comment.user_type !== user_type)
        return res.status(403).json({ status: 'failed', message: 'Unauthorized' });

    const { error } = await supabase
        .from('post_comments')
        .update({ deleted_at: new Date().toISOString() })
        .eq('comment_id', comment_id);

    if (error) throw error;
    res.status(200).json({ status: 'success', message: 'Comment deleted' });
};


export const hideComment = async (req, res) => {
    const { comment_id } = req.params;
    const { admin_id } = req.body;

    const { data: comment, error: cErr } = await supabase
        .from('post_comments')
        .select('*')
        .eq('comment_id', comment_id)
        .is('deleted_at', null)
        .maybeSingle();

    if (cErr) throw cErr;
    if (!comment) return res.status(404).json({ status: 'failed', message: 'Comment not found' });
    if (comment.user_type !== 'user')
        return res.status(400).json({ status: 'failed', message: 'Only user comments can be hidden' });

    const { error } = await supabase
        .from('post_comments')
        .update({ hidden_by_admin: true })
        .eq('comment_id', comment_id);

    if (error) throw error;
    res.status(200).json({ status: 'success', message: 'Comment hidden by admin' });
};


export const deleteReaction = async (req, res) => {
    const { reaction_id } = req.params;
    const { user_id, user_type } = req.body;

    const { data: reaction, error: rErr } = await supabase
        .from('post_reactions')
        .select('*')
        .eq('reaction_id', reaction_id)
        .is('deleted_at', null)
        .maybeSingle();

    if (rErr) throw rErr;
    if (!reaction) return res.status(404).json({ status: 'failed', message: 'Reaction not found' });
    if (reaction.user_id !== user_id || reaction.user_type !== user_type)
        return res.status(403).json({ status: 'failed', message: 'Unauthorized' });

    const { error } = await supabase
        .from('post_reactions')
        .update({ deleted_at: new Date().toISOString() })
        .eq('reaction_id', reaction_id);

    if (error) throw error;
    res.status(200).json({ status: 'success', message: 'Reaction deleted' });
};


