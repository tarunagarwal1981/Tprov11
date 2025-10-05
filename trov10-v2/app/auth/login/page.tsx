'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Redirect based on user role
      router.push('/dashboard')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ marginBottom: 'var(--space-2)' }}>
          Welcome Back
        </h1>
        <p className="text-secondary">
          Login to your Trov10 account
        </p>
      </div>

      <form onSubmit={handleLogin}>
        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: 'var(--color-error-50)',
            border: '2px solid var(--color-error-500)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <AlertCircle size={16} style={{ color: 'var(--color-error-600)' }} />
            <span style={{ color: 'var(--color-error-700)', fontSize: '14px' }}>
              {error}
            </span>
          </div>
        )}

        {/* Email Field */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label htmlFor="email" style={{ marginBottom: 'var(--space-2)' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              style={{ paddingLeft: '40px' }}
            />
            <Mail 
              size={16} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} 
            />
          </div>
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label htmlFor="password" style={{ marginBottom: 'var(--space-2)' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              style={{ paddingLeft: '40px' }}
            />
            <Lock 
              size={16} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} 
            />
          </div>
        </div>

        {/* Forgot Password Link */}
        <div style={{ textAlign: 'right', marginBottom: 'var(--space-6)' }}>
          <Link 
            href="/auth/forgot-password" 
            style={{ 
              color: 'var(--color-primary-600)', 
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
        <p className="text-secondary">
          Don&apos;t have an account?{' '}
          <Link 
            href="/auth/register" 
            style={{ 
              color: 'var(--color-primary-600)', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
