import Link from 'next/link'
import { ArrowRight, Users, Package, TrendingUp, Shield, LogIn, UserPlus, Plane } from 'lucide-react'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Navigation Header */}
      <header style={{
        padding: '16px 0',
        borderBottom: '2px solid #e5e7eb',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#dbeafe',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Plane size={24} style={{ color: '#2563eb' }} />
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>
                TravelPro
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/auth/login" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'white',
                border: '2px solid #d1d5db',
                borderRadius: '6px',
                textDecoration: 'none',
                color: '#4b5563',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}>
                <LogIn size={16} />
                Sign In
              </Link>
              <Link href="/auth/register" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                border: '2px solid #2563eb',
                borderRadius: '6px',
                textDecoration: 'none',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}>
                <UserPlus size={16} />
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '48px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '24px',
            lineHeight: '1.1'
          }}>
            Simplify Travel Booking for Small Agencies Worldwide
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#4b5563',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            AI-powered lead generation, global marketplace platform, and complete CRM system 
            designed specifically for small travel agencies worldwide.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register?role=travel_agent" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 24px',
              backgroundColor: '#2563eb',
              border: '2px solid #2563eb',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}>
              Start as Travel Agent <ArrowRight size={20} />
            </Link>
            <Link href="/auth/register?role=tour_operator" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 24px',
              backgroundColor: 'white',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#4b5563',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}>
              Join as Tour Operator
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        backgroundColor: '#f9fafb', 
        paddingTop: '64px', 
        paddingBottom: '64px' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '48px',
            fontSize: '36px',
            fontWeight: '700',
            color: '#111827'
          }}>
            Everything You Need to Grow Your Travel Business
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {/* Feature 1 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '2px solid #e5e7eb',
              padding: '32px',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: '#eff6ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Users size={32} style={{ color: '#2563eb' }} />
              </div>
              <h3 style={{ 
                marginBottom: '12px',
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827'
              }}>AI Lead Generation</h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                Automated lead generation with AI-powered verification and scoring
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '2px solid #e5e7eb',
              padding: '32px',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: '#ecfdf5',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Package size={32} style={{ color: '#059669' }} />
              </div>
              <h3 style={{ 
                marginBottom: '12px',
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827'
              }}>Global Marketplace</h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                Connect with tour operators and access curated travel packages worldwide
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '2px solid #e5e7eb',
              padding: '32px',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: '#fffbeb',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <TrendingUp size={32} style={{ color: '#d97706' }} />
              </div>
              <h3 style={{ 
                marginBottom: '12px',
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827'
              }}>Complete CRM System</h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                Manage customers, track bookings, and communicate via WhatsApp integration
              </p>
            </div>

            {/* Feature 4 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '2px solid #e5e7eb',
              padding: '32px',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: '#fef2f2',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Shield size={32} style={{ color: '#dc2626' }} />
              </div>
              <h3 style={{ 
                marginBottom: '12px',
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827'
              }}>Secure Booking Management</h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                End-to-end booking process with revenue sharing and secure payments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        paddingTop: '64px', 
        paddingBottom: '64px' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto', 
            textAlign: 'center' 
          }}>
            <h2 style={{ 
              marginBottom: '16px',
              fontSize: '36px',
              fontWeight: '700',
              color: '#111827'
            }}>
              Ready to Transform Your Travel Business?
            </h2>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '24px',
              fontSize: '18px',
              lineHeight: '1.6'
            }}>
              Join thousands of travel agents and tour operators already using TravelPro 
              to grow their business worldwide.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/register" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 24px',
                backgroundColor: '#2563eb',
                border: '2px solid #2563eb',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}>
                Create Free Account <ArrowRight size={20} />
              </Link>
              <Link href="/auth/login" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 24px',
                backgroundColor: 'white',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#4b5563',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}>
                <LogIn size={20} />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}