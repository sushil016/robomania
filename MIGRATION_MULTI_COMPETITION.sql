-- ============================================
-- MULTI-COMPETITION REGISTRATION SYSTEM
-- Migration SQL for Supabase
-- ============================================

-- 1. Create BOTS table (reusable bot profiles)
CREATE TABLE IF NOT EXISTS bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  bot_name TEXT NOT NULL,
  weight NUMERIC(5,2) NOT NULL, -- in kg
  dimensions TEXT NOT NULL, -- format: "L x W x H cm"
  weapon_type TEXT, -- optional, for combat bots
  description TEXT,
  image_url TEXT,
  is_weapon_bot BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bots_user_email ON bots(user_email);
CREATE INDEX IF NOT EXISTS idx_bots_created_at ON bots(created_at DESC);

-- 2. Create COMPETITION_REGISTRATIONS table (many-to-many)
CREATE TABLE IF NOT EXISTS competition_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  competition_type TEXT NOT NULL CHECK (competition_type IN ('ROBOWARS', 'ROBORACE', 'ROBOSOCCER')),
  bot_id UUID REFERENCES bots(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED')),
  payment_id TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  registration_status TEXT DEFAULT 'PENDING' CHECK (registration_status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, competition_type) -- One team can register once per competition
);

CREATE INDEX IF NOT EXISTS idx_comp_reg_team_id ON competition_registrations(team_id);
CREATE INDEX IF NOT EXISTS idx_comp_reg_competition ON competition_registrations(competition_type);
CREATE INDEX IF NOT EXISTS idx_comp_reg_payment_status ON competition_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_comp_reg_status ON competition_registrations(registration_status);

-- 3. Add new columns to TEAMS table (keep team info centralized)
-- Note: Keep existing robot fields for backward compatibility during migration
ALTER TABLE teams ADD COLUMN IF NOT EXISTS is_multi_competition BOOLEAN DEFAULT false;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS team_locked BOOLEAN DEFAULT false; -- Lock team name after first registration

-- 4. Create view for easy querying
CREATE OR REPLACE VIEW team_registrations_view AS
SELECT 
  t.id as team_id,
  t.team_name,
  t.institution,
  t.user_email,
  t.leader_name,
  t.leader_email,
  t.status as team_status,
  t.team_locked,
  cr.id as registration_id,
  cr.competition_type,
  cr.amount,
  cr.payment_status,
  cr.payment_id,
  cr.payment_date,
  cr.registration_status,
  b.id as bot_id,
  b.bot_name,
  b.weight as bot_weight,
  b.dimensions as bot_dimensions,
  b.weapon_type,
  b.is_weapon_bot,
  t.created_at as team_created_at,
  cr.created_at as registration_created_at
FROM teams t
LEFT JOIN competition_registrations cr ON t.id = cr.team_id
LEFT JOIN bots b ON cr.bot_id = b.id
ORDER BY t.created_at DESC, cr.created_at DESC;

-- 5. Migration function to convert existing single-competition registrations
-- Run this AFTER creating the tables to migrate existing data
CREATE OR REPLACE FUNCTION migrate_existing_teams()
RETURNS void AS $$
BEGIN
  -- Insert bots from existing team robot data
  INSERT INTO bots (user_email, bot_name, weight, dimensions, weapon_type, is_weapon_bot, created_at)
  SELECT 
    user_email,
    COALESCE(robot_name, team_name || ' Bot') as bot_name,
    COALESCE(robot_weight::numeric, 5.0) as weight,
    COALESCE(robot_dimensions, '30x30x30') as dimensions,
    weapon_type,
    CASE WHEN weapon_type IS NOT NULL AND weapon_type != '' THEN true ELSE false END as is_weapon_bot,
    created_at
  FROM teams
  WHERE robot_name IS NOT NULL 
    AND robot_name != ''
    AND id NOT IN (
      -- Avoid duplicates if already migrated
      SELECT DISTINCT team_id FROM competition_registrations
    );

  -- Insert competition registrations (assume ROBOWARS as default for existing teams)
  INSERT INTO competition_registrations (
    team_id, 
    competition_type, 
    bot_id, 
    amount, 
    payment_status, 
    payment_id, 
    payment_date,
    registration_status,
    created_at
  )
  SELECT 
    t.id as team_id,
    'ROBOWARS' as competition_type,
    b.id as bot_id,
    300 as amount, -- Default RoboWars price
    COALESCE(t.payment_status, 'PENDING') as payment_status,
    t.payment_id,
    t.payment_date,
    CASE 
      WHEN t.payment_status = 'COMPLETED' THEN 'CONFIRMED'
      ELSE COALESCE(t.status, 'PENDING')
    END as registration_status,
    t.created_at
  FROM teams t
  LEFT JOIN bots b ON b.user_email = t.user_email AND b.bot_name = COALESCE(t.robot_name, t.team_name || ' Bot')
  WHERE t.id NOT IN (
    SELECT DISTINCT team_id FROM competition_registrations
  );

  -- Mark teams as migrated
  UPDATE teams SET is_multi_competition = true, team_locked = true
  WHERE id IN (SELECT DISTINCT team_id FROM competition_registrations);
  
  RAISE NOTICE 'Migration completed successfully';
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_bots_updated_at ON bots;
CREATE TRIGGER update_bots_updated_at
  BEFORE UPDATE ON bots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comp_reg_updated_at ON competition_registrations;
CREATE TRIGGER update_comp_reg_updated_at
  BEFORE UPDATE ON competition_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSTRUCTIONS TO RUN:
-- ============================================
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Paste this entire file
-- 3. Click "Run" to create tables
-- 4. Then run: SELECT migrate_existing_teams();
-- 5. Verify: SELECT * FROM team_registrations_view;
-- ============================================

-- Sample queries for testing:
-- View all team registrations:
-- SELECT * FROM team_registrations_view WHERE team_id = 'your-team-id';

-- Get user's saved bots:
-- SELECT * FROM bots WHERE user_email = 'user@example.com' ORDER BY created_at DESC;

-- Get team's competitions:
-- SELECT competition_type, payment_status, registration_status, bot_name 
-- FROM team_registrations_view 
-- WHERE team_id = 'your-team-id';
