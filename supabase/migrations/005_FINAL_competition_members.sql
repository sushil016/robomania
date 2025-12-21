-- Add competition_registration_id to team_members table
-- This allows each competition to have its own team members

-- Step 1: Add the column
ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS competition_registration_id UUID;

-- Step 2: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_team_members_comp_reg_id 
ON public.team_members(competition_registration_id);

-- Step 3: Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'team_members_comp_reg_fkey'
  ) THEN
    ALTER TABLE public.team_members 
    ADD CONSTRAINT team_members_comp_reg_fkey 
    FOREIGN KEY (competition_registration_id) 
    REFERENCES public.competition_registrations(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Step 4: Update existing team_members to link to their competition
-- This links existing members to the first competition registration for their team
DO $$
DECLARE
  team_record RECORD;
  first_comp_id UUID;
BEGIN
  FOR team_record IN 
    SELECT DISTINCT tm.team_id 
    FROM team_members tm 
    WHERE tm.competition_registration_id IS NULL
  LOOP
    SELECT id INTO first_comp_id
    FROM competition_registrations
    WHERE team_id = team_record.team_id
    ORDER BY created_at ASC
    LIMIT 1;
    
    IF first_comp_id IS NOT NULL THEN
      UPDATE team_members 
      SET competition_registration_id = first_comp_id
      WHERE team_id = team_record.team_id 
        AND competition_registration_id IS NULL;
        
      RAISE NOTICE 'Linked team members for team % to competition %', team_record.team_id, first_comp_id;
    END IF;
  END LOOP;
END $$;

COMMENT ON COLUMN public.team_members.competition_registration_id IS 'Links team members to specific competition registration - allows different members per competition';

-- Success message
DO $$
DECLARE
  members_count INTEGER;
  linked_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO members_count FROM public.team_members;
  SELECT COUNT(*) INTO linked_count FROM public.team_members WHERE competition_registration_id IS NOT NULL;
  
  RAISE NOTICE '✅ Migration completed!';
  RAISE NOTICE 'Total team members: %', members_count;
  RAISE NOTICE 'Linked to competitions: %', linked_count;
  RAISE NOTICE 'Ready for competition-specific team members!';
END $$;
