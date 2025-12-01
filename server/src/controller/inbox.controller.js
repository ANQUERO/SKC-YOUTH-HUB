import { pool } from "../db/config.js";

export const index = async (req, res) => {
  const user = req.user;

  if (!user || user.userType !== "offcial") {
    return res.status(403).json({
      status: "Error",
      message: "Forbidden - Only admins can access this resource",
    });
  }

  try {
    const result = await pool.query("SELECT * FROM forms");

    res.status(200).json({
      status: "Success",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};

export const show = async (req, res) => {
  const { id: form_id } = req.params;
  const user = req.user;

  if (!user || user.userType !== "official") {
    return res.status(403).json({
      status: "Error",
      message: "Forbidden - Only admin can access this resource",
    });
  }

  try {
    const result = await pool.query(
      `
            SELECT * FROM forms WHERE form_id = $1
            `,
      [form_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "Form not found ",
      });
    }

    res.status(200).json({
      status: "Success",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to fetch forms data: ", error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};

export const store = async (req, res) => {
  const user = req.user;
  const { title, description } = body.description || body.title || "";

  if (!user || user.userType !== "official") {
    return res.status(403).json({
      status: "Error",
      message: "Forbidden - Only officials can create this inbox",
    });
  }

  if (!title || description) {
    return res.status(400).json({
      status: "Error",
      message: "Both title and description are required",
    });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO forms (official_id, title, description)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
      [user.official_id, title, description]
    );

    return res.status(201).json({
      status: "Success",
      message: "Form created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to create form: ", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};

export const update = async (req, re) => {
  const { id: form_id } = req.params;
  const user = req.user;
  const { title, description, is_hidden } = req.body;

  if (!user || user.userType !== "official") {
    return res.status(403).json({
      status: "Error",
      message: "Forbidden - Only officials can update forms",
    });
  }

  try {
    const result = await pool.query(
      `
        UPDATE forms 
        SET 
        title = COALSCE($1, title),
        description = COALSCE($2, description),
        is_hidden = COALSCE($3, is_hidden),
        updated_at = CURRENT_TIMESTAMP
        WHERE form_id = $4 AND deleted_at IS_NULL
        RETURNING *
        `,
      [title, description, is_hidden, form_id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        status: "Error",
        message: "Form not found",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Form updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating form:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};

export const destroy = async (req, res) => {
  const user = req.user;
  const { id: form_id } = req.params;

  if (!user || user.userType !== "official") {
    return res.status(403).json({
      status: "Error",
      message: "Forbidden - Only officials can delte this form",
    });
  }

  try {
    const result = await pool.query(
      `
      UPDATE forms
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE form_id = $1 AND deleted_at IS NULL
      RETURNING *
      `,
      [form_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "Form not found",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Form deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting form: ", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
};

export const reply = async (req, res) => {
  const { id: form_id } = req.params;
  const user = req.user;
  const { response } = req.body;

  if (!user || user.userType !== "youth") {
    return res.status(403).json({
      status: "Error",
      message: "Forbidden - Only youth can reply to forms",
    });
  }

  if (!response) {
    return res.status(400).json({
      status: "Error",
      message: "Response text is required"
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO replied_forms(form_id, youth_id, response)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [form_id, user.youth_id, response]
    );

    return res.status(201).json({
      status: "Success",
      message: "Reply submitted successfully",
      data: result.rows[0],
    });
    
  } catch (error) {
    console.error("Error submitted reply:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error"
    });
  }
};

export const replied = async (req, res) => {
  const user = req.user;

};