CREATE DATABASE catarman_youth_hub;

-- Admin Table
CREATE TABLE sk_official_admin (
    admin_id SERIAL PRIMARY KEY,
    first_name VARCHAR(55) NOT NULL,
    last_name VARCHAR(55) NOT NULL,
    email VARCHAR(55) UNIQUE NOT NULL,
    position VARCHAR(55) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    password TEXT NOT NULL,
    role TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Youth Account
CREATE TABLE sk_youth (
    youth_id SERIAL PRIMARY KEY,
    email VARCHAR(55) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT TRUE,
    comment_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Youth Full Name
CREATE TABLE sk_youth_name (
    name_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    first_name VARCHAR(55) NOT NULL,
    middle_name VARCHAR(55),
    last_name VARCHAR(55) NOT NULL,
    suffix VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Youth Location
CREATE TABLE sk_youth_location (
    location_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    region VARCHAR(55) NOT NULL,
    province VARCHAR(55) NOT NULL,
    municipality VARCHAR(55) NOT NULL,
    barangay VARCHAR(55) NOT NULL,
    purok_id INTEGER REFERENCES purok(purok_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Purok
CREATE TABLE purok (
    purok_id SERIAL PRIMARY KEY,
    name VARCHAR(55) UNIQUE NOT NULL
);


-- Youth Gender
CREATE TABLE sk_youth_gender (
    gender_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    gender VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Youth Info
CREATE TABLE sk_youth_info (
    info_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    age INT NOT NULL,
    contact VARCHAR(15) NOT NULL,
    birthday DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Youth Demographics
CREATE TABLE sk_youth_demographics (
    demographics_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    civil_status VARCHAR(55) NOT NULL,
    youth_age_gap VARCHAR(55) NOT NULL,
    youth_classification VARCHAR(55) NOT NULL,
    educational_background VARCHAR(55) NOT NULL,
    work_status VARCHAR(55) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Youth Survey
CREATE TABLE sk_youth_survey (
    survey_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    registered_voter VARCHAR(45) NOT NULL CHECK(registered_voter IN ('yes', 'no')),
    registered_national_voter VARCHAR(45) NOT NULL CHECK(registered_national_voter IN ('yes', 'no')),
    vote_last_election VARCHAR(45) NOT NULL CHECK(vote_last_election IN ('yes', 'no')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Youth Meeting Survey
CREATE TABLE sk_youth_meeting_survey (
    meeting_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    attended BOOLEAN NOT NULL,
    times_attended INT,
    reason_not_attend TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Youth Attachments
CREATE TABLE sk_youth_attachments (
    attachment_id SERIAL PRIMARY KEY NOT NULL,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Youth House Hold
CREATE TABLE sk_youth_household (
    household_id SERIAL PRIMARY KEY NOT NULL,
	youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    household VARCHAR(55) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);



INSERT INTO purok (name)
VALUES 
('Purok 1'),
('Purok 2'),
('Purok 3'),
('Purok 4'),
('Purok 5'),
('Purok 6');


ALTER TABLE sk_official_admin
    DROP CONSTRAINT sk_official_admin_role_check,
    ALTER COLUMN role TYPE TEXT[] USING ARRAY[role]::TEXT[];

ALTER TABLE sk_official_admin
ADD COLUMN comment_at BOOLEAN DEFAULT TRUE;


CREATE TABLE sk_youth_deleted (
    deleted_id SERIAL PRIMARY KEY,
    youth_id INTEGER,
    email VARCHAR(55),
    deleted_reason TEXT,
    deleted_by INTEGER, -- admin_id
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE sk_youth_deleted
ADD CONSTRAINT fk_deleted_by_admin
FOREIGN KEY (deleted_by) REFERENCES sk_official_admin(admin_id);


---Posts table: supports image/video, description, title, and tracks posting admin
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES sk_official_admin(admin_id),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    media_type VARCHAR(10) CHECK (media_type IN ('image', 'video')),
    media_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post Comments: admin and youth can comment
CREATE TABLE post_comments (
    comment_id SERIAL PRIMARY KEY,
    parent_comment_id INTEGER REFERENCES post_comments(comment_id) ,
    post_id INTEGER NOT NULL REFERENCES posts(post_id) ,
    user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('admin', 'youth')),
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post Reactions: admin and youth can react to posts
CREATE TABLE post_reactions (
    reaction_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(post_id) ,
    user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('admin', 'youth')),
    user_id INTEGER NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('like', 'heart', 'wow')),
    reacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




--Triggering Event or Stored procedure

CREATE OR REPLACE FUNCTION validate_user_for_post_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Case 1: Youth
    IF NEW.user_type = 'youth' THEN
        IF NOT EXISTS (
            SELECT 1 FROM sk_youth WHERE youth_id = NEW.user_id
        ) THEN
            RAISE EXCEPTION 'Invalid youth ID: %', NEW.user_id;
        END IF;

    -- Case 2: Admins (super or natural)
    ELSIF NEW.user_type IN ('super_sk_admin', 'natural_sk_admin') THEN
        IF NOT EXISTS (
            SELECT 1 FROM sk_official_admin
            WHERE admin_id = NEW.user_id AND role = NEW.user_type
        ) THEN
            RAISE EXCEPTION 'Invalid admin ID % for role %', NEW.user_id, NEW.user_type;
        END IF;

    -- Invalid user_type fallback
    ELSE
        RAISE EXCEPTION 'Invalid user_type: %', NEW.user_type;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for post_comments
CREATE TRIGGER trigger_validate_user_post_comments
BEFORE INSERT ON post_comments
FOR EACH ROW
EXECUTE FUNCTION validate_user_for_post_activity();

-- Trigger for post_reactions
CREATE TRIGGER trigger_validate_user_post_reactions
BEFORE INSERT ON post_reactions
FOR EACH ROW
EXECUTE FUNCTION validate_user_for_post_activity();

