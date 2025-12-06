import { pool } from "../db/config.js";
import bcrypt from "bcrypt";

const inferMediaType = (url) => {
    try {
        const u = String(url).toLowerCase();
        if (u.includes("/image/") || u.includes("/images/") || u.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
            return "image";
        }
        if (u.includes("/video/") || u.includes("/videos/") || u.match(/\.(mp4|webm|mov|m4v)$/)) {
            return "video";
        }
    } catch {
        // Error handling
    }
    return null; // Changed from "null" string to null
};

// Public endpoint for landing page - fetches from landing_page_content table (no auth required)
export const getPublicOfficials = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                content_id,
                official_name,
                official_title,
                media_url,
                created_at
            FROM landing_page_content
            ORDER BY created_at DESC
        `);

        // Format the data for the landing page
        const formattedOfficials = result.rows.map(content => ({
            id: content.content_id,
            name: content.official_name || "Unknown",
            title: content.official_title || "Official",
            img: content.media_url || "/default-profile.png"
        }));

        res.status(200).json({
            status: "Success",
            data: formattedOfficials
        });
    } catch (error) {
        console.error("Failed to fetch public officials:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const index = async (req, res) => {
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {

        const result = await pool.query("SELECT * FROM fetch_sk_officials()");

        console.log("SK Officials", result.rows);
        res.status(200).json({
            status: "Success",
            data: result.rows
        });
    } catch (error) {
        console.error("Failed to fetch SK Officials:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const show = async (req, res) => {
    const { id: official_id } = req.params;
    const user = req.user;

    if (!official_id || isNaN(official_id)) {
        return res.status(400).json({
            status: "Error",
            message: "A valid official ID is required"
        });
    }

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM fetch_sk_official($1)",
            [parseInt(official_id)]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Official not found"
            });
        }

        res.status(200).json({
            status: "Success",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Failed to fetch SK Official data:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const update = async (req, res) => {
    const { id: official_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== "admin" || parseInt(official_id) !== user.official_id) {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - You can only update your own account"
        });
    }

    try {
        const fields = { ...req.body };

        // Handle password separately if provided
        if (fields.password) {
            const saltRounds = 10;
            fields.password = await bcrypt.hash(fields.password, saltRounds);
        } else {
            delete fields.password; // Remove if not updating
        }

        const entries = Object.entries(fields).filter(entry => entry[1] !== undefined && entry[1] !== null);
        if (entries.length === 0) {
            return res.status(400).json({
                status: "Error",
                message: "No valid fields provided for update"
            });
        }

        // Build dynamic query
        const setClause = entries
            .map(([key], i) => `${key} = $${i + 1}`)
            .join(", ");

        const values = entries.map(entry => entry[1]);

        const query = `
            UPDATE sk_official_admin
            SET ${setClause}, updated_at = NOW()
            WHERE official_id = $${values.length + 1}
            RETURNING *;
        `;

        const result = await pool.query(query, [...values, official_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Admin not found"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Admin profile updated successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const destroy = async (req, res) => {
    const { id: official_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== "admin") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            "UPDATE sk_official_admin SET is_active = false WHERE official_id = $1 RETURNING *",
            [official_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Admin not found"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Admin account disabled successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Failed to disable admin account:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const enable = async (req, res) => {
    const { id: official_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== "admin") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            "UPDATE sk_official_admin SET is_active = true WHERE official_id = $1 RETURNING *",
            [official_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Admin not found"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Admin account enabled successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Failed to enable admin account:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const disableComment = async (req, res) => {
    const { id: official_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== "admin") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            "UPDATE sk_official_admin SET comment_at = true WHERE official_id = $1 RETURNING *",
            [official_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Admin not found"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Admin comment disabled successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Failed to disable admin comment:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const enableComment = async (req, res) => {
    const { id: official_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== "admin") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        const result = await pool.query(
            "UPDATE sk_official_admin SET comment_at = false WHERE official_id = $1 RETURNING *",
            [official_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Admin not found"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Admin comment enabled successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Failed to enable admin comment:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }

};

export const indexContent = async (req, res) => {
    const user = req.user;
    const { content_id, official_id } = req.query;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only admins can access this resource"
        });
    }

    try {
        let result;
        
        // If content_id is provided, fetch specific content
        if (content_id) {
            result = await pool.query(
                "SELECT * FROM landing_page_content WHERE content_id = $1 ORDER BY created_at DESC",
                [parseInt(content_id)]
            );
        }
        // If official_id is provided, fetch contents for that official
        else if (official_id) {
            result = await pool.query(
                "SELECT * FROM landing_page_content WHERE official_id = $1 ORDER BY created_at DESC",
                [parseInt(official_id)]
            );
        }
        // Otherwise, fetch all contents
        else {
            result = await pool.query(
                "SELECT * FROM landing_page_content ORDER BY created_at DESC"
            );
        }
        
        res.status(200).json({
            status: "Success",
            data: result.rows
        });
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const showContent = async (req, res) => {
    const { id: content_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can access this resource"
        });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM landing_page_content WHERE content_id = $1",
            [parseInt(content_id)]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Content not found"
            });
        }

        res.status(200).json({
            status: "Success",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const storeContent = async (req, res) => {
    const user = req.user;
    
    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can access this resource"
        });
    }

    // Get data from body or uploaded files
    const official_name = req.body.official_name;
    const official_title = req.body.official_title;
    let media_url = req.body.media_url;
    
    // If file was uploaded, use the uploaded image URL
    if (res.locals.uploaded_images && res.locals.uploaded_images.length > 0) {
        media_url = res.locals.uploaded_images[0];
    }

    // Validation
    if (!official_name || !official_title || !media_url) {
        return res.status(400).json({
            status: "Error",
            message: "All fields are required"
        });
    }

    // Infer media_type from media_url
    const media_type = inferMediaType(media_url);
    
    if (media_type !== "image") {
        return res.status(400).json({
            status: "Error",
            message: "Only image media type is allowed"
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO landing_page_content 
             (official_name, official_title, media_type, media_url) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [official_name, official_title, media_type, media_url]
        );
        
        res.status(201).json({
            status: "Success",
            message: "Content created successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error creating content:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const updateContent = async (req, res) => {
    const { id: content_id } = req.params;
    const user = req.user;
    
    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can access this resource"
        });
    }

    const { official_name, official_title, media_type } = req.body;
    let media_url = req.body.media_url;
    
    // If file was uploaded, use the uploaded image URL
    if (res.locals.uploaded_images && res.locals.uploaded_images.length > 0) {
        media_url = res.locals.uploaded_images[0];
    }

    // Validation
    if (media_type && media_type !== "image") {
        return res.status(400).json({
            status: "Error",
            message: "Media type must be 'image'"
        });
    }

    try {
        // First check if content exists
        const existingContent = await pool.query(
            "SELECT * FROM landing_page_content WHERE content_id = $1",
            [parseInt(content_id)]
        );

        if (existingContent.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Content not found"
            });
        }

        // Build dynamic update query
        const updateFields = [];
        const values = [];
        let paramCount = 1;

        if (official_name) {
            updateFields.push(`official_name = $${paramCount}`);
            values.push(official_name);
            paramCount++;
        }

        if (official_title) {
            updateFields.push(`official_title = $${paramCount}`);
            values.push(official_title);
            paramCount++;
        }

        if (media_type) {
            updateFields.push(`media_type = $${paramCount}`);
            values.push(media_type);
            paramCount++;
        }

        if (media_url) {
            updateFields.push(`media_url = $${paramCount}`);
            values.push(media_url);
            paramCount++;
        }

        // Always update the updated_at timestamp
        updateFields.push("updated_at = CURRENT_TIMESTAMP");
        
        values.push(parseInt(content_id));

        const result = await pool.query(
            `UPDATE landing_page_content 
             SET ${updateFields.join(", ")} 
             WHERE content_id = $${paramCount} 
             RETURNING *`,
            values
        );
        
        res.status(200).json({
            status: "Success",
            message: "Content updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating content:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

export const deleteContent = async (req, res) => {
    const { id: content_id } = req.params;
    const user = req.user;

    if (!user || user.userType !== "official") {
        return res.status(403).json({
            status: "Error",
            message: "Forbidden - Only officials can access this resource"
        });
    }

    try {
        // First check if content exists
        const existingContent = await pool.query(
            "SELECT * FROM landing_page_content WHERE content_id = $1",
            [parseInt(content_id)]
        );

        if (existingContent.rows.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Content not found"
            });
        }

        await pool.query(
            "DELETE FROM landing_page_content WHERE content_id = $1",
            [parseInt(content_id)]
        );
        
        res.status(200).json({
            status: "Success",
            message: "Content deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};