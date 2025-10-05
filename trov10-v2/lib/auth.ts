import { createClient } from '@/lib/supabase/client'
import { saveTokens, getTokens, clearTokens, decodeJwt } from '@/lib/token-storage'

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

export interface SignInResult {
  ok: boolean
  error?: string
}

export async function signInWithPassword(email: string, password: string): Promise<SignInResult> {
  try {
    const normalizedEmail = email.trim().toLowerCase()
    // Use direct API to avoid client hangs
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: normalizedEmail, password })
    })

    if (!res.ok) {
      let bodyText = ''
      try { bodyText = await res.text() } catch (_) {}
      console.warn('Auth failed:', { status: res.status, statusText: res.statusText, bodyText })
      return { ok: false, error: `Auth failed (${res.status})` }
    }

    const data = await res.json()
    const accessToken: string = data.access_token
    const refreshToken: string = data.refresh_token

    // Store tokens for fallback flows
    saveTokens({ accessToken, refreshToken })

    // Best-effort: set session in supabase client (with timeout)
    try {
      const supabase = createClient()
      await Promise.race([
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('setSession timeout')), 2500))
      ])
    } catch (_) {
      // ignore; we have tokens stored
    }

    return { ok: true }
  } catch (e: any) {
    console.error('signInWithPassword error:', e)
    return { ok: false, error: e?.message || 'Unknown error' }
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = createClient()
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session?.user) {
      const tokens = getTokens()
      const storedAccessToken = tokens?.accessToken
      if (storedAccessToken) {
        console.log('🔄 No Supabase session, trying localStorage fallback...')
        try {
          const payload = decodeJwt(storedAccessToken)
          const userId = payload?.sub
          if (!userId) {
            clearTokens()
            return null
          }
          
          // Fetch user profile directly
          const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?select=*&id=eq.${userId}`, {
            headers: {
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
              'Authorization': `Bearer ${storedAccessToken}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            if (profileData && profileData.length > 0) {
              const userProfile = profileData[0]
              return {
                id: userProfile.id,
                email: userProfile.email,
                profile: userProfile as UserProfile
              }
            }
          }
        } catch (fallbackError) {
          console.warn('⚠️ localStorage fallback failed:', fallbackError)
          clearTokens()
        }
      }
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
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
  } catch (_) {
    // ignore
  }
  clearTokens()
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
