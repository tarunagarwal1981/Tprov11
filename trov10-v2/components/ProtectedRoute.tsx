'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'SUPER_ADMIN' | 'ADMIN' | 'TOUR_OPERATOR' | 'TRAVEL_AGENT'
  fallbackPath?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  fallbackPath = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // If no user is logged in, redirect to landing page instead of login
      if (!user) {
        router.push('/')
        return
      }

      // If a specific role is required, check if user has that role
      if (requiredRole && user.profile?.role !== requiredRole) {
        // Redirect based on user's actual role
        if (user.profile?.role === 'TOUR_OPERATOR') {
          router.push('/operator/dashboard')
        } else if (user.profile?.role === 'TRAVEL_AGENT') {
          router.push('/agent/dashboard')
        } else if (user.profile?.role === 'ADMIN' || user.profile?.role === 'SUPER_ADMIN') {
          router.push('/admin/dashboard')
        } else {
          router.push('/')
        }
        return
      }
    }
  }, [user, loading, requiredRole, router, fallbackPath])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      </div>
    )
  }

  // If no user or wrong role, don't render children
  if (!user || (requiredRole && user.profile?.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
