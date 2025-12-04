-- Migration: Add comment_id field to notifications table
-- Run this SQL to update your existing database

-- Add comment_id column (nullable, since reactions and posts don't have comments)
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS comment_id INTEGER REFERENCES post_comments(comment_id);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_notifications_comment_id ON notifications(comment_id);

-- Verify the change
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'notifications'
AND column_name = 'comment_id';

