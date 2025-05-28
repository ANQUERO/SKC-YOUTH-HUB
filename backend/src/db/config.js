import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URI) {
    throw new Error('DATABASE_URI is not defined in the enviroment virables');
}

export const pool = new Pool({

    connectionString: process.env.DATABASE_URI,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.connect()
.then(client => {
    console.log('Connected to the database');
    client.release();
})
.catch(err => console.error('PostgreSQL connection error', err.stack));



