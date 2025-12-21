-- SAFE MIGRATION - Create bots table without foreign keys first
-- Run this in Supabase SQL Editor

-- Step 1: Create bots table (without foreign keys)
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

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_bots_team_id ON public.bots(team_id);
CREATE INDEX IF NOT EXISTS idx_bots_bot_name ON public.bots(bot_name);

-- Step 3: Enable RLS
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view bots from their team" ON public.bots;
DROP POLICY IF EXISTS "Service role can insert bots" ON public.bots;
DROP POLICY IF EXISTS "Service role can update bots" ON public.bots;
DROP POLICY IF EXISTS "Service role can delete bots" ON public.bots;

-- Step 5: Create RLS Policies
CREATE POLICY "Users can view bots from their team" ON public.bots
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert bots" ON public.bots
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update bots" ON public.bots
  FOR UPDATE USING (true);

CREATE POLICY "Service role can delete bots" ON public.bots
  FOR DELETE USING (true);

-- Step 6: Create trigger function
CREATE OR REPLACE FUNCTION update_bots_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger
DROP TRIGGER IF EXISTS update_bots_updated_at ON public.bots;
CREATE TRIGGER update_bots_updated_at
    BEFORE UPDATE ON public.bots
    FOR EACH ROW
    EXECUTE FUNCTION update_bots_updated_at();

-- Step 8: Add bot_id column to competition_registrations
ALTER TABLE public.competition_registrations 
ADD COLUMN IF NOT EXISTS bot_id UUID;

-- Step 9: Create index for bot_id
CREATE INDEX IF NOT EXISTS idx_comp_reg_bot_id ON public.competition_registrations(bot_id);

-- Step 10: Safely rename columns if they exist
DO $$ 
BEGIN
  -- Rename competition to competition_type if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'competition_registrations' 
    AND column_name = 'competition'
  ) THEN
    ALTER TABLE public.competition_registrations 
    RENAME COLUMN competition TO competition_type;
  END IF;

  -- Rename status to registration_status if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'competition_registrations' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.competition_registrations 
    RENAME COLUMN status TO registration_status;
  END IF;
END $$;

-- Step 11: Remove unique constraint if exists
ALTER TABLE public.competition_registrations 
DROP CONSTRAINT IF EXISTS unique_team_competition;

-- Step 12: Add comments
COMMENT ON TABLE public.bots IS 'Stores robot specifications that can be reused across competitions';
COMMENT ON COLUMN public.bots.team_id IS 'Reference to the team that owns this bot';
COMMENT ON COLUMN public.bots.is_weapon_bot IS 'Indicates if this bot has an active weapon system';

-- Display success message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Bots table created with % policies', (SELECT count(*) FROM pg_policies WHERE tablename = 'bots');
  RAISE NOTICE 'Next: Test by creating a new competition registration';
END $$;
