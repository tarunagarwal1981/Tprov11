'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, AlertCircle, Eye, EyeOff, Plane } from 'lucide-react'

export default function LoginPage() {
  console.log('🎬 LoginPage component initialized')
  console.log('🌍 Environment check:', {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'
  })
  
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 Login attempt started')
    console.log('📧 Email:', email)
    console.log('🔒 Password length:', password.length)
    
    setError('')
    setLoading(true)

    try {
      console.log('🔗 Creating Supabase client...')
      const supabase = createClient()
      console.log('✅ Supabase client created successfully')
      
      // Test network connectivity to Supabase
      console.log('🌐 Testing network connectivity...')
      try {
        const testResponse = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/', {
          method: 'HEAD',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          }
        })
        console.log('🌐 Network test result:', {
          status: testResponse.status,
          ok: testResponse.ok,
          statusText: testResponse.statusText
        })
        
        // Test auth endpoint specifically
        console.log('🔐 Testing auth endpoint...')
        const authTestResponse = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/auth/v1/token?grant_type=password', {
          method: 'POST',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'wrongpassword'
          })
        })
        
        console.log('🔐 Auth endpoint test:', {
          status: authTestResponse.status,
          ok: authTestResponse.ok,
          statusText: authTestResponse.statusText
        })
        
        if (authTestResponse.status === 400) {
          console.log('✅ Auth endpoint is working (400 = expected for wrong credentials)')
        } else if (authTestResponse.status === 200) {
          console.log('⚠️ Auth endpoint returned 200 for wrong credentials - this is unexpected')
        } else {
          console.log('❌ Auth endpoint returned unexpected status:', authTestResponse.status)
        }
        
      } catch (networkError) {
        console.warn('⚠️ Network connectivity test failed:', networkError)
      }
      
      console.log('🔐 Attempting authentication...')
      console.log('📧 Auth request details:', {
        email: email,
        passwordLength: password.length,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        timestamp: new Date().toISOString()
      })
      
      // Use direct API authentication since Supabase client is hanging
      console.log('🚀 Using direct API authentication (Supabase client workaround)...')
      try {
        const directAuthResponse = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/auth/v1/token?grant_type=password', {
          method: 'POST',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        })
        
        console.log('🚀 Direct auth result:', {
          status: directAuthResponse.status,
          ok: directAuthResponse.ok,
          statusText: directAuthResponse.statusText
        })
        
        if (directAuthResponse.ok) {
          const authData = await directAuthResponse.json()
          console.log('✅ Direct authentication successful!')
          console.log('🎫 Auth data:', authData)
          
          // Set the session in Supabase client for future requests
          console.log('🔧 Setting session in Supabase client...')
          try {
            // Create a new Supabase client instance for session setting
            const { createClient } = await import('@/lib/supabase/client')
            const freshSupabase = createClient()
            
            // Set session with a shorter timeout
            const { error: setSessionError } = await Promise.race([
              freshSupabase.auth.setSession({
                access_token: authData.access_token,
                refresh_token: authData.refresh_token
              }),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Session setting timed out after 3 seconds')), 3000)
              )
            ]) as any
            
            if (setSessionError) {
              console.warn('⚠️ Could not set session in Supabase client:', setSessionError)
              // Try alternative approach - store tokens in localStorage
              console.log('🔄 Attempting localStorage fallback...')
              localStorage.setItem('sb-access-token', authData.access_token)
              localStorage.setItem('sb-refresh-token', authData.refresh_token)
            } else {
              console.log('✅ Session set in Supabase client successfully')
            }
          } catch (sessionError) {
            console.warn('⚠️ Session setting failed or timed out:', sessionError)
            console.log('🔄 Using localStorage fallback...')
            // Store tokens in localStorage as fallback
            localStorage.setItem('sb-access-token', authData.access_token)
            localStorage.setItem('sb-refresh-token', authData.refresh_token)
          }
          
          console.log('👤 User ID from auth data:', authData.user?.id)
          
          // Get user profile to determine role
          console.log('🔍 Fetching user profile...')
          try {
            // Try direct API first since Supabase client is having issues
            console.log('🌐 Trying direct API for profile fetch...')
            const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?select=role&id=eq.${authData.user.id}`, {
              method: 'GET',
              headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Authorization': `Bearer ${authData.access_token}`,
                'Content-Type': 'application/json'
              }
            })
            
            console.log('🌐 Direct profile API result:', {
              status: profileResponse.status,
              ok: profileResponse.ok,
              statusText: profileResponse.statusText
            })
            
            let userRole = null
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json()
              console.log('📋 Direct profile data:', profileData)
              userRole = profileData[0]?.role
            } else {
              console.warn('⚠️ Direct profile fetch failed, trying Supabase client...')
              
              // Fallback to Supabase client with timeout
              const profilePromise = supabase
                .from('users')
                .select('role')
                .eq('id', authData.user.id)
                .single()
              
              const profileTimeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Profile fetch timed out after 5 seconds')), 5000)
              )
              
              const { data: profile, error: profileError } = await Promise.race([profilePromise, profileTimeoutPromise]) as any
              
              console.log('📋 Supabase profile response:', { profile, profileError })
              userRole = profile?.role
            }

            // Redirect based on role
            console.log('🎭 User role:', userRole)
            
            if (userRole === 'TOUR_OPERATOR') {
              console.log('🏢 Redirecting to operator dashboard...')
              router.push('/operator/dashboard')
            } else if (userRole === 'TRAVEL_AGENT') {
              console.log('✈️ Redirecting to agent dashboard...')
              router.push('/agent/dashboard')
            } else if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
              console.log('👑 Redirecting to admin dashboard...')
              router.push('/admin/dashboard')
            } else {
              // Default to operator dashboard for users without specific role
              console.log('🔄 No specific role found, redirecting to operator dashboard...')
              router.push('/operator/dashboard')
            }
          } catch (profileError) {
            console.error('💥 Profile fetch failed:', profileError)
            // Still redirect to operator dashboard as fallback
            console.log('🔄 Profile fetch failed, redirecting to operator dashboard as fallback...')
            router.push('/operator/dashboard')
          }
          
          return // Exit early on success
          
        } else {
          const errorData = await directAuthResponse.text()
          console.log('❌ Direct auth failed:', errorData)
          throw new Error('Invalid email or password')
        }
      } catch (directError) {
        console.error('💥 Direct auth failed:', directError)
        throw directError
      }
    } catch (err: unknown) {
      console.error('💥 Login error:', err)
      const errorMessage = (err as Error).message || 'Invalid email or password'
      console.log('📝 Setting error message:', errorMessage)
      setError(errorMessage)
    } finally {
      console.log('🏁 Login process completed')
      setLoading(false)
    }
  }

  const checkAndCreateDemoUsers = async () => {
    console.log('🔍 Checking if demo users exist...')
    try {
      const supabase = createClient()
      
      // Check if demo users exist
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('email')
        .in('email', ['operator@travelpro.com', 'agent@travelpro.com'])
      
      console.log('👥 Existing demo users:', existingUsers)
      
      if (checkError) {
        console.warn('⚠️ Could not check existing users:', checkError)
        return
      }
      
      const existingEmails = existingUsers?.map(u => u.email) || []
      const missingUsers = ['operator@travelpro.com', 'agent@travelpro.com'].filter(
        email => !existingEmails.includes(email)
      )
      
      if (missingUsers.length > 0) {
        console.log('❌ Missing demo users:', missingUsers)
        console.log('💡 Please run the demo-users.sql script in your Supabase SQL editor')
        setError(`Demo users not found. Please create them using the demo-users.sql script. Missing: ${missingUsers.join(', ')}`)
      } else {
        console.log('✅ All demo users exist!')
      }
    } catch (error) {
      console.error('💥 Error checking demo users:', error)
    }
  }

  const handleDemoLogin = async (role: 'operator' | 'agent') => {
    console.log('🎭 Demo login started for role:', role)
    
    const demoCredentials = {
      operator: {
        email: 'operator@travelpro.com',
        password: 'demo123'
      },
      agent: {
        email: 'agent@travelpro.com',
        password: 'demo123'
      }
    }

    console.log('📧 Setting demo credentials:', demoCredentials[role])
    setEmail(demoCredentials[role].email)
    setPassword(demoCredentials[role].password)
    setError('')
    
    // Check if demo users exist first
    await checkAndCreateDemoUsers()
    
    // Trigger form submit
    setTimeout(() => {
      console.log('⏰ Triggering form submit...')
      const form = document.getElementById('login-form') as HTMLFormElement
      if (form) {
        console.log('📝 Form found, dispatching submit event')
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
        form.dispatchEvent(submitEvent)
      } else {
        console.error('❌ Form not found!')
      }
    }, 100)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            backgroundColor: '#dbeafe',
            borderRadius: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <Plane size={36} style={{ color: '#2563eb' }} />
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '8px'
          }}>
            TravelPro
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280'
          }}>
            Sign in to your account
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '2px solid #e5e7eb',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '32px' }}>
            <form id="login-form" onSubmit={handleLogin}>
              {/* Error Message */}
              {error && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#fef2f2',
                  border: '2px solid #fecaca',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ color: '#991b1b', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Email Field */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    disabled={loading}
                    autoComplete="email"
                    suppressHydrationWarning={true}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 44px',
                      fontSize: '14px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      backgroundColor: loading ? '#f3f4f6' : 'white',
                      color: '#111827'
                    }}
                  />
                  <Mail size={18} style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    pointerEvents: 'none'
                  }} />
                </div>
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                    suppressHydrationWarning={true}
                    style={{
                      width: '100%',
                      padding: '12px 44px 12px 44px',
                      fontSize: '14px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      backgroundColor: loading ? '#f3f4f6' : 'white',
                      color: '#111827'
                    }}
                  />
                  <Lock size={18} style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    pointerEvents: 'none'
                  }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      padding: '4px',
                      display: 'flex',
                      color: '#6b7280'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#4b5563'
                }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  Remember me
                </label>
                <Link href="/auth/forgot-password" style={{
                  fontSize: '14px',
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontWeight: 500
                }}>
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: loading ? '#9ca3af' : '#2563eb',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '20px'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
                <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
                  OR TRY DEMO
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              </div>

              {/* Demo Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('operator')}
                  disabled={loading}
                  style={{
                    padding: '12px 16px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#374151',
                    backgroundColor: 'white',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  Tour Operator
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('agent')}
                  disabled={loading}
                  style={{
                    padding: '12px 16px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#374151',
                    backgroundColor: 'white',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  Travel Agent
                </button>
              </div>
              
              {/* Demo Credentials Info */}
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#0369a1'
              }}>
                <strong>Demo Credentials:</strong><br/>
                Tour Operator: operator@travelpro.com / demo123<br/>
                Travel Agent: agent@travelpro.com / demo123<br/>
                <button
                  type="button"
                  onClick={checkAndCreateDemoUsers}
                  style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    backgroundColor: '#0ea5e9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Check Demo Users
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div style={{
            padding: '20px 32px',
            backgroundColor: '#f9fafb',
            borderTop: '2px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" style={{
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: 500
              }}>
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginBottom: '12px'
          }}>
            Trusted by 10,000+ travel professionals worldwide
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '11px', color: '#6b7280' }}>🔒 Secure</span>
            <span style={{ fontSize: '11px', color: '#6b7280' }}>⚡ Fast</span>
            <span style={{ fontSize: '11px', color: '#6b7280' }}>🌍 Global</span>
          </div>
        </div>
      </div>
    </div>
  )
}