-- Admin Table
CREATE TABLE sk_official_admin (
    admin_id SERIAL PRIMARY KEY,
    first_name VARCHAR(55) NOT NULL,
    last_name VARCHAR(55) NOT NULL,
    email VARCHAR(55) UNIQUE NOT NULL,
    organization VARCHAR(55) NOT NULL,
    position VARCHAR(55) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    password TEXT UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK(role IN ('super_sk_admin', 'natural_sk_admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES sk_official_admin(admin_id),
    title VARCHAR(55) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Post Reactions
CREATE TABLE post_reactions (
    reaction_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('admin', 'user')),
    user_id INTEGER NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('like', 'heart', 'wow')),
    reacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Post Comments
CREATE TABLE post_comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('admin', 'user')),
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id INTEGER REFERENCES post_comments(comment_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_edited BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP
);

-- Youth Account
CREATE TABLE sk_youth (
    youth_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
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
    suffix VARCHAR(10)
);

-- Youth Location
CREATE TABLE sk_youth_location (
    location_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    region VARCHAR(55) NOT NULL,
    province VARCHAR(55) NOT NULL,
    municipality VARCHAR(55) NOT NULL,
    barangay VARCHAR(55) NOT NULL,
    purok VARCHAR(55),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Youth Gender
CREATE TABLE sk_youth_gender (
    gender_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Youth Info
CREATE TABLE sk_youth_info (
    info_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    gender_id INTEGER REFERENCES sk_youth_gender(gender_id),
    age INT NOT NULL,
    contact VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
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
    work_status VARCHAR(55) NOT NULL
);

-- Youth Survey
CREATE TABLE sk_youth_survey (
    survey_id SERIAL PRIMARY KEY,
    youth_id INTEGER NOT NULL REFERENCES sk_youth(youth_id),
    registered_voter VARCHAR(45) NOT NULL CHECK(registered_voter IN ('yes', 'no')),
    registered_national_voter VARCHAR(45) NOT NULL CHECK(registered_national_voter IN ('yes', 'no')),
    vote_last_election VARCHAR(45) NOT NULL CHECK(vote_last_election IN ('yes', 'no'))
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
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);