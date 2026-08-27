import pg from "pg";
import dotenv from "dotenv";
import { createDatabaseConfig } from "./options.js";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool(createDatabaseConfig(process.env));

export const initDB = async () => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS connected_at, current_database() AS database",
    );
    console.log("Database connected:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    throw error;
  }
};
