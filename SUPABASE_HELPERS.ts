// Helper utilities for Supabase migration
// Quick reference for converting Prisma queries to Supabase

/*
================================================================================
COMMON PRISMA TO SUPABASE CONVERSIONS
================================================================================

1. FIND UNIQUE
--------------
Prisma:
  const user = await prisma.user.findUnique({
    where: { email: 'user@email.com' }
  })

Supabase:
  const { data: user, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('email', 'user@email.com')
    .single()

2. FIND MANY
------------
Prisma:
  const teams = await prisma.team.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' }
  })

Supabase:
  const { data: teams, error } = await supabaseAdmin
    .from('teams')
    .select('*')
    .eq('status', 'APPROVED')
    .order('created_at', { ascending: false })

3. FIND FIRST
-------------
Prisma:
  const team = await prisma.team.findFirst({
    where: { userEmail: email }
  })

Supabase:
  const { data: team, error } = await supabaseAdmin
    .from('teams')
    .select('*')
    .eq('user_email', email)
    .limit(1)
    .single()

4. CREATE
---------
Prisma:
  const team = await prisma.team.create({
    data: {
      teamName: 'Team A',
      institution: 'University'
    }
  })

Supabase:
  const { data: team, error } = await supabaseAdmin
    .from('teams')
    .insert({
      team_name: 'Team A',
      institution: 'University'
    })
    .select()
    .single()

5. UPDATE
---------
Prisma:
  const team = await prisma.team.update({
    where: { id: teamId },
    data: { status: 'APPROVED' }
  })

Supabase:
  const { data: team, error } = await supabaseAdmin
    .from('teams')
    .update({ status: 'APPROVED' })
    .eq('id', teamId)
    .select()
    .single()

6. DELETE
---------
Prisma:
  await prisma.team.delete({
    where: { id: teamId }
  })

Supabase:
  const { error } = await supabaseAdmin
    .from('teams')
    .delete()
    .eq('id', teamId)

7. COUNT
--------
Prisma:
  const count = await prisma.team.count()

Supabase:
  const { count, error } = await supabaseAdmin
    .from('teams')
    .select('*', { count: 'exact', head: true })

8. INCLUDE/JOIN (Relations)
----------------------------
Prisma:
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true }
  })

Supabase:
  const { data: team, error } = await supabaseAdmin
    .from('teams')
    .select(`
      *,
      team_members (*)
    `)
    .eq('id', teamId)
    .single()

9. GROUP BY / AGGREGATE
------------------------
Prisma:
  const stats = await prisma.team.groupBy({
    by: ['status'],
    _count: true
  })

Supabase:
  // Use RPC functions or manual aggregation
  const { data, error } = await supabaseAdmin
    .rpc('get_team_stats_by_status')

10. TRANSACTIONS
----------------
Prisma:
  await prisma.$transaction([
    prisma.team.create({ data: teamData }),
    prisma.teamMember.createMany({ data: membersData })
  ])

Supabase:
  // Use database functions or multiple queries
  // Supabase handles transactions at DB level via RLS

================================================================================
NAMING CONVENTIONS
================================================================================

Prisma (camelCase):          →  Supabase (snake_case):
- teamName                   →  team_name
- contactEmail               →  contact_email
- leaderPhone                →  leader_phone
- robotWeight                →  robot_weight
- paymentStatus              →  payment_status
- createdAt                  →  created_at
- updatedAt                  →  updated_at
- userEmail                  →  user_email

Table Names:
- Team                       →  teams
- TeamMember                 →  team_members
- Contact                    →  contacts
- Newsletter                 →  newsletter
- Admin                      →  admins
- User                       →  profiles (Supabase auth.users extended)

================================================================================
ERROR HANDLING
================================================================================

Always check for errors:

const { data, error } = await supabaseAdmin.from('teams').select('*')

if (error) {
  // PGRST116 = No rows found (not necessarily an error)
  if (error.code === 'PGRST116') {
    // Handle not found case
  } else {
    // Handle actual error
    console.error('Database error:', error)
    throw error
  }
}

================================================================================
RLS (Row Level Security)
================================================================================

- Use `supabaseAdmin` for admin operations (bypasses RLS)
- Use `supabase` for user operations (respects RLS policies)
- Check RLS policies in Supabase dashboard if queries fail

================================================================================
COMMON FILTERS
================================================================================

.eq('column', value)              // Equal
.neq('column', value)             // Not equal
.gt('column', value)              // Greater than
.lt('column', value)              // Less than
.gte('column', value)             // Greater than or equal
.lte('column', value)             // Less than or equal
.like('column', '%pattern%')      // Pattern matching
.ilike('column', '%pattern%')     // Case-insensitive pattern
.in('column', [val1, val2])       // In array
.is('column', null)               // Is null
.not('column', 'eq', value)       // Not equal (alternative)

================================================================================
ORDERING & PAGINATION
================================================================================

.order('column', { ascending: false })
.limit(10)
.range(0, 9)                      // First 10 rows
.range(10, 19)                    // Next 10 rows

*/

export {}
