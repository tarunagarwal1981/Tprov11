import Link from 'next/link'
import { ArrowRight, Users, Package, TrendingUp, Shield, LogIn, UserPlus } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header style={{
        padding: 'var(--space-4) 0',
        borderBottom: '2px solid var(--border-light)',
        backgroundColor: 'var(--bg-white)'
      }}>
        <div className="container">
          <div className="flex-between">
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-primary-600)' }}>
              Trov10
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Link href="/auth/login" className="btn btn-secondary btn-sm">
                <LogIn size={16} />
                Sign In
              </Link>
              <Link href="/auth/register" className="btn btn-primary btn-sm">
                <UserPlus size={16} />
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ marginBottom: 'var(--space-6)' }}>
            Simplify Travel Booking for Small Agents
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-8)',
            lineHeight: '1.6'
          }}>
            AI-powered lead generation, marketplace platform, and CRM system 
            designed specifically for small travel agencies worldwide.
          </p>
          
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register?role=travel_agent" className="btn btn-primary btn-lg">
              Start as Travel Agent <ArrowRight size={20} />
            </Link>
            <Link href="/auth/register?role=tour_operator" className="btn btn-secondary btn-lg">
              Join as Tour Operator
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        backgroundColor: 'var(--bg-light)', 
        paddingTop: 'var(--space-16)', 
        paddingBottom: 'var(--space-16)' 
      }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            Everything You Need to Grow
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-8)'
          }}>
            {/* Feature 1 */}
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  backgroundColor: 'var(--color-primary-100)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)'
                }}>
                  <Users size={32} style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <h3 style={{ marginBottom: 'var(--space-3)' }}>AI Lead Generation</h3>
                <p className="text-secondary">
                  Automated lead generation with AI-powered verification and scoring
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  backgroundColor: 'var(--color-success-50)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)'
                }}>
                  <Package size={32} style={{ color: 'var(--color-success-600)' }} />
                </div>
                <h3 style={{ marginBottom: 'var(--space-3)' }}>Marketplace Platform</h3>
                <p className="text-secondary">
                  Connect with tour operators and access curated travel packages
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  backgroundColor: 'var(--color-warning-50)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)'
                }}>
                  <TrendingUp size={32} style={{ color: 'var(--color-warning-600)' }} />
                </div>
                <h3 style={{ marginBottom: 'var(--space-3)' }}>Complete CRM</h3>
                <p className="text-secondary">
                  Manage customers, track bookings, and communicate via WhatsApp
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  backgroundColor: 'var(--color-error-50)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)'
                }}>
                  <Shield size={32} style={{ color: 'var(--color-error-600)' }} />
                </div>
                <h3 style={{ marginBottom: 'var(--space-3)' }}>Secure Booking</h3>
                <p className="text-secondary">
                  End-to-end booking process with revenue sharing built-in
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        paddingTop: 'var(--space-16)', 
        paddingBottom: 'var(--space-16)' 
      }}>
        <div className="container">
          <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto', 
            textAlign: 'center' 
          }}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>
              Ready to Get Started?
            </h2>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: 'var(--space-6)',
              fontSize: '18px'
            }}>
              Join thousands of travel agents and tour operators already using Trov10
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/register" className="btn btn-primary btn-lg">
                Create Free Account <ArrowRight size={20} />
              </Link>
              <Link href="/auth/login" className="btn btn-secondary btn-lg">
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