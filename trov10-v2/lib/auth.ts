import { createClient } from '@/lib/supabase/client'

export interface UserProfile {
  id: string
  email: string
  name?: string
  phone?: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TOUR_OPERATOR' | 'TRAVEL_AGENT'
  profile: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  profile: UserProfile | null
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = createClient()
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session?.user) {
      return null
    }

    // Get user profile from users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      // Return basic user info if profile fetch fails
      return {
        id: session.user.id,
        email: session.user.email || '',
        profile: null
      }
    }

    return {
      id: session.user.id,
      email: session.user.email || '',
      profile: profile as UserProfile
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
}

export function getUserDisplayName(user: AuthUser | null): string {
  if (!user) return 'Guest'
  if (user.profile?.name) return user.profile.name
  if (user.email) return user.email.split('@')[0]
  return 'User'
}

export function getUserInitials(user: AuthUser | null): string {
  const name = getUserDisplayName(user)
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getUserRole(user: AuthUser | null): string {
  if (!user?.profile?.role) return 'guest'
  return user.profile.role
}

export function isTourOperator(user: AuthUser | null): boolean {
  return getUserRole(user) === 'TOUR_OPERATOR'
}

export function isTravelAgent(user: AuthUser | null): boolean {
  return getUserRole(user) === 'TRAVEL_AGENT'
}

export function isAdmin(user: AuthUser | null): boolean {
  return getUserRole(user) === 'ADMIN'
}

export function isSuperAdmin(user: AuthUser | null): boolean {
  return getUserRole(user) === 'SUPER_ADMIN'
}

export function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Admin'
    case 'ADMIN':
      return 'Admin'
    case 'TOUR_OPERATOR':
      return 'Tour Operator'
    case 'TRAVEL_AGENT':
      return 'Travel Agent'
    default:
      return 'User'
  }
}
