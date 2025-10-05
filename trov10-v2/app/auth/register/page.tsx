'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Lock, Building2, Phone, MapPin, AlertCircle, Check } from 'lucide-react'

type UserRole = 'tour_operator' | 'travel_agent'

interface FormData {
  // Step 1
  fullName: string
  email: string
  password: string
  confirmPassword: string
  // Step 2
  role: UserRole | null
  // Step 3
  companyName: string
  phone: string
  country: string
  city: string
}

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: null,
    companyName: '',
    phone: '',
    country: '',
    city: ''
  })

  // Pre-select role from URL parameter
  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam === 'tour_operator' || roleParam === 'travel_agent') {
      setFormData(prev => ({ ...prev, role: roleParam as UserRole }))
      setStep(2) // Skip to step 2 if role is pre-selected
    }
  }, [searchParams])

  const updateFormData = (field: keyof FormData, value: string | UserRole | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required')
      return false
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Valid email is required')
      return false
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.role) {
      setError('Please select your role')
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!formData.companyName.trim()) {
      setError('Company name is required')
      return false
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return false
    }
    if (!formData.country.trim()) {
      setError('Country is required')
      return false
    }
    return true
  }

  const handleNext = () => {
    setError('')
    
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleBack = () => {
    setError('')
    setStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep3()) return
    
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          }
        }
      })

      if (authError) throw authError

      // Create profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user?.id,
          full_name: formData.fullName,
          email: formData.email,
          role: formData.role,
          company_name: formData.companyName,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
        })

      if (profileError) throw profileError

      // Redirect to dashboard
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
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ marginBottom: 'var(--space-2)' }}>
          Create Account
        </h1>
        <p className="text-secondary">
          Join Trov10 today
        </p>
      </div>

      {/* Progress Indicator */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: 'var(--space-4)'
        }}>
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: step >= stepNum 
                  ? 'var(--color-primary-600)' 
                  : 'var(--color-gray-200)',
                color: step >= stepNum 
                  ? 'var(--text-white)' 
                  : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'all var(--transition-normal)'
              }}>
                {step > stepNum ? <Check size={16} /> : stepNum}
              </div>
              {stepNum < 3 && (
                <div style={{
                  width: '40px',
                  height: '2px',
                  backgroundColor: step > stepNum 
                    ? 'var(--color-primary-600)' 
                    : 'var(--color-gray-200)',
                  transition: 'all var(--transition-normal)'
                }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          <span>Basic Info</span>
          <span>Role</span>
          <span>Company</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
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

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="fullName" style={{ marginBottom: 'var(--space-2)' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                  placeholder="John Doe"
                  required
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

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="email" style={{ marginBottom: 'var(--space-2)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="you@example.com"
                  required
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

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="password" style={{ marginBottom: 'var(--space-2)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
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

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label htmlFor="confirmPassword" style={{ marginBottom: 'var(--space-2)' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                  required
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

            <button 
              type="button" 
              onClick={handleNext}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Next Step
            </button>
          </div>
        )}

        {/* STEP 2: Role Selection */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
              Select Your Role
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Tour Operator Card */}
              <div
                onClick={() => updateFormData('role', 'tour_operator')}
                style={{
                  padding: 'var(--space-6)',
                  border: formData.role === 'tour_operator' 
                    ? '3px solid var(--color-primary-600)' 
                    : '2px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  backgroundColor: formData.role === 'tour_operator'
                    ? 'var(--color-primary-50)'
                    : 'var(--bg-white)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Building2 size={24} style={{ color: 'var(--color-primary-600)' }} />
                  <div>
                    <h4 style={{ marginBottom: 'var(--space-1)' }}>Tour Operator</h4>
                    <p className="text-secondary" style={{ fontSize: '14px' }}>
                      Create and list travel packages for agents
                    </p>
                  </div>
                </div>
              </div>

              {/* Travel Agent Card */}
              <div
                onClick={() => updateFormData('role', 'travel_agent')}
                style={{
                  padding: 'var(--space-6)',
                  border: formData.role === 'travel_agent' 
                    ? '3px solid var(--color-success-600)' 
                    : '2px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  backgroundColor: formData.role === 'travel_agent'
                    ? 'var(--color-success-50)'
                    : 'var(--bg-white)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Building2 size={24} style={{ color: 'var(--color-success-600)' }} />
                  <div>
                    <h4 style={{ marginBottom: 'var(--space-1)' }}>Travel Agent</h4>
                    <p className="text-secondary" style={{ fontSize: '14px' }}>
                      Browse and sell packages to customers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-3)', 
              marginTop: 'var(--space-6)' 
            }}>
              <button 
                type="button" 
                onClick={handleBack}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button 
                type="button" 
                onClick={handleNext}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Company Info */}
        {step === 3 && (
          <div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="companyName" style={{ marginBottom: 'var(--space-2)' }}>
                Company Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  placeholder="Your Company Ltd."
                  required
                  disabled={loading}
                  style={{ paddingLeft: '40px' }}
                />
                <Building2 
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

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="phone" style={{ marginBottom: 'var(--space-2)' }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                  required
                  disabled={loading}
                  style={{ paddingLeft: '40px' }}
                />
                <Phone 
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

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="country" style={{ marginBottom: 'var(--space-2)' }}>
                Country
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="country"
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateFormData('country', e.target.value)}
                  placeholder="United Kingdom"
                  required
                  disabled={loading}
                  style={{ paddingLeft: '40px' }}
                />
                <MapPin 
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

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label htmlFor="city" style={{ marginBottom: 'var(--space-2)' }}>
                City (Optional)
              </label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                placeholder="London"
                disabled={loading}
              />
            </div>

            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-3)' 
            }}>
              <button 
                type="button" 
                onClick={handleBack}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </div>
        )}
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
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div className="text-secondary">Loading...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}