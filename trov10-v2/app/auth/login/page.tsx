'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, AlertCircle, Eye, EyeOff, Plane } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Get user profile to determine role
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()

      // Redirect based on role
      if (profile?.role === 'TOUR_OPERATOR') {
        router.push('/operator/dashboard')
      } else if (profile?.role === 'TRAVEL_AGENT') {
        router.push('/agent/dashboard')
      } else if (profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN') {
        router.push('/admin/dashboard')
      } else {
        // Default to operator dashboard for users without specific role
        router.push('/operator/dashboard')
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (role: 'operator' | 'agent') => {
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

    setEmail(demoCredentials[role].email)
    setPassword(demoCredentials[role].password)
    setError('')
    
    // Trigger form submit
    setTimeout(() => {
      const form = document.getElementById('login-form') as HTMLFormElement
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
        form.dispatchEvent(submitEvent)
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