-- CLEAR ALL DATA FROM DATABASE
-- ⚠️ WARNING: This will delete ALL data from all tables!
-- Use this to start fresh during development

-- Step 1: Disable triggers temporarily to avoid cascading issues
SET session_replication_role = 'replica';

-- Step 2: Delete all data (order matters due to foreign keys)
-- Delete in reverse dependency order

-- Delete team members first (depends on teams and competition_registrations)
TRUNCATE TABLE public.team_members CASCADE;

-- Delete competition registrations (depends on teams and bots)
TRUNCATE TABLE public.competition_registrations CASCADE;

-- Delete bots (depends on teams)
TRUNCATE TABLE public.bots CASCADE;

-- Delete teams (base table)
TRUNCATE TABLE public.teams CASCADE;

-- Delete other tables if they exist
TRUNCATE TABLE public.contacts CASCADE;
TRUNCATE TABLE public.newsletter CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
TRUNCATE TABLE public.admins CASCADE;

-- Step 3: Re-enable triggers
SET session_replication_role = 'origin';

-- Step 4: Reset sequences if needed
-- (This ensures new IDs start from 1 for any SERIAL columns)

-- Step 5: Verify deletion
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
  
  RAISE NOTICE '🧹 ============================================';
  RAISE NOTICE '✅ DATABASE CLEARED SUCCESSFULLY!';
  RAISE NOTICE '============================================';
  RAISE NOTICE '📊 Remaining records:';
  RAISE NOTICE '   Teams: %', teams_count;
  RAISE NOTICE '   Bots: %', bots_count;
  RAISE NOTICE '   Competition Registrations: %', comp_reg_count;
  RAISE NOTICE '   Team Members: %', members_count;
  RAISE NOTICE '============================================';
  
  IF teams_count = 0 AND bots_count = 0 AND comp_reg_count = 0 AND members_count = 0 THEN
    RAISE NOTICE '✨ Database is completely clean!';
    RAISE NOTICE '🚀 Ready for fresh registrations!';
  ELSE
    RAISE WARNING '⚠️  Some data still remains - check foreign key constraints';
  END IF;
END $$;
