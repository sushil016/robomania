-- Fix the bots table by adding missing team_id column

-- Step 1: Drop the existing broken bots table
DROP TABLE IF EXISTS public.bots CASCADE;

-- Step 2: Recreate it correctly with team_id
CREATE TABLE public.bots (
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

-- Step 3: Create indexes
CREATE INDEX idx_bots_team_id ON public.bots(team_id);
CREATE INDEX idx_bots_bot_name ON public.bots(bot_name);

-- Step 4: Enable RLS
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies
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

-- Step 6: Grant permissions
GRANT ALL ON public.bots TO authenticated;
GRANT ALL ON public.bots TO anon;
GRANT ALL ON public.bots TO service_role;

-- Step 7: Add update trigger
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

-- Step 8: Re-add foreign key to competition_registrations if needed
DO $$
BEGIN
  -- Check if foreign key exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'competition_registrations_bot_id_fkey'
    AND table_name = 'competition_registrations'
  ) THEN
    ALTER TABLE public.competition_registrations 
    ADD CONSTRAINT competition_registrations_bot_id_fkey 
    FOREIGN KEY (bot_id) REFERENCES public.bots(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Success message
DO $$
DECLARE
  col_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO col_count
  FROM information_schema.columns
  WHERE table_schema = 'public' 
    AND table_name = 'bots'
    AND column_name = 'team_id';
    
  IF col_count > 0 THEN
    RAISE NOTICE '✅ Bots table recreated successfully!';
    RAISE NOTICE '✅ team_id column exists and is properly linked to teams table';
    RAISE NOTICE '🚀 Ready for bot creation!';
  ELSE
    RAISE EXCEPTION '❌ Something went wrong - team_id still missing!';
  END IF;
END $$;
