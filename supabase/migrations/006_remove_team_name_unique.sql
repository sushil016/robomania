-- Remove UNIQUE constraint from team_name
-- Teams can have the same name, but each user can only have one team (user_email is unique)

-- Step 1: Drop the unique constraint on team_name
ALTER TABLE public.teams 
DROP CONSTRAINT IF EXISTS teams_team_name_key;

-- Step 2: Ensure user_email has a unique constraint instead
-- This ensures one team per user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'teams_user_email_key'
    AND table_name = 'teams'
  ) THEN
    ALTER TABLE public.teams 
    ADD CONSTRAINT teams_user_email_key UNIQUE (user_email);
  END IF;
END $$;

-- Step 3: Add index for faster lookups on contact_email if not exists
CREATE INDEX IF NOT EXISTS idx_teams_contact_email 
ON public.teams(contact_email);

-- Add comments
COMMENT ON COLUMN public.teams.team_name IS 'Team name - does not need to be unique, multiple teams can have same name';
COMMENT ON COLUMN public.teams.user_email IS 'User email - must be unique, each user can have only one team';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed!';
  RAISE NOTICE 'Removed UNIQUE constraint from team_name';
  RAISE NOTICE 'Team names can now be reused across different users';
  RAISE NOTICE 'Each user still limited to one team (via user_email)';
END $$;
