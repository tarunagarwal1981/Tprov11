'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/lib/auth-context'
import {
  Package,
  Calendar,
  DollarSign,
  Users,
  Plus,
  BarChart3,
  MessageSquare,
  FileText,
  CheckCircle,
  Star,
  Eye,
  ArrowUpRight
} from 'lucide-react'

export default function OperatorDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [stats] = useState({
    totalPackages: 24,
    activeBookings: 156,
    monthlyRevenue: 24580,
    partnerAgents: 42
  })

  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    // Set loading to false after auth loading is complete
    if (!authLoading) {
      setTimeout(() => setLoading(false), 500)
    }
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [authLoading])

  const breadcrumbs = [
    { label: 'Dashboard' }
  ]

  const quickActions = [
    {
      id: 1,
      label: 'Create Package',
      icon: <Plus size={20} />,
      href: '/operator/packages/create',
      color: '#2563eb',
      bgColor: '#eff6ff'
    },
    {
      id: 2,
      label: 'View Analytics',
      icon: <BarChart3 size={20} />,
      href: '/operator/analytics',
      color: '#059669',
      bgColor: '#ecfdf5'
    },
    {
      id: 3,
      label: 'Message Agents',
      icon: <MessageSquare size={20} />,
      href: '/operator/communication',
      color: '#d97706',
      bgColor: '#fffbeb'
    },
    {
      id: 4,
      label: 'Export Report',
      icon: <FileText size={20} />,
      href: '/operator/reports',
      color: '#dc2626',
      bgColor: '#fef2f2'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      title: 'New Booking Confirmed',
      description: 'Dubai Adventure Package - Sarah Johnson',
      time: '5 minutes ago',
      icon: <CheckCircle size={18} />,
      iconColor: '#059669',
      iconBg: '#ecfdf5'
    },
    {
      id: 2,
      title: 'Package Published',
      description: 'Maldives Luxury Escape is now live',
      time: '1 hour ago',
      icon: <Package size={18} />,
      iconColor: '#2563eb',
      iconBg: '#eff6ff'
    },
    {
      id: 3,
      title: 'Agent Joined',
      description: 'Global Travel Co. joined your network',
      time: '2 hours ago',
      icon: <Users size={18} />,
      iconColor: '#7c3aed',
      iconBg: '#f3e8ff'
    },
    {
      id: 4,
      title: 'Payment Received',
      description: '$2,450 payment processed',
      time: '3 hours ago',
      icon: <DollarSign size={18} />,
      iconColor: '#059669',
      iconBg: '#ecfdf5'
    },
    {
      id: 5,
      title: 'Review Added',
      description: '5-star review for Bali Paradise',
      time: '5 hours ago',
      icon: <Star size={18} />,
      iconColor: '#d97706',
      iconBg: '#fffbeb'
    }
  ]

  const topPackages = [
    {
      id: 1,
      name: 'Dubai Adventure Package',
      bookings: 45,
      revenue: 8950,
      rating: 4.8,
      image: '🏜️'
    },
    {
      id: 2,
      name: 'Maldives Luxury Escape',
      bookings: 32,
      revenue: 12800,
      rating: 4.9,
      image: '🏝️'
    },
    {
      id: 3,
      name: 'Bali Paradise Retreat',
      bookings: 28,
      revenue: 5600,
      rating: 4.7,
      image: '🌺'
    },
    {
      id: 4,
      name: 'Tokyo City Explorer',
      bookings: 24,
      revenue: 7200,
      rating: 4.6,
      image: '🏙️'
    }
  ]

  if (loading || authLoading) {
    return (
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div style={{ 
          padding: isMobile ? '20px' : '32px', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <div style={{
            width: isMobile ? '32px' : '40px',
            height: isMobile ? '32px' : '40px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{ 
            marginTop: '16px', 
            color: '#64748b',
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: 500
          }}>
            Loading dashboard...
          </p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <ProtectedRoute requiredRole="TOUR_OPERATOR">
      <DashboardLayout breadcrumbs={breadcrumbs}>
        {/* Welcome Section */}
        <div style={{ 
          marginBottom: isMobile ? '24px' : '32px',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          <h1 style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: 700,
            marginBottom: '8px',
            color: '#111827',
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome back, {user?.profile?.name || user?.email?.split('@')[0] || 'User'}! 👋
          </h1>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: '#64748b',
            fontWeight: 500
          }}>
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: isMobile ? '16px' : '24px',
        marginBottom: isMobile ? '24px' : '32px'
      }}>
        {/* Total Packages */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: isMobile ? '16px' : '24px',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '12px' : '16px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            width: isMobile ? '40px' : '48px',
            height: isMobile ? '40px' : '48px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
          }}>
            <Package size={isMobile ? 20 : 24} style={{ color: 'white' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: isMobile ? '12px' : '14px',
              color: '#64748b',
              margin: '0 0 4px 0',
              fontWeight: 500
            }}>
              Total Packages
            </p>
            <p style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 700,
              color: '#111827',
              margin: 0
            }}>
              {stats.totalPackages}
            </p>
          </div>
        </div>

        {/* Active Bookings */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: isMobile ? '16px' : '24px',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '12px' : '16px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            width: isMobile ? '40px' : '48px',
            height: isMobile ? '40px' : '48px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
          }}>
            <Calendar size={isMobile ? 20 : 24} style={{ color: 'white' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: isMobile ? '12px' : '14px',
              color: '#64748b',
              margin: '0 0 4px 0',
              fontWeight: 500
            }}>
              Active Bookings
            </p>
            <p style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 700,
              color: '#111827',
              margin: 0
            }}>
              {stats.activeBookings}
            </p>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: isMobile ? '16px' : '24px',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '12px' : '16px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            width: isMobile ? '40px' : '48px',
            height: isMobile ? '40px' : '48px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.3)'
          }}>
            <DollarSign size={isMobile ? 20 : 24} style={{ color: 'white' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: isMobile ? '12px' : '14px',
              color: '#64748b',
              margin: '0 0 4px 0',
              fontWeight: 500
            }}>
              Monthly Revenue
            </p>
            <p style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 700,
              color: '#111827',
              margin: 0
            }}>
              ${stats.monthlyRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Partner Agents */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: isMobile ? '16px' : '24px',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '12px' : '16px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            width: isMobile ? '40px' : '48px',
            height: isMobile ? '40px' : '48px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.3)'
          }}>
            <Users size={isMobile ? 20 : 24} style={{ color: 'white' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: isMobile ? '12px' : '14px',
              color: '#64748b',
              margin: '0 0 4px 0',
              fontWeight: 500
            }}>
              Partner Agents
            </p>
            <p style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 700,
              color: '#111827',
              margin: 0
            }}>
              {stats.partnerAgents}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: isMobile ? '20px' : '24px',
        marginBottom: isMobile ? '24px' : '32px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <h2 style={{
          fontSize: isMobile ? '18px' : '20px',
          fontWeight: 600,
          marginBottom: isMobile ? '16px' : '20px',
          color: '#111827'
        }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: isMobile ? '12px' : '16px'
        }}>
          {quickActions.map((action) => (
            <a
              key={action.id}
              href={action.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '8px' : '12px',
                padding: isMobile ? '12px' : '16px',
                backgroundColor: action.bgColor,
                border: '1px solid',
                borderColor: action.color + '20',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{
                width: isMobile ? '32px' : '40px',
                height: isMobile ? '32px' : '40px',
                backgroundColor: action.color + '20',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: action.color
              }}>
                {action.icon}
              </div>
              <span style={{
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: 500,
                color: '#111827'
              }}>
                {action.label}
              </span>
            </a>
          ))}
        </div>
      </div>
      
      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: isMobile ? '16px' : '24px',
        marginBottom: isMobile ? '24px' : '32px'
      }}>
        {/* Recent Activity */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: isMobile ? '20px' : '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: isMobile ? '16px' : '20px'
          }}>
            <h2 style={{
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: 600,
              margin: 0,
              color: '#111827'
            }}>
              Recent Activity
            </h2>
            <a
              href="/operator/activity"
              style={{
                fontSize: isMobile ? '12px' : '14px',
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1d4ed8'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#3b82f6'
              }}
            >
              View all
              <ArrowUpRight size={isMobile ? 14 : 16} />
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px' }}>
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: isMobile ? '10px' : '12px',
                  padding: isMobile ? '12px' : '16px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  width: isMobile ? '28px' : '32px',
                  height: isMobile ? '28px' : '32px',
                  backgroundColor: activity.iconBg,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activity.iconColor,
                  flexShrink: 0,
                  boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  {activity.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: isMobile ? '13px' : '14px',
                    fontWeight: 500,
                    margin: '0 0 4px 0',
                    color: '#111827'
                  }}>
                    {activity.title}
                  </p>
                  <p style={{
                    fontSize: isMobile ? '12px' : '13px',
                    color: '#64748b',
                    margin: '0 0 4px 0',
                    lineHeight: 1.4
                  }}>
                    {activity.description}
                  </p>
                  <p style={{
                    fontSize: isMobile ? '11px' : '12px',
                    color: '#94a3b8',
                    margin: 0,
                    fontWeight: 500
                  }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Packages */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: isMobile ? '20px' : '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: isMobile ? '16px' : '20px'
          }}>
            <h2 style={{
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: 600,
              margin: 0,
              color: '#111827'
            }}>
              Top Packages
            </h2>
            <a
              href="/operator/packages"
              style={{
                fontSize: isMobile ? '12px' : '14px',
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1d4ed8'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#3b82f6'
              }}
            >
              View all
              <ArrowUpRight size={isMobile ? 14 : 16} />
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px' }}>
            {topPackages.map((pkg) => (
              <div
                key={pkg.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '10px' : '12px',
                  padding: isMobile ? '12px' : '16px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  width: isMobile ? '36px' : '40px',
                  height: isMobile ? '36px' : '40px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '18px' : '20px',
                  flexShrink: 0,
                  boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  {pkg.image}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: isMobile ? '13px' : '14px',
                    fontWeight: 500,
                    margin: '0 0 4px 0',
                    color: '#111827'
                  }}>
                    {pkg.name}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '8px' : '12px',
                    fontSize: isMobile ? '11px' : '12px',
                    color: '#64748b',
                    flexWrap: 'wrap'
                  }}>
                    <span>{pkg.bookings} bookings</span>
                    <span>•</span>
                    <span>${pkg.revenue.toLocaleString()}</span>
                    <span>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Star size={isMobile ? 10 : 12} style={{ color: '#fbbf24' }} />
                      <span>{pkg.rating}</span>
                    </div>
                  </div>
                </div>
                <Eye size={isMobile ? 14 : 16} style={{ color: '#94a3b8' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Enhanced animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        /* Smooth transitions for all interactive elements */
        * {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Cross-browser compatibility */
        .dashboard-card {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
        }
        
        /* Improved focus styles for accessibility */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
          border-radius: 4px;
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .dashboard-card {
            border: 2px solid #000;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Print styles */
        @media print {
          .dashboard-card {
            box-shadow: none !important;
            border: 1px solid #000 !important;
          }
        }
      `}</style>
    </DashboardLayout>
    </ProtectedRoute>
  )
}
