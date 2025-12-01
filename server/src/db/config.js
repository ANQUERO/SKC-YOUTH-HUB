import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5600,
    password: process.env.DB_PASSWORD,
});

export const initDB = async () => {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log(
            "Database Connected: ",
            res.rows[0]
        );
    } catch (error) {
        console.error("Error connecting to the database", error);
    }
};
