import {pool} from "../db/config.js"

export const index  = async (req, res) => {
    const user = req.user;

    try {
        let whereClause = '';
        if (!user || user.userType !== 'official') {
            whereClause = 'WHERE f.is_hidden = FALSE';
        }

        const result = await pool.query(
            `
            SELECT 
            f.form_id,
            f.title,
            f.description,
            f.is_hidden,
            f.created_at,
            f.updated_at,
            n.first_name,            
            n.middle_name,
            n.last_name,
            n.suffix,
            `
        )
    } catch (error) {
        
    }
    
}