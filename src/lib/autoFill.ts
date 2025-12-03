// Auto-fill utilities for smart form completion

const STORAGE_KEYS = {
  INSTITUTION: 'robomania_institution',
  RECENT_ROLES: 'robomania_recent_roles',
}

// Save institution to localStorage
export function saveInstitution(institution: string) {
  if (!institution || typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEYS.INSTITUTION, institution)
  } catch (error) {
    console.error('Failed to save institution:', error)
  }
}

// Get saved institution
export function getSavedInstitution(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(STORAGE_KEYS.INSTITUTION)
  } catch (error) {
    console.error('Failed to get saved institution:', error)
    return null
  }
}

// Save recently used roles
export function saveRole(role: string) {
  if (!role || typeof window === 'undefined') return
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_ROLES)
    const roles = stored ? JSON.parse(stored) : []
    
    // Add role if not already in list
    if (!roles.includes(role)) {
      roles.unshift(role)
      // Keep only last 10 roles
      const updated = roles.slice(0, 10)
      localStorage.setItem(STORAGE_KEYS.RECENT_ROLES, JSON.stringify(updated))
    }
  } catch (error) {
    console.error('Failed to save role:', error)
  }
}

// Get recent roles
export function getRecentRoles(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_ROLES)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to get recent roles:', error)
    return []
  }
}

// Extract institution from email domain
export function suggestInstitutionFromEmail(email: string): string | null {
  if (!email || !email.includes('@')) return null
  
  const domain = email.split('@')[1].toLowerCase()
  
  // Common educational domains
  const institutionMap: Record<string, string> = {
    'iitd.ac.in': 'IIT Delhi',
    'iitb.ac.in': 'IIT Bombay',
    'iitkgp.ac.in': 'IIT Kharagpur',
    'iitm.ac.in': 'IIT Madras',
    'iitk.ac.in': 'IIT Kanpur',
    'iitr.ac.in': 'IIT Roorkee',
    'iitg.ac.in': 'IIT Guwahati',
    'nit.ac.in': 'NIT',
    'dtu.ac.in': 'Delhi Technological University',
    'nsut.ac.in': 'Netaji Subhas University of Technology',
    'bits-pilani.ac.in': 'BITS Pilani',
    'vit.ac.in': 'VIT',
    'manipal.edu': 'Manipal Institute of Technology',
  }
  
  // Check for exact matches
  if (institutionMap[domain]) {
    return institutionMap[domain]
  }
  
  // Check for partial matches (e.g., student.iitd.ac.in)
  for (const [key, value] of Object.entries(institutionMap)) {
    if (domain.includes(key)) {
      return value
    }
  }
  
  return null
}

// Pre-fill form data from session and localStorage
export function getAutoFillData(session: any) {
  const savedInstitution = getSavedInstitution()
  const recentRoles = getRecentRoles()
  
  const data: any = {}
  
  if (session?.user?.email) {
    data.leaderEmail = session.user.email
    
    // Suggest institution from email
    const suggestedInstitution = suggestInstitutionFromEmail(session.user.email)
    if (suggestedInstitution && !savedInstitution) {
      data.institution = suggestedInstitution
    } else if (savedInstitution) {
      data.institution = savedInstitution
    }
  }
  
  if (session?.user?.name) {
    data.leaderName = session.user.name
  }
  
  return {
    ...data,
    recentRoles,
  }
}

// Format suggestion text
export function formatSuggestion(text: string, type: 'institution' | 'role'): string {
  if (type === 'institution') {
    return `💡 Recently used: ${text}`
  }
  return text
}
