-- Migration: Add 'post' notification type to notifications table
-- Run this SQL to update your existing database

-- First, drop the existing check constraint
ALTER TABLE notifications 
DROP CONSTRAINT IF EXISTS notifications_notification_type_check;

-- Add the new check constraint that includes 'post'
ALTER TABLE notifications 
ADD CONSTRAINT notifications_notification_type_check 
CHECK (notification_type IN ('reaction', 'comment', 'post'));

-- Verify the change
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'notifications'::regclass
AND conname = 'notifications_notification_type_check';

