-- Fix for profiles table to work with NextAuth instead of Supabase Auth
-- Run this in Supabase SQL Editor

-- Drop existing table and recreate
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table with auto-generated UUID
CREATE TABLE public.profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create more permissive RLS policies for NextAuth
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update profiles" ON public.profiles
  FOR UPDATE USING (true);

CREATE POLICY "Service role can delete profiles" ON public.profiles
  FOR DELETE USING (true);

-- Update teams table to use email instead of user_id for foreign key
ALTER TABLE public.teams DROP CONSTRAINT IF EXISTS teams_user_id_fkey;
ALTER TABLE public.teams DROP COLUMN IF EXISTS user_id;

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
