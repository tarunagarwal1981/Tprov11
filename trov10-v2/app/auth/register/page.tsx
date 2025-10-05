'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      if (authError) throw authError

      // Redirect to dashboard or verification page
      router.push('/dashboard')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ marginBottom: 'var(--space-2)' }}>
          Create Account
        </h1>
        <p className="text-secondary">
          Join Trov10 and start growing your travel business
        </p>
      </div>

      <form onSubmit={handleRegister}>
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

        {/* Full Name Field */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label htmlFor="fullName" style={{ marginBottom: 'var(--space-2)' }}>
            Full Name
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={loading}
              style={{ paddingLeft: '40px' }}
            />
            <User 
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
              placeholder="Create a password"
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

        {/* Confirm Password Field */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label htmlFor="confirmPassword" style={{ marginBottom: 'var(--space-2)' }}>
            Confirm Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
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

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
        <p className="text-secondary">
          Already have an account?{' '}
          <Link 
            href="/auth/login" 
            style={{ 
              color: 'var(--color-primary-600)', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
