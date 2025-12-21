-- Run this FIRST to check your existing database schema
-- Copy the output and share it so we can create the correct migration

-- Check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check columns in competition_registrations table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'competition_registrations'
ORDER BY ordinal_position;

-- Check if teams table exists and its columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'teams'
ORDER BY ordinal_position;

-- Check existing constraints
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name IN ('competition_registrations', 'teams', 'bots')
ORDER BY tc.table_name, tc.constraint_type;
