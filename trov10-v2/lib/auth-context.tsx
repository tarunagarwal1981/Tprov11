'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthUser, getCurrentUser, signOut } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
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
      await signOut()
      setUser(null)
      // Clear stored tokens
      localStorage.removeItem('sb-access-token')
      localStorage.removeItem('sb-refresh-token')
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
      // Clear stored tokens even if signOut fails
      localStorage.removeItem('sb-access-token')
      localStorage.removeItem('sb-refresh-token')
    }
  }

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    const getInitialSession = async () => {
      try {
        // Check for localStorage tokens first (fallback from direct auth)
        const storedAccessToken = localStorage.getItem('sb-access-token')
        const storedRefreshToken = localStorage.getItem('sb-refresh-token')
        
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
              localStorage.removeItem('sb-access-token')
              localStorage.removeItem('sb-refresh-token')
            } else {
              console.log('✅ Session restored from stored tokens')
            }
          } catch (restoreError) {
            console.warn('⚠️ Session restore failed:', restoreError)
            // Don't clear tokens immediately, try direct API approach
            console.log('🔄 Attempting direct API user fetch...')
            
            try {
              // Use direct API to fetch user profile
              const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?select=*&id=eq.${JSON.parse(atob(storedAccessToken.split('.')[1])).sub}`, {
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
            localStorage.removeItem('sb-access-token')
            localStorage.removeItem('sb-refresh-token')
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
          localStorage.removeItem('sb-access-token')
          localStorage.removeItem('sb-refresh-token')
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    user,
    loading,
    signOut: handleSignOut,
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
