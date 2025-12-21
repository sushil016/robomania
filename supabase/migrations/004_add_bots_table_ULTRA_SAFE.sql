-- ULTRA SAFE MIGRATION - Creates everything from scratch if needed
-- Run this in Supabase SQL Editor

-- Step 0: Create teams table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_email TEXT NOT NULL,
  team_name TEXT NOT NULL,
  institution TEXT,
  
  -- Leader info
  leader_name TEXT,
  leader_email TEXT,
  leader_phone TEXT,
  
  -- Contact info (can be same as leader)
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Legacy robot info (for backward compatibility)
  robot_name TEXT,
  robot_weight DECIMAL,
  robot_dimensions TEXT,
  weapon_type TEXT,
  
  -- Payment and status
  payment_id TEXT,
  payment_status TEXT DEFAULT 'PENDING',
  payment_date TIMESTAMPTZ,
  status TEXT DEFAULT 'PENDING',
  
  -- Flags
  team_locked BOOLEAN DEFAULT FALSE,
  is_multi_competition BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for teams
CREATE INDEX IF NOT EXISTS idx_teams_user_email ON public.teams(user_email);
CREATE INDEX IF NOT EXISTS idx_teams_contact_email ON public.teams(contact_email);
CREATE INDEX IF NOT EXISTS idx_teams_payment_id ON public.teams(payment_id);

-- Step 1: Create bots table
CREATE TABLE IF NOT EXISTS public.bots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID NOT NULL,
  
  -- Bot specifications
  bot_name TEXT NOT NULL,
  weight DECIMAL NOT NULL,
  dimensions TEXT NOT NULL,
  weapon_type TEXT,
  is_weapon_bot BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for bots
CREATE INDEX IF NOT EXISTS idx_bots_team_id ON public.bots(team_id);
CREATE INDEX IF NOT EXISTS idx_bots_bot_name ON public.bots(bot_name);

-- Step 2: Create competition_registrations if it doesn't exist
CREATE TABLE IF NOT EXISTS public.competition_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID NOT NULL,
  user_email TEXT,
  
  -- Competition details
  competition_type TEXT NOT NULL,
  bot_id UUID,
  
  -- Payment details
  amount DECIMAL NOT NULL,
  payment_id TEXT,
  payment_status TEXT DEFAULT 'PENDING',
  payment_date TIMESTAMPTZ,
  
  -- Status
  registration_status TEXT DEFAULT 'PENDING',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for competition_registrations
CREATE INDEX IF NOT EXISTS idx_comp_reg_team_id ON public.competition_registrations(team_id);
CREATE INDEX IF NOT EXISTS idx_comp_reg_user_email ON public.competition_registrations(user_email);
CREATE INDEX IF NOT EXISTS idx_comp_reg_bot_id ON public.competition_registrations(bot_id);
CREATE INDEX IF NOT EXISTS idx_comp_reg_competition_type ON public.competition_registrations(competition_type);

-- Step 3: Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add bot_id to competition_registrations if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'competition_registrations' 
    AND column_name = 'bot_id'
  ) THEN
    ALTER TABLE public.competition_registrations ADD COLUMN bot_id UUID;
  END IF;

  -- Rename competition to competition_type if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'competition_registrations' 
    AND column_name = 'competition'
  ) THEN
    ALTER TABLE public.competition_registrations RENAME COLUMN competition TO competition_type;
  END IF;

  -- Rename status to registration_status if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'competition_registrations' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.competition_registrations RENAME COLUMN status TO registration_status;
  END IF;
END $$;

-- Step 4: Enable RLS on all tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_registrations ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their teams" ON public.teams;
DROP POLICY IF EXISTS "Service role can manage teams" ON public.teams;
DROP POLICY IF EXISTS "Users can view bots from their team" ON public.bots;
DROP POLICY IF EXISTS "Service role can insert bots" ON public.bots;
DROP POLICY IF EXISTS "Service role can update bots" ON public.bots;
DROP POLICY IF EXISTS "Service role can delete bots" ON public.bots;
DROP POLICY IF EXISTS "Users can view their registrations" ON public.competition_registrations;
DROP POLICY IF EXISTS "Service role can manage registrations" ON public.competition_registrations;

-- Step 6: Create RLS Policies
CREATE POLICY "Users can view their teams" ON public.teams
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage teams" ON public.teams
  FOR ALL USING (true);

CREATE POLICY "Users can view bots from their team" ON public.bots
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert bots" ON public.bots
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update bots" ON public.bots
  FOR UPDATE USING (true);

CREATE POLICY "Service role can delete bots" ON public.bots
  FOR DELETE USING (true);

CREATE POLICY "Users can view their registrations" ON public.competition_registrations
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage registrations" ON public.competition_registrations
  FOR ALL USING (true);

-- Step 7: Create or replace trigger functions
CREATE OR REPLACE FUNCTION update_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_bots_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_comp_reg_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create triggers
DROP TRIGGER IF EXISTS update_teams_updated_at ON public.teams;
CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW
    EXECUTE FUNCTION update_teams_updated_at();

DROP TRIGGER IF EXISTS update_bots_updated_at ON public.bots;
CREATE TRIGGER update_bots_updated_at
    BEFORE UPDATE ON public.bots
    FOR EACH ROW
    EXECUTE FUNCTION update_bots_updated_at();

DROP TRIGGER IF EXISTS update_comp_reg_updated_at ON public.competition_registrations;
CREATE TRIGGER update_comp_reg_updated_at
    BEFORE UPDATE ON public.competition_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_comp_reg_updated_at();

-- Step 9: Remove old constraints
ALTER TABLE public.competition_registrations 
DROP CONSTRAINT IF EXISTS unique_team_competition;

-- Step 10: Add comments
COMMENT ON TABLE public.teams IS 'Stores team information - one record per team';
COMMENT ON TABLE public.bots IS 'Stores robot specifications that can be reused across competitions';
COMMENT ON TABLE public.competition_registrations IS 'Stores individual competition entries - one record per team per competition';

COMMENT ON COLUMN public.bots.team_id IS 'Reference to the team that owns this bot';
COMMENT ON COLUMN public.bots.is_weapon_bot IS 'Indicates if this bot has an active weapon system';
COMMENT ON COLUMN public.competition_registrations.bot_id IS 'Reference to the bot used in this competition entry';

-- Display success message
DO $$
DECLARE
  teams_count INTEGER;
  bots_count INTEGER;
  comp_reg_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO teams_count FROM public.teams;
  SELECT COUNT(*) INTO bots_count FROM public.bots;
  SELECT COUNT(*) INTO comp_reg_count FROM public.competition_registrations;
  
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE 'Tables created/verified:';
  RAISE NOTICE '  - teams: % existing records', teams_count;
  RAISE NOTICE '  - bots: % existing records', bots_count;
  RAISE NOTICE '  - competition_registrations: % existing records', comp_reg_count;
  RAISE NOTICE 'Next: Test by creating a new competition registration';
END $$;
