-- CREATE BOTS TABLE - Simple and clean
-- This creates the bots table that's missing from your database

-- Step 1: Create bots table
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

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_bots_team_id ON public.bots(team_id);
CREATE INDEX IF NOT EXISTS idx_bots_bot_name ON public.bots(bot_name);

-- Step 3: Enable RLS
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
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

DROP POLICY IF EXISTS "Service role can do anything" ON public.bots;
CREATE POLICY "Service role can do anything" 
ON public.bots FOR ALL 
USING (true);

-- Step 5: Grant permissions
GRANT ALL ON public.bots TO authenticated;
GRANT ALL ON public.bots TO anon;
GRANT ALL ON public.bots TO service_role;

-- Step 6: Add updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
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
  EXECUTE FUNCTION public.update_updated_at_column();

-- Success message
DO $$
DECLARE
  bot_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO bot_count FROM public.bots;
  
  RAISE NOTICE '✅ Bots table created successfully!';
  RAISE NOTICE 'Current bots in table: %', bot_count;
  RAISE NOTICE 'Ready to store competition-specific bots!';
END $$;
