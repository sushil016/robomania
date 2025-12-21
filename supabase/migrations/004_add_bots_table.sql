-- Create bots table to store robot specifications
-- This allows teams to have multiple bots and reuse them across competitions

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bots_team_id ON public.bots(team_id);
CREATE INDEX IF NOT EXISTS idx_bots_bot_name ON public.bots(bot_name);

-- Enable RLS
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view bots from their team" ON public.bots;
DROP POLICY IF EXISTS "Service role can insert bots" ON public.bots;
DROP POLICY IF EXISTS "Service role can update bots" ON public.bots;
DROP POLICY IF EXISTS "Service role can delete bots" ON public.bots;

-- RLS Policies
CREATE POLICY "Users can view bots from their team" ON public.bots
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert bots" ON public.bots
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update bots" ON public.bots
  FOR UPDATE USING (true);

CREATE POLICY "Service role can delete bots" ON public.bots
  FOR DELETE USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_bots_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_bots_updated_at ON public.bots;
CREATE TRIGGER update_bots_updated_at
    BEFORE UPDATE ON public.bots
    FOR EACH ROW
    EXECUTE FUNCTION update_bots_updated_at();

-- Step 2: Update competition_registrations table to add bot_id reference
ALTER TABLE public.competition_registrations 
ADD COLUMN IF NOT EXISTS bot_id UUID;

-- Create index for bot_id
CREATE INDEX IF NOT EXISTS idx_comp_reg_bot_id ON public.competition_registrations(bot_id);

-- Step 3: Safely rename columns if they exist
DO $$ 
BEGIN
  -- Rename competition to competition_type if column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'competition_registrations' 
    AND column_name = 'competition'
  ) THEN
    ALTER TABLE public.competition_registrations 
    RENAME COLUMN competition TO competition_type;
  END IF;

  -- Rename status to registration_status if column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'competition_registrations' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.competition_registrations 
    RENAME COLUMN status TO registration_status;
  END IF;
END $$;

-- Step 4: Remove constraints
ALTER TABLE public.competition_registrations 
DROP CONSTRAINT IF EXISTS unique_team_competition;

-- Step 5: Add foreign key constraint to bots table (do this after table is created)
DO $$
BEGIN
  -- Add foreign key to teams table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'bots_team_id_fkey'
  ) THEN
    ALTER TABLE public.bots 
    ADD CONSTRAINT bots_team_id_fkey 
    FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key from competition_registrations to bots
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'competition_registrations_bot_id_fkey'
  ) THEN
    ALTER TABLE public.competition_registrations 
    ADD CONSTRAINT competition_registrations_bot_id_fkey 
    FOREIGN KEY (bot_id) REFERENCES public.bots(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add comments
COMMENT ON TABLE public.bots IS 'Stores robot specifications that can be reused across competitions';
COMMENT ON COLUMN public.bots.team_id IS 'Reference to the team that owns this bot';
COMMENT ON COLUMN public.bots.is_weapon_bot IS 'Indicates if this bot has an active weapon system';
COMMENT ON COLUMN public.competition_registrations.bot_id IS 'Reference to the bot used in this competition entry';
