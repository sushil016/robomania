-- Force reload Supabase PostgREST schema cache
-- This fixes "Could not find the 'team_id' column of 'bots' in the schema cache" error

-- Step 1: Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Step 2: Verify bots table structure
DO $$
DECLARE
  column_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO column_count
  FROM information_schema.columns
  WHERE table_schema = 'public' 
    AND table_name = 'bots'
    AND column_name = 'team_id';
    
  IF column_count > 0 THEN
    RAISE NOTICE '✅ bots.team_id column exists in database';
  ELSE
    RAISE EXCEPTION '❌ bots.team_id column NOT FOUND - run migration 004 first!';
  END IF;
END $$;

-- Step 3: Grant permissions to ensure API access
GRANT ALL ON public.bots TO authenticated;
GRANT ALL ON public.bots TO anon;

-- Step 4: Show bots table structure
DO $$
DECLARE
  col RECORD;
BEGIN
  RAISE NOTICE '📋 Bots table columns:';
  FOR col IN 
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bots'
    ORDER BY ordinal_position
  LOOP
    RAISE NOTICE '  - %: % (nullable: %)', col.column_name, col.data_type, col.is_nullable;
  END LOOP;
END $$;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Schema cache reload requested!';
  RAISE NOTICE 'If issue persists, restart Supabase project in dashboard.';
END $$;
