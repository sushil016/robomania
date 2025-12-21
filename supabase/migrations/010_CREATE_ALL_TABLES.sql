-- CREATE ALL TABLES FROM SCRATCH
-- This will create teams, bots, competition_registrations, and team_members tables

-- ============================================
-- STEP 1: CREATE TEAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Add unique constraint on user_email (one team per user)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'teams_user_email_key'
    AND table_name = 'teams'
  ) THEN
    ALTER TABLE public.teams ADD CONSTRAINT teams_user_email_key UNIQUE (user_email);
  END IF;
END $$;

-- Create indexes for teams
CREATE INDEX IF NOT EXISTS idx_teams_user_email ON public.teams(user_email);
CREATE INDEX IF NOT EXISTS idx_teams_contact_email ON public.teams(contact_email);
CREATE INDEX IF NOT EXISTS idx_teams_payment_id ON public.teams(payment_id);
CREATE INDEX IF NOT EXISTS idx_teams_team_name ON public.teams(team_name);

-- ============================================
-- STEP 2: CREATE BOTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  
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

-- ============================================
-- STEP 3: CREATE COMPETITION_REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.competition_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_email TEXT,
  
  -- Competition details
  competition_type TEXT NOT NULL,
  bot_id UUID REFERENCES public.bots(id) ON DELETE SET NULL,
  
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
CREATE INDEX IF NOT EXISTS idx_comp_reg_payment_id ON public.competition_registrations(payment_id);

-- ============================================
-- STEP 4: CREATE TEAM_MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  competition_registration_id UUID REFERENCES public.competition_registrations(id) ON DELETE CASCADE,
  
  -- Member info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'Member',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for team_members
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON public.team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_comp_reg_id ON public.team_members(competition_registration_id);

-- ============================================
-- STEP 5: ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 6: CREATE RLS POLICIES FOR TEAMS
-- ============================================
DROP POLICY IF EXISTS "Users can view their own team" ON public.teams;
CREATE POLICY "Users can view their own team" 
ON public.teams FOR SELECT 
USING (user_email = auth.jwt() ->> 'email');

DROP POLICY IF EXISTS "Users can create their own team" ON public.teams;
CREATE POLICY "Users can create their own team" 
ON public.teams FOR INSERT 
WITH CHECK (user_email = auth.jwt() ->> 'email');

DROP POLICY IF EXISTS "Users can update their own team" ON public.teams;
CREATE POLICY "Users can update their own team" 
ON public.teams FOR UPDATE 
USING (user_email = auth.jwt() ->> 'email');

DROP POLICY IF EXISTS "Service role all access teams" ON public.teams;
CREATE POLICY "Service role all access teams" 
ON public.teams FOR ALL 
USING (true);

-- ============================================
-- STEP 7: CREATE RLS POLICIES FOR BOTS
-- ============================================
DROP POLICY IF EXISTS "Users can view their own bots" ON public.bots;
CREATE POLICY "Users can view their own bots" 
ON public.bots FOR SELECT 
USING (
  team_id IN (
    SELECT id FROM public.teams 
    WHERE user_email = auth.jwt() ->> 'email'
  )
);

DROP POLICY IF EXISTS "Users can create bots for their teams" ON public.bots;
CREATE POLICY "Users can create bots for their teams" 
ON public.bots FOR INSERT 
WITH CHECK (
  team_id IN (
    SELECT id FROM public.teams 
    WHERE user_email = auth.jwt() ->> 'email'
  )
);

DROP POLICY IF EXISTS "Service role all access bots" ON public.bots;
CREATE POLICY "Service role all access bots" 
ON public.bots FOR ALL 
USING (true);

-- ============================================
-- STEP 8: CREATE RLS POLICIES FOR COMPETITION_REGISTRATIONS
-- ============================================
DROP POLICY IF EXISTS "Users can view their registrations" ON public.competition_registrations;
CREATE POLICY "Users can view their registrations" 
ON public.competition_registrations FOR SELECT 
USING (
  team_id IN (
    SELECT id FROM public.teams 
    WHERE user_email = auth.jwt() ->> 'email'
  )
);

DROP POLICY IF EXISTS "Service role all access comp_reg" ON public.competition_registrations;
CREATE POLICY "Service role all access comp_reg" 
ON public.competition_registrations FOR ALL 
USING (true);

-- ============================================
-- STEP 9: CREATE RLS POLICIES FOR TEAM_MEMBERS
-- ============================================
DROP POLICY IF EXISTS "Users can view their team members" ON public.team_members;
CREATE POLICY "Users can view their team members" 
ON public.team_members FOR SELECT 
USING (
  team_id IN (
    SELECT id FROM public.teams 
    WHERE user_email = auth.jwt() ->> 'email'
  )
);

DROP POLICY IF EXISTS "Service role all access members" ON public.team_members;
CREATE POLICY "Service role all access members" 
ON public.team_members FOR ALL 
USING (true);

-- ============================================
-- STEP 10: GRANT PERMISSIONS
-- ============================================
GRANT ALL ON public.teams TO authenticated;
GRANT ALL ON public.teams TO anon;
GRANT ALL ON public.teams TO service_role;

GRANT ALL ON public.bots TO authenticated;
GRANT ALL ON public.bots TO anon;
GRANT ALL ON public.bots TO service_role;

GRANT ALL ON public.competition_registrations TO authenticated;
GRANT ALL ON public.competition_registrations TO anon;
GRANT ALL ON public.competition_registrations TO service_role;

GRANT ALL ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO anon;
GRANT ALL ON public.team_members TO service_role;

-- ============================================
-- STEP 11: CREATE UPDATE TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_teams_updated_at ON public.teams;
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bots_updated_at ON public.bots;
CREATE TRIGGER update_bots_updated_at
  BEFORE UPDATE ON public.bots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_comp_reg_updated_at ON public.competition_registrations;
CREATE TRIGGER update_comp_reg_updated_at
  BEFORE UPDATE ON public.competition_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_members_updated_at ON public.team_members;
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
DECLARE
  teams_count INTEGER;
  bots_count INTEGER;
  comp_reg_count INTEGER;
  members_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO teams_count FROM public.teams;
  SELECT COUNT(*) INTO bots_count FROM public.bots;
  SELECT COUNT(*) INTO comp_reg_count FROM public.competition_registrations;
  SELECT COUNT(*) INTO members_count FROM public.team_members;
  
  RAISE NOTICE '🎉 ============================================';
  RAISE NOTICE '✅ ALL TABLES CREATED SUCCESSFULLY!';
  RAISE NOTICE '============================================';
  RAISE NOTICE '📊 Current data:';
  RAISE NOTICE '   Teams: %', teams_count;
  RAISE NOTICE '   Bots: %', bots_count;
  RAISE NOTICE '   Competition Registrations: %', comp_reg_count;
  RAISE NOTICE '   Team Members: %', members_count;
  RAISE NOTICE '============================================';
  RAISE NOTICE '🚀 Database is ready for multi-competition registration!';
END $$;
