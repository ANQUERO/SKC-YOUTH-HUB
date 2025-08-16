--Signup SK Official
CREATE OR REPLACE FUNCTION signup_official(
    p_email VARCHAR,
    p_password TEXT,
    p_official_position VARCHAR,
    p_role VARCHAR,
    p_first_name VARCHAR,
    p_middle_name VARCHAR,
    p_last_name VARCHAR,
    p_suffix VARCHAR,
    p_contact_number VARCHAR,
    p_gender VARCHAR,
    p_age INTEGER
)
RETURNS TABLE (
    official_id INT,
    email VARCHAR,
    official_position VARCHAR,
    role VARCHAR
) AS $$
DECLARE
v_official_id INT;
BEGIN 
   IF EXISTS (SELECT 1 FROM sk_official o WHERE o.email = p_email) THEN
        RAISE EXCEPTION 'Email already exists!';
    END IF;
INSERT INTO sk_official (email, password, official_position, role)
VALUES (p_email, p_password, p_official_position , p_role)
RETURNING sk_official.official_id, 
          sk_official.email , 
          sk_official.official_position, 
          sk_official.role
INTO v_official_id, email, official_position, role;
INSERT INTO sk_official_name(
    official_id, first_name, middle_name, last_name, suffix
)
VALUES(
    v_official_id, p_first_name, NULLIF(p_middle_name, ''), p_last_name, NULLIF(p_suffix, '')
);
INSERT INTO sk_official_info (
        official_id, contact_number, gender, age
    ) VALUES (
        v_official_id, NULLIF(p_contact_number, ''), NULLIF(p_gender, ''), p_age
    );
RETURN QUERY
SELECT v_official_id, email, official_position, role;
 END;
$$ LANGUAGE plpgsql;    

--Fetch SK Officials
CREATE OR REPLACE FUNCTION fetch_sk_officials()
RETURNS TABLE (
    official_id INT,
    email VARCHAR,
    official_position VARCHAR,
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
        a.official_id,
        a.email,
        a.official_position,
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
FROM sk_official a
LEFT JOIN sk_official_name n ON a.official_id = n.official_id
LEFT JOIN sk_official_info i ON a.official_id = i.official_id
LEFT JOIN sk_official_avatar av ON a.official_id = av.official_id
WHERE a.deleted_at IS NULL;
END;
$$;

--Fetch specific SK Official
CREATE OR REPLACE FUNCTION fetch_sk_official(p_official_id INT)
RETURNS TABLE (
    official_id INT,
    email VARCHAR,
    official_position VARCHAR,
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
        a.official_id,
        a.email,
        a.official_position,
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
FROM sk_official a
LEFT JOIN sk_official_name n ON a.official_id = n.official_id
LEFT JOIN sk_official_info i ON a.official_id = i.official_id
LEFT JOIN sk_official_avatar av ON a.official_id = av.official_id
WHERE a.deleted_at IS NULL 
AND a.official_id = p_official_id;
END;
$$;

--Update SK Official






