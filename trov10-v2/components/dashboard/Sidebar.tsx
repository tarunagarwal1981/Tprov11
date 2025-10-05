'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Calendar,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  Menu,
  X,
  Plane,
  ChevronLeft
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/operator/dashboard',
    icon: <LayoutDashboard size={20} />
  },
  {
    id: 'packages',
    label: 'Packages',
    href: '/operator/packages',
    icon: <Package size={20} />,
    badge: 12
  },
  {
    id: 'bookings',
    label: 'Bookings',
    href: '/operator/bookings',
    icon: <Calendar size={20} />,
    badge: 5
  },
  {
    id: 'agents',
    label: 'Travel Agents',
    href: '/operator/agents',
    icon: <Users size={20} />
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/operator/analytics',
    icon: <BarChart3 size={20} />
  },
  {
    id: 'communication',
    label: 'Communication',
    href: '/operator/communication',
    icon: <MessageSquare size={20} />,
    badge: 3
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/operator/settings',
    icon: <Settings size={20} />
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Check if we're on desktop
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
      if (window.innerWidth < 1024) {
        setIsMobileOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const isActive = (href: string) => pathname === href

  const toggleSidebar = () => {
    if (isDesktop) {
      setIsCollapsed(!isCollapsed)
    } else {
      setIsMobileOpen(!isMobileOpen)
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden"
        suppressHydrationWarning={true}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 50,
          width: '44px',
          height: '44px',
          backgroundColor: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.boxShadow = '0 8px 12px -2px rgba(0, 0, 0, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && !isDesktop && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: isCollapsed ? '80px' : '280px',
          backgroundColor: 'white',
          borderRight: '2px solid #e5e7eb',
          height: '100vh',
          position: 'fixed',
          left: isMobileOpen && !isDesktop ? 0 : isDesktop ? 0 : '-280px',
          top: 0,
          zIndex: 45,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: isDesktop ? '0 0 0 transparent' : '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
        className="lg:left-0"
      >
        {/* Header */}
        <div style={{
          padding: isCollapsed ? '16px' : '24px',
          borderBottom: '2px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          minHeight: '72px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}>
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
              }}>
                <Plane size={24} style={{ color: 'white' }} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0
                }}>
                  TravelPro
                </h1>
                <p style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  margin: 0,
                  fontWeight: 500
                }}>
                  Tour Operator
                </p>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
            }}>
              <Plane size={24} style={{ color: 'white' }} />
            </div>
          )}

          {/* Toggle Button (Desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex"
            suppressHydrationWarning={true}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: isCollapsed ? 'none' : 'flex',
              boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e2e8f0'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <ChevronLeft size={18} style={{ color: '#475569' }} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 transparent'
        }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {NAV_ITEMS.map((item) => (
              <li key={item.id} style={{ marginBottom: '8px' }}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: '12px',
                    padding: isCollapsed ? '12px' : '12px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    color: isActive(item.href) ? '#3b82f6' : '#475569',
                    backgroundColor: isActive(item.href) ? '#eff6ff' : 'transparent',
                    border: '2px solid',
                    borderColor: isActive(item.href) ? '#bfdbfe' : 'transparent',
                    fontWeight: isActive(item.href) ? 600 : 500,
                    fontSize: '14px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    boxShadow: isActive(item.href) ? '0 4px 6px -1px rgba(59, 130, 246, 0.2)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.backgroundColor = '#f8fafc'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }
                  }}
                >
                  <span style={{ display: 'flex', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge && (
                        <span style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          minWidth: '20px',
                          textAlign: 'center',
                          boxShadow: '0 2px 4px -1px rgba(220, 38, 38, 0.3)'
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isCollapsed && item.badge && (
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#dc2626',
                      borderRadius: '50%',
                      boxShadow: '0 2px 4px -1px rgba(220, 38, 38, 0.3)'
                    }} />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div style={{
          padding: '16px',
          borderTop: '2px solid #e5e7eb',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}>
          {!isCollapsed && (
            <div style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              borderRadius: '12px',
              border: '1px solid #bfdbfe',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1)'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    boxShadow: '0 4px 6px -1px rgba(251, 191, 36, 0.3)'
                }}>
                    <span style={{ fontSize: '18px' }}>💡</span>
                </div>
                <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                    Create packages faster using our pre-built templates.
                </p>
            </div>
          )}
        </div>
      </aside>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        nav::-webkit-scrollbar {
          width: 6px;
        }
        nav::-webkit-scrollbar-track {
          background: transparent;
        }
        nav::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        nav::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  )
}
