'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getRoleDisplayName } from '@/lib/auth'
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings as SettingsIcon,
  ChevronDown
} from 'lucide-react'

interface HeaderProps {
  breadcrumbs?: { label: string; href?: string }[]
}

export default function Header({ breadcrumbs = [] }: HeaderProps) {
  const { user, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleLogout = async () => {
    await signOut()
  }

  const notifications = [
    {
      id: 1,
      title: 'New booking received',
      message: 'Dubai Adventure Package - Sarah Johnson',
      time: '5 min ago',
      unread: true
    },
    {
      id: 2,
      title: 'Package approved',
      message: 'Maldives Luxury Escape is now live',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'New agent joined',
      message: 'Global Travel Co. joined your network',
      time: '2 hours ago',
      unread: false
    }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header style={{
      height: '72px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: isMobile ? '0 16px' : '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: isMobile ? '12px' : '24px',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    }}>
      {/* Left: Breadcrumbs */}
      <div style={{ flex: '0 0 auto', minWidth: 0 }}>
        {breadcrumbs.length > 0 && (
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: isMobile ? '12px' : '14px',
            overflow: 'hidden'
          }}>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                {index > 0 && (
                  <span style={{ color: '#9ca3af', flexShrink: 0 }}>/</span>
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    style={{
                      color: '#4b5563',
                      textDecoration: 'none',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span style={{ 
                    color: '#111827', 
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Center: Search */}
      <div style={{ 
        flex: '1 1 auto', 
        maxWidth: isMobile ? '200px' : '500px',
        display: isMobile ? 'none' : 'block'
      }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search packages, bookings, agents..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              fontSize: '14px',
              color: '#111827',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6'
              e.target.style.backgroundColor = 'white'
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db'
              e.target.style.backgroundColor = '#f8fafc'
              e.target.style.boxShadow = 'none'
            }}
          />
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              pointerEvents: 'none'
            }}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '8px' : '16px'
      }}>
        {/* Mobile Search Button */}
        {isMobile && (
          <button
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#f8fafc',
              border: '1px solid #d1d5db',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
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
            <Search size={18} style={{ color: '#4b5563' }} />
          </button>
        )}

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#f8fafc',
              border: '1px solid #d1d5db',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease'
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
            <Bell size={20} style={{ color: '#4b5563' }} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '20px',
                height: '20px',
                backgroundColor: '#dc2626',
                color: 'white',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
                boxShadow: '0 2px 4px -1px rgba(220, 38, 38, 0.3)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                onClick={() => setShowNotifications(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 40
                }}
              />
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: isMobile ? '320px' : '360px',
                maxWidth: '90vw',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                zIndex: 50,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}>
                <div style={{
                  padding: '20px',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    margin: 0,
                    color: '#111827'
                  }}>
                    Notifications
                  </h3>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: notification.unread ? '#eff6ff' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = notification.unread ? '#dbeafe' : '#f8fafc'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = notification.unread ? '#eff6ff' : 'transparent'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          margin: 0,
                          color: '#111827'
                        }}>
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <span style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#3b82f6',
                            borderRadius: '50%',
                            flexShrink: 0,
                            marginTop: '4px'
                          }} />
                        )}
                      </div>
                      <p style={{
                        fontSize: '13px',
                        color: '#4b5563',
                        margin: '0 0 8px 0',
                        lineHeight: 1.4
                      }}>
                        {notification.message}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        margin: 0
                      }}>
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div style={{
                  padding: '16px 20px',
                  borderTop: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <a
                    href="/operator/notifications"
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#3b82f6',
                      textDecoration: 'none'
                    }}
                  >
                    View all notifications
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '8px' : '12px',
              padding: isMobile ? '6px 8px' : '8px 12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e2e8f0'
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              color: 'white',
              fontSize: '14px',
              boxShadow: '0 2px 4px -1px rgba(59, 130, 246, 0.3)'
            }}>
              {user?.profile?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {!isMobile && (
              <div style={{ textAlign: 'left' }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  margin: 0,
                  color: '#111827'
                }}>
                  {user?.profile?.name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  margin: 0
                }}>
                  {user?.profile?.role ? getRoleDisplayName(user.profile.role) : 'User'}
                </p>
              </div>
            )}
            <ChevronDown size={16} style={{ color: '#6b7280' }} />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <>
              <div
                onClick={() => setShowUserMenu(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 40
                }}
              />
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: isMobile ? '200px' : '240px',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                zIndex: 50,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}>
                <div style={{
                  padding: '20px',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    margin: '0 0 4px 0',
                    color: '#111827'
                  }}>
                    {user?.profile?.name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    margin: 0
                  }}>
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
                <div style={{ padding: '8px' }}>
                  <a
                    href="/operator/profile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      color: '#4b5563',
                      fontSize: '14px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <User size={18} />
                    Profile
                  </a>
                  <a
                    href="/operator/settings"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      color: '#4b5563',
                      fontSize: '14px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <SettingsIcon size={18} />
                    Settings
                  </a>
                </div>
                <div style={{
                  padding: '8px',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      color: '#dc2626',
                      fontSize: '14px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <LogOut size={18} />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
