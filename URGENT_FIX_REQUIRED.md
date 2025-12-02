# URGENT: File Corruption Fix Required

## Problem
Multiple API route files have been corrupted with duplicate imports during the migration process. This is preventing the application from compiling.

## Affected Files
The following files have duplicate/corrupted imports:
- src/app/api/register/route.ts
- src/app/api/team-details/route.ts
- src/app/api/check-registration/route.ts
- src/app/api/verify-payment/route.ts
- src/app/api/contact/route.ts
- src/app/api/newsletter/route.ts
- src/app/api/test-db/route.ts
- src/app/api/team-details/update/route.ts
- src/app/api/admin/teams/route.ts
- src/app/api/admin/stats/route.ts
- src/app/api/admin/analytics/route.ts
- src/app/api/admin/send-update/route.ts
- src/app/api/auth/signup/route.ts
- src/app/api/auth/login/route.ts

## Recommended Solution

### Option 1: Manual Fix (Quickest for Now)
For each corrupted file, you need to:
1. Delete the file
2. Recreate it from scratch using Supabase instead of Prisma

### Option 2: Use Git (If you have uncommitted changes)
```bash
# If the migration was on a branch, reset it
git checkout main
git pull
# Then redo migration carefully
```

### Option 3: Use the Template Pattern
For each file, replace Prisma code with Supabase using this pattern:

**Replace:**
```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

**With:**
```typescript
import { supabaseAdmin } from '@/lib/supabase'
```

**Replace queries like:**
```typescript
await prisma.teams.findMany()
```

**With:**
```typescript
const { data, error } = await supabaseAdmin.from('teams').select('*')
```

## Quick Fix Script

Run this to backup and clean corrupted files:

```bash
# Backup corrupted files
mkdir -p ~/robomania_backup
cp -r src/app/api ~/robomania_backup/

# For each corrupted file, you'll need to manually recreate or restore from git
```

## Working Files (Reference These)
These files have been successfully migrated and can serve as templates:
- ✅ src/auth.ts
- ✅ src/lib/supabase.ts
- ✅ src/lib/supabase-client.ts
- ✅ src/app/api/payment/route.ts (FIXED)
- ✅ src/app/api/payment/verify/route.ts (FIXED)

## Next Steps

1. **Immediate**: Delete the `node_modules` and `.next` directories, then reinstall:
   ```bash
   rm -rf node_modules .next
   npm install
   ```

2. **Fix corrupted files**: Either restore from git or manually recreate following the patterns in SUPABASE_HELPERS.ts

3. **Test compilation**: Run `npm run dev` after each file fix

## Prevention
The corruption occurred because the file editing tool concatenated old and new content. To prevent this:
- Delete files before recreating them
- Use terminal commands for file operations
- Verify file contents after each change

## Need Help?
Refer to:
- `SUPABASE_HELPERS.ts` for query conversion patterns
- `MIGRATION_GUIDE.md` for step-by-step instructions
- Working files listed above as templates
