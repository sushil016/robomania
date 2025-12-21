-- Migration to support competition-specific team members
-- This allows different team members for each competition registration

-- Step 1: Add competition_registration_id to team_members table
ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS competition_registration_id UUID;

-- Step 2: Create index for the new column
CREATE INDEX IF NOT EXISTS idx_team_members_comp_reg_id 
ON public.team_members(competition_registration_id);

-- Step 3: Add foreign key constraint (optional - makes lookups easier)
-- We'll skip this to avoid errors if competition_registrations table structure is different

-- Step 4: Update existing team_members to link to first competition registration (if any)
-- This is optional - only run if you want to migrate existing data
DO $$
DECLARE
  team_record RECORD;
  first_comp_id UUID;
BEGIN
  -- For each team that has members but no competition_registration_id set
  FOR team_record IN 
    SELECT DISTINCT tm.team_id 
    FROM team_members tm 
    WHERE tm.competition_registration_id IS NULL
  LOOP
    -- Get the first competition registration for this team
    SELECT id INTO first_comp_id
    FROM competition_registrations
    WHERE team_id = team_record.team_id
    ORDER BY created_at ASC
    LIMIT 1;
    
    -- Update team members to link to this competition
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
