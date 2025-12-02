-- Add competitions table to track registrations per competition
-- Run this in Supabase SQL Editor

-- Create competition type enum
DO $$ BEGIN
  CREATE TYPE competition_type AS ENUM ('ROBOWARS', 'ROBORACE', 'ROBOSOCCER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create competition registrations table
CREATE TABLE IF NOT EXISTS public.competition_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT NOT NULL,
  competition competition_type NOT NULL,
  
  -- Competition specific details
  robot_name TEXT,
  robot_weight DECIMAL,
  robot_dimensions TEXT,
  weapon_type TEXT,
  
  -- Payment details
  amount DECIMAL NOT NULL,
  payment_id TEXT,
  payment_status payment_status DEFAULT 'PENDING',
  payment_date TIMESTAMPTZ,
  
  -- Status
  status registration_status DEFAULT 'PENDING',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one registration per team per competition
  CONSTRAINT unique_team_competition UNIQUE (team_id, competition)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_comp_reg_team_id ON public.competition_registrations(team_id);
CREATE INDEX IF NOT EXISTS idx_comp_reg_user_email ON public.competition_registrations(user_email);
CREATE INDEX IF NOT EXISTS idx_comp_reg_competition ON public.competition_registrations(competition);

-- Enable RLS
ALTER TABLE public.competition_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own competition registrations" ON public.competition_registrations
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert competition registrations" ON public.competition_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update competition registrations" ON public.competition_registrations
  FOR UPDATE USING (true);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS update_comp_reg_updated_at ON public.competition_registrations;
CREATE TRIGGER update_comp_reg_updated_at
    BEFORE UPDATE ON public.competition_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
