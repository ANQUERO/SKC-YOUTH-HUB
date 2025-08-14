CREATE OR REPLACE FUNCTION getAll_sk_officials()
RETURNS TABLE (
    admin_id INT,
    email VARCHAR,
    position VARCHAR,
    role VARCHAR,
    first_name VARCHAR,
    middle_name VARCHAR,
    last_name VARCHAR,
    suffix VARCHAR,
    contact_number INT,
    gender VARCHAR,
    age INT,
    file_name VARCHAR,
    file_type VARCHAR,
    file_url TEXT
)