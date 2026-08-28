import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import {
  generateTokenAndSetCookies,
  getAuthCookieOptions,
} from "../utils/jwt.js";
import { validationErrors } from "../utils/validators.js";
import { isPassword } from "../utils/custom.validators.js";
import { validationResult } from "express-validator";
import { pool } from "../db/config.js";
import crypto from "crypto";

const sendPasswordResetToken = async (email, token) => {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing email configuration: ${missing.join(", ")}`);
  }

  const port = Number.parseInt(process.env.SMTP_PORT, 10);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "SKC Youth Hub password reset token",
    text: `Your password reset token is: ${token}\n\nThis token expires in one hour.`,
  });
};

export const signupAdmin = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      email,
      password,
      official_position,
      role: requestedRole,
      first_name,
      middle_name,
      last_name,
      suffix,
      contact_number,
      gender,
      age,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: validationErrors(errors),
      });
    }

    await client.query("BEGIN");
    await client.query("LOCK TABLE sk_official IN EXCLUSIVE MODE");

    const countResult = await client.query(
      "SELECT COUNT(*)::integer AS count FROM sk_official",
    );
    const isBootstrap = countResult.rows[0].count === 0;
    const requesterRoles = Array.isArray(req.user?.role) ? req.user.role : [];

    if (
      !isBootstrap &&
      (req.user?.userType !== "official" ||
        !requesterRoles.includes("super_official"))
    ) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        error: "Only a super official can register another official",
      });
    }

    const normalizedRole = isBootstrap
      ? "super_official"
      : Array.isArray(requestedRole)
        ? requestedRole[0]
        : requestedRole;

    if (!["super_official", "natural_official"].includes(normalizedRole)) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Invalid official role" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const officialResult = await client.query(
      `INSERT INTO sk_official (email, password, official_position, role)
       VALUES ($1, $2, $3, $4)
       RETURNING official_id, email, official_position, role`,
      [email, hashedPassword, official_position, normalizedRole],
    );

    const official = officialResult.rows[0];

    await client.query(
      `INSERT INTO sk_official_name
       (official_id, first_name, middle_name, last_name, suffix)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        official.official_id,
        first_name,
        middle_name || null,
        last_name,
        suffix || null,
      ],
    );

    await client.query(
      `INSERT INTO sk_official_info
       (official_id, contact_number, gender, age)
       VALUES ($1, $2, $3, $4)`,
      [
        official.official_id,
        contact_number || null,
        gender || null,
        age || null,
      ],
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message: isBootstrap
        ? "Super official account initialized successfully"
        : "SK Official registered successfully",
      official,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Signup error:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    return res.status(500).json({
      error: "Server error",
    });
  } finally {
    client.release();
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!isPassword(newPassword)) {
      return res.status(400).json({
        message:
          "New password must be at least 8 characters and include uppercase, lowercase, a number, and a special character",
      });
    }

    let table, idField;
    if (user.userType === "official") {
      table = "sk_official";
      idField = "official_id";
    } else if (user.userType === "youth") {
      table = "sk_youth";
      idField = "youth_id";
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    const { rows } = await pool.query(
      `SELECT password FROM ${table} WHERE ${idField} = $1`,
      [user[idField]],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const ok = await bcrypt.compare(currentPassword, rows[0].password);
    if (!ok) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    await pool.query(
      `UPDATE ${table} SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE ${idField} = $2`,
      [hashed, user[idField]],
    );

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: validationErrors(errors),
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const {
        email,
        password,
        first_name,
        middle_name,
        last_name,
        suffix,
        region,
        province,
        municipality,
        barangay,
        purok_id,
        gender,
        age,
        contact_number,
        birthday,
        civil_status,
        youth_age_gap,
        youth_classification,
        educational_background,
        work_status,
        registered_voter,
        registered_national_voter,
        vote_last_election,
        attended,
        times_attended,
        reason_not_attend,
        household,
      } = req.body;

      // Convert all numeric fields to proper values
      const convertToInt = (value) => {
        if (value === "" || value === null || value === undefined) {
          return null;
        }
        const num = parseInt(value, 10);
        return isNaN(num) ? null : num;
      };

      const convertToBoolean = (value) => {
        if (value === "" || value === null || value === undefined) {
          return null;
        }

        // If it's already boolean, return as-is
        if (typeof value === "boolean") {
          return value;
        }

        // If it's a string, handle specific cases
        if (typeof value === "string") {
          const lowerValue = value.toLowerCase().trim();

          // Return true for affirmative values
          if (["true", "yes", "y", "1", "t"].includes(lowerValue)) {
            return true;
          }

          // Return false for negative values
          if (["false", "no", "n", "0", "f"].includes(lowerValue)) {
            return false;
          }

          // If it's not a recognized boolean string, default to false or return null
          // Depending on your requirements, you might want to throw an error here
          return false; // or return null
        }

        // For numbers: 1 = true, 0 = false
        if (typeof value === "number") {
          return value === 1;
        }

        // For any other type, use standard conversion
        return Boolean(value);
      };

      // Apply conversions
      const ageNum = convertToInt(age);
      const purokIdNum = convertToInt(purok_id);
      const timesAttendedNum = convertToInt(times_attended);

      // Convert boolean fields
      const registeredVoterBool = convertToBoolean(registered_voter);
      const registeredNationalVoterBool = convertToBoolean(
        registered_national_voter,
      );
      const voteLastElectionBool = convertToBoolean(vote_last_election);
      const attendedBool = convertToBoolean(attended);

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Insert into sk_youth
      const youthResult = await client.query(
        `
                INSERT INTO sk_youth (email, password, verified, reset_token, reset_token_expiry)
                VALUES ($1, $2, false, $3, NOW() + INTERVAL '24 hours') RETURNING youth_id;
            `,
        [email, hashedPassword, verificationToken],
      );

      const youth_id = youthResult.rows[0].youth_id;

      // Insert name
      await client.query(
        `
                INSERT INTO sk_youth_name (youth_id, first_name, middle_name, last_name, suffix)
                VALUES ($1, $2, $3, $4, $5);
            `,
        [youth_id, first_name, middle_name || "", last_name, suffix || ""],
      );

      // Location - FIXED: Use converted purokIdNum
      await client.query(
        `
                INSERT INTO sk_youth_location (youth_id, region, province, municipality, barangay, purok_id)
                VALUES ($1, $2, $3, $4, $5, $6);
            `,
        [youth_id, region, province, municipality, barangay, purokIdNum],
      );

      // Gender
      await client.query(
        `
                INSERT INTO sk_youth_gender (youth_id, gender)
                VALUES ($1, $2);
            `,
        [youth_id, gender],
      );

      // Info
      await client.query(
        `
                INSERT INTO sk_youth_info (youth_id, age, contact_number, birthday)
                VALUES ($1, $2, $3, $4);
            `,
        [youth_id, ageNum, contact_number || "", birthday || null],
      );

      // Demographics
      await client.query(
        `
                INSERT INTO sk_youth_demographics (youth_id, civil_status, youth_age_gap, youth_classification, educational_background, work_status)
                VALUES ($1, $2, $3, $4, $5, $6);
            `,
        [
          youth_id,
          civil_status,
          youth_age_gap || "",
          youth_classification,
          educational_background,
          work_status,
        ],
      );

      // Voter survey - FIXED: Use converted booleans
      await client.query(
        `
                INSERT INTO sk_youth_survey (youth_id, registered_voter, registered_national_voter, vote_last_election)
                VALUES ($1, $2, $3, $4);
            `,
        [
          youth_id,
          registeredVoterBool,
          registeredNationalVoterBool,
          voteLastElectionBool,
        ],
      );

      // Meeting attendance - FIXED: Use converted values
      await client.query(
        `
                INSERT INTO sk_youth_meeting_survey (youth_id, attended, times_attended, reason_not_attend)
                VALUES ($1, $2, $3, $4);
            `,
        [youth_id, attendedBool, timesAttendedNum, reason_not_attend || ""],
      );

      // Household
      await client.query(
        `
                INSERT INTO sk_youth_household (youth_id, household)
                VALUES ($1, $2);
            `,
        [youth_id, household || ""],
      );

      // Attachment
      if (res.locals.uploaded_images && res.locals.uploaded_images.length > 0) {
        const fileUrl = res.locals.uploaded_images[0];
        const file = req.files && req.files[0] ? req.files[0] : null;
        await client.query(
          `
                    INSERT INTO sk_youth_attachments (youth_id, file_name, file_type, file_url)
                    VALUES ($1, $2, $3, $4);
                `,
          [
            youth_id,
            file ? file.originalname : "attachment",
            file ? file.mimetype : "application/octet-stream",
            fileUrl,
          ],
        );
      }

      await client.query("COMMIT");
      res.status(201).json({
        message:
          "Signup completed successfully. Please check your email for verification.",
        youth_id,
        verificationSent: true,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Signup error:", error);

      if (error.message && error.message.includes("duplicate key")) {
        return res.status(400).json({
          error: "Email already exists",
          message: "An account with this email already exists",
        });
      }

      // More specific error handling for data type issues
      if (error.code === "22P02") {
        // Invalid text representation error
        return res.status(400).json({
          error: "Invalid data format",
          message:
            "Please check that all fields are filled correctly (e.g., numbers should be numeric values)",
        });
      }

      res.status(500).json({
        error: "Signup failed",
        message: error.message || "An error occurred during registration",
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Signup error (outside transaction):", error);
    res.status(500).json({
      error: "Server error",
      message: "An error occurred during registration",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(validationErrors(errors));
    }

    // Try admin table first
    let result = await pool.query(
      "SELECT * FROM sk_official WHERE email = $1",
      [email],
    );

    let user = null;
    let userType = null;
    let idField = null;

    if (result.rows.length > 0) {
      user = result.rows[0];
      userType = "official";
      idField = "official_id";
    } else {
      // Try youth table
      result = await pool.query("SELECT * FROM sk_youth WHERE email = $1", [
        email,
      ]);

      if (result.rows.length > 0) {
        user = result.rows[0];
        userType = "youth";
        idField = "youth_id";
      }
    }

    if (!user) {
      return res.status(401).json({
        errors: { email: "Invalid credentials" },
      });
    }

    if (user.is_active === false) {
      return res.status(403).json({
        errors: { email: "This account has been disabled" },
      });
    }

    if (userType === "youth" && user.verified !== true) {
      return res.status(403).json({
        errors: { email: "This account is awaiting verification" },
      });
    }

    // Check if password exists
    if (!user.password) {
      return res.status(401).json({
        errors: { password: "Invalid credentials" },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        errors: { password: "Invalid credentials" },
      });
    }

    // Sign token and set cookie
    const token = generateTokenAndSetCookies(user, res, userType);

    // Return user data (safe)
    const responseUser = {
      id: user[idField],
      email: user.email,
      userType,
    };

    if (userType === "official") {
      Object.assign(responseUser, {
        official_position: user.official_position,
        role: user.role,
      });
    } else if (userType === "youth") {
      Object.assign(responseUser, {
        // Add youth-specific fields if needed
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user: responseUser,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt", getAuthCookieOptions());

  return res.status(200).json({
    message: "Logged out successfully",
  });
};

// Forgot password - send reset email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "Error",
        message: "Email is required",
      });
    }

    // Check if user exists in either table
    let user = null;
    let userType = null;
    let idField = null;

    // Check official table first
    let result = await pool.query(
      "SELECT official_id, email FROM sk_official WHERE email = $1",
      [email],
    );

    if (result.rows.length > 0) {
      user = result.rows[0];
      userType = "official";
      idField = "official_id";
    } else {
      // Check youth table
      result = await pool.query(
        "SELECT youth_id, email FROM sk_youth WHERE email = $1",
        [email],
      );

      if (result.rows.length > 0) {
        user = result.rows[0];
        userType = "youth";
        idField = "youth_id";
      }
    }

    const genericResponse = {
      status: "Success",
      message:
        "If an account exists for that email, reset instructions have been generated",
    };

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    await pool.query(
      `UPDATE ${userType === "official" ? "sk_official" : "sk_youth"} 
             SET reset_token = $1, reset_token_expiry = $2, updated_at = CURRENT_TIMESTAMP 
             WHERE ${idField} = $3`,
      [resetTokenHash, resetTokenExpiry, user[idField]],
    );

    await sendPasswordResetToken(user.email, resetToken);

    return res.status(200).json({
      ...genericResponse,
      resetToken: process.env.NODE_ENV === "test" ? resetToken : undefined,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};

// Reset password with token
export const resetPasswordWithToken = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        status: "Error",
        message: "Token and new password are required",
      });
    }

    if (!isPassword(newPassword)) {
      return res.status(400).json({
        status: "Error",
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Check if token exists and is valid in either table
    let user = null;
    let userType = null;
    let idField = null;

    // Check official table first
    let result = await pool.query(
      "SELECT official_id, reset_token_expiry FROM sk_official WHERE reset_token = $1",
      [tokenHash],
    );

    if (result.rows.length > 0) {
      user = result.rows[0];
      userType = "official";
      idField = "official_id";
    } else {
      // Check youth table
      result = await pool.query(
        "SELECT youth_id, reset_token_expiry FROM sk_youth WHERE reset_token = $1",
        [tokenHash],
      );

      if (result.rows.length > 0) {
        user = result.rows[0];
        userType = "youth";
        idField = "youth_id";
      }
    }

    if (!user) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid or expired reset token",
      });
    }

    // Check if token is expired
    if (new Date() > new Date(user.reset_token_expiry)) {
      return res.status(400).json({
        status: "Error",
        message: "Reset token has expired",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    await pool.query(
      `UPDATE ${userType === "official" ? "sk_official" : "sk_youth"} 
             SET password = $1, reset_token = NULL, reset_token_expiry = NULL, updated_at = CURRENT_TIMESTAMP 
             WHERE ${idField} = $2`,
      [hashedPassword, user[idField]],
    );

    return res.status(200).json({
      status: "Success",
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};
