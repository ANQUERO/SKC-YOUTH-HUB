CREATE DATABASE skc_youth_hub;

-- Admin Table
CREATE TABLE sk_official (
    official_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    official_position VARCHAR(35),
    role VARCHAR(55) CHECK (role IN ('super_official', 'natural_official')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE sk_official_name (
    name_id SERIAL PRIMARY KEY,
    official_id INTEGER REFERENCES sk_official(official_id),
    first_name VARCHAR(55),
    middle_name VARCHAR(20),
    last_name VARCHAR(55),
    suffix VARCHAR(20)
);

CREATE TABLE sk_official_info(
    info_id SERIAL PRIMARY KEY,
    official_id INTEGER REFERENCES sk_official(official_id),
    contact_number VARCHAR(20),
    gender VARCHAR(10),
    age INTEGER
);

CREATE TABLE sk_official_avatar (
    attachment_id SERIAL PRIMARY KEY NOT NULL,
    official_id INTEGER REFERENCES sk_official(official_id),
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    file_url TEXT 
);

-- End of Admin table

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
    first_name VARCHAR(55),
    middle_name VARCHAR(55),
    last_name VARCHAR(55),
    suffix VARCHAR(10)
);

-- Youth Gender
CREATE TABLE sk_youth_gender (
    gender_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    gender VARCHAR(10)
);

-- Youth Info
CREATE TABLE sk_youth_info (
    info_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    age INTEGER,
    contact_number VARCHAR(20),
    birthday DATE
);

-- Purok
CREATE TABLE purok (
    purok_id SERIAL PRIMARY KEY,
    name VARCHAR(55) UNIQUE 
);

-- Youth Location
CREATE TABLE sk_youth_location (
    location_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    region VARCHAR(55) NOT NULL,
    province VARCHAR(55) NOT NULL, 
    municipality VARCHAR(55) NOT NULL,
    barangay VARCHAR(55) NOT NULL,
    purok_id INTEGER REFERENCES purok(purok_id)
);

-- Youth Demographics
CREATE TABLE sk_youth_demographics (
    demographics_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    civil_status VARCHAR(55),
    youth_age_gap VARCHAR(55),
    youth_classification VARCHAR(55),
    educational_background VARCHAR(55),
    work_status VARCHAR(55)
);

-- Youth Survey
CREATE TABLE sk_youth_survey (
    survey_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    registered_voter VARCHAR(45),
    registered_national_voter VARCHAR(55),
    vote_last_election VARCHAR(45)
);

-- Youth Meeting Survey
CREATE TABLE sk_youth_meeting_survey (
    meeting_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    attended BOOLEAN NOT NULL,
    times_attended INT,
    reason_not_attend TEXT
);

-- Youth Attachments
CREATE TABLE sk_youth_attachments (
    attachment_id SERIAL PRIMARY KEY NOT NULL,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL
);

-- Youth Household
CREATE TABLE sk_youth_household (
    household_id SERIAL PRIMARY KEY NOT NULL,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    household VARCHAR(55) NOT NULL
);

CREATE TABLE sk_youth_deleted (
    deleted_id SERIAL PRIMARY KEY,
    youth_id INTEGER,
    email VARCHAR(55),
    deleted_reason TEXT,
    deleted_by INTEGER, -- official_id
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---Posts table: supports image/video, description, title, and tracks posting admin
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    official_id INTEGER NOT NULL REFERENCES sk_official(official_id),
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
    user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('official', 'youth')),
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
    user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('official', 'youth')),
    user_id INTEGER NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('like', 'heart', 'wow')),
    reacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


 -- Form -- 

CREATE TABLE forms(
    form_id SERIAL PRIMARY KEY,
    official_id INT NOT NULL REFERENCES sk_official(official_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
)

CREATE TABLE replied_forms(
    replied_id SERIAL PRIMARY KEY,
    form_id INT NOT NULL REFERENCES forms(form_id),
    youth_id INT NOT NULL REFERENCES sk_youth(youth_id),
    response TEXT NOT NULL,
);
