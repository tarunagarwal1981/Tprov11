'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthUser, getCurrentUser, signOut, signInWithPassword } from '@/lib/auth'
import { saveTokens, getTokens, clearTokens, decodeJwt } from '@/lib/token-storage'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<boolean>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    }
  }

  const handleSignOut = async () => {
    try {
      console.log('🚪 Starting sign out process...')
      setIsSigningOut(true)
      
      // Clear user state immediately
      setUser(null)
      
      // Clear stored tokens first
      clearTokens()
      console.log('🧹 Cleared localStorage tokens')
      
      // Try Supabase signout (but don't wait for it)
      try { await signOut() } catch (_) {}
      
      // Force redirect to login
      router.push('/auth/login')
      console.log('✅ Sign out completed successfully')
      
    } catch (error) {
      console.error('❌ Error during sign out:', error)
      // Force clear user state even if signOut fails
      setUser(null)
      clearTokens()
      router.push('/auth/login')
    } finally {
      setIsSigningOut(false)
    }
  }

  const signIn = async (email: string, password: string): Promise<boolean> => {
    const result = await signInWithPassword(email, password)
    if (!result.ok) return false
    await refreshUser()
    return true
  }

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    const getInitialSession = async () => {
      try {
        // Skip session restoration if user is signing out or on login page
        if (isSigningOut || window.location.pathname === '/auth/login') {
          console.log('🚪 Skipping session restoration - user is signing out or on login page')
          setLoading(false)
          return
        }
        
        // Check for localStorage tokens first (fallback from direct auth)
        const tokens = getTokens()
        const storedAccessToken = tokens?.accessToken
        const storedRefreshToken = tokens?.refreshToken
        
        if (storedAccessToken && storedRefreshToken) {
          console.log('🔄 Found stored tokens, attempting to restore session...')
          
          // Try to restore session with timeout
          try {
            const sessionPromise = supabase.auth.setSession({
              access_token: storedAccessToken,
              refresh_token: storedRefreshToken
            })
            
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Session restore timeout')), 2000)
            )
            
            const { error } = await Promise.race([sessionPromise, timeoutPromise]) as any
            
            if (error) {
              console.warn('⚠️ Could not restore session from stored tokens:', error)
              // Clear invalid tokens
              clearTokens()
            } else {
              console.log('✅ Session restored from stored tokens')
            }
          } catch (restoreError) {
            console.warn('⚠️ Session restore failed:', restoreError)
            // Don't clear tokens immediately, try direct API approach
            console.log('🔄 Attempting direct API user fetch...')
            
            try {
              // Use direct API to fetch user profile
              const payload = decodeJwt(storedAccessToken)
              const userId = payload?.sub
              const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?select=*&id=eq.${userId}`, {
                headers: {
                  'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                  'Authorization': `Bearer ${storedAccessToken}`,
                  'Content-Type': 'application/json'
                }
              })
              
              if (profileResponse.ok) {
                const profileData = await profileResponse.json()
                if (profileData && profileData.length > 0) {
                  console.log('✅ Direct API user fetch successful')
                  const userProfile = profileData[0]
                  const user = {
                    id: userProfile.id,
                    email: userProfile.email,
                    profile: userProfile
                  }
                  setUser(user)
                  setLoading(false)
                  return
                }
              }
            } catch (directApiError) {
              console.warn('⚠️ Direct API user fetch failed:', directApiError)
            }
            
            // If all else fails, clear tokens
            clearTokens()
          }
        }
        
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error getting initial session:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const currentUser = await getCurrentUser()
          setUser(currentUser)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          // Clear stored tokens on sign out
          clearTokens()
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [isSigningOut])

  // Auto-redirect from login when user becomes authenticated
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (loading) return
    if (!user) return
    if (!window.location.pathname.startsWith('/auth')) return

    const role = user.profile?.role
    if (role === 'TOUR_OPERATOR') {
      router.push('/operator/dashboard')
    } else if (role === 'TRAVEL_AGENT') {
      router.push('/agent/dashboard')
    } else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      router.push('/admin/dashboard')
    } else {
      router.push('/')
    }
  }, [user, loading, router])

  const value = {
    user,
    loading,
    signOut: handleSignOut,
    signIn,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
