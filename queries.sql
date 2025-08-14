--Fetch admins
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
    contact_number VARCHAR,
    gender VARCHAR,
    age INT,
    file_name VARCHAR,
    file_type VARCHAR,
    file_url TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
 RETURN QUERY
 SELECT 
        a.admin_id,
        a.email,
        a.position,
        a.role,
        n.first_name,
        n.middle_name,
        n.last_name,
        n.suffix,
        i.contact_number,
        i.gender,
        i.age,
        av.file_name,
        av.file_type,
        av.file_url
FROM sk_official_admin a
LEFT JOIN sk_official_name n ON a.admin_id = n.admin_id
LEFT JOIN sk_official_info i ON a.admin_id = i.admin_id
LEFT JOIN sk_official_avatar av ON a.admin_id = av.admin_id
WHERE a.deleted_at IS NULL
END;
$$;

--Fetch specific admin
CREATE OR REPLACE FUNCTION getAll_sk_official(p_admin_id INT)
RETURNS TABLE (
    admin_id INT,
    email VARCHAR,
    position VARCHAR,
    role VARCHAR,
    first_name VARCHAR,
    middle_name VARCHAR,
    last_name VARCHAR,
    suffix VARCHAR,
    contact_number VARCHAR,
    gender VARCHAR,
    age INT,
    file_name VARCHAR,
    file_type VARCHAR,
    file_url TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
 RETURN QUERY
 SELECT 
        a.admin_id,
        a.email,
        a.position,
        a.role,
        n.first_name,
        n.middle_name,
        n.last_name,
        n.suffix,
        i.contact_number,
        i.gender,
        i.age,
        av.file_name,
        av.file_type,
        av.file_url
FROM sk_official_admin a
LEFT JOIN sk_official_name n ON a.admin_id = n.admin_id
LEFT JOIN sk_official_info i ON a.admin_id = i.admin_id
LEFT JOIN sk_official_avatar av ON a.admin_id = av.admin_id
WHERE a.deleted_at IS NULL AND a.admin_id = p_admin_id
END;
$$;


