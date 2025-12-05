-- Add comment reactions table
CREATE TABLE IF NOT EXISTS comment_reactions (
    reaction_id SERIAL PRIMARY KEY,
    comment_id INTEGER NOT NULL REFERENCES post_comments(comment_id) ON DELETE CASCADE,
    user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('official', 'youth')),
    user_id INTEGER NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('like', 'heart', 'wow')),
    reacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comment_id, user_type, user_id)
);

