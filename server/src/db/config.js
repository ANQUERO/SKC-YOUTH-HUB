import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase 
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

//Test the connection
export const initDB = async () => {
    try {
        const { data, error } = await supabase.rpc('check_connection');

        if (error) {
            throw error;
        }

        console.log('✅ Connected to Supabase and queried successfully');
    } catch (err) {
        console.error('❌ Supabase connection error:', err.message);
        throw err;
    }
};

export default supabase;
