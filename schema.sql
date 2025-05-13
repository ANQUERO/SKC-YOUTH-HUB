CREATE TABLE sk_official_admin (
admin_id SERIAL NOT NULL PRIMARY KEY,
first_name VARCHAR(55) NOT NULL,
last_name VARCHAR(55) NOT NULL,
email VARCHAR(55) UNIQUE NOT NULL,
organization VARCHAR(55) NOT NULL,
position VARCHAR(55) NOT NULL,
is_active BOOLEAN DEFAULT true,
password TEXT UNIQUE NOT NULL,
role VARCHAR(50) NOT NULL CHECK(role IN ('super_sk_admin', 'natural_sk_admin')),
createdAT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES sk_official_admin(admin_id),
    title VARCHAR(55) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL -- soft delete column
);

CREATE TABLE post_reactions (
    id SERIAL PRIMARY KEY NOT NULL,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('admin', 'user')),
    user_id INTEGER NOT NULL, 
    type VARCHAR(10) NOT NULL CHECK (type IN ('like', 'heart', 'wow')),
    reacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL -- soft delete column
);

CREATE TABLE post_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('admin', 'user')),
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id INTEGER REFERENCES post_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_edited BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP DEFAULT NULL -- soft delete column
);