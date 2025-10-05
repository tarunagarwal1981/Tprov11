'use client'

import { ReactNode, useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface DashboardLayoutProps {
  children: ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

export default function DashboardLayout({ 
  children, 
  breadcrumbs 
}: DashboardLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <Sidebar />

      <div 
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          marginLeft: isMobile ? '0' : '280px',
          backgroundColor: '#f8fafc'
        }}
        className="main-content"
      >
        <Header breadcrumbs={breadcrumbs} />

        <main style={{
          flex: 1,
          padding: isMobile ? '16px' : '32px',
          overflowY: 'auto',
          backgroundColor: '#f8fafc',
          scrollBehavior: 'smooth'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: isMobile ? '20px' : '32px',
            minHeight: 'calc(100vh - 200px)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}>
            {children}
          </div>
        </main>
      </div>

      <style jsx global>{`
        /* Responsive breakpoints */
        @media (min-width: 1024px) {
          .main-content {
            margin-left: 280px !important;
          }
          .sidebar-collapsed .main-content {
            margin-left: 80px !important;
          }
        }
        
        @media (max-width: 1023px) {
          .main-content {
            margin-left: 0 !important;
          }
        }
        
        /* Ensure proper scrolling */
        .main-content main {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Content area styling */
        .main-content main > div {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          transition: box-shadow 0.2s ease;
        }
        
        .main-content main > div:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        /* Cross-browser compatibility */
        * {
          box-sizing: border-box;
        }
        
        html {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        
        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Firefox scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        
        /* Focus styles for accessibility */
        button:focus-visible,
        a:focus-visible,
        input:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .main-content main > div {
            border: 2px solid #000;
          }
        }
        
        /* Print styles */
        @media print {
          .main-content {
            margin-left: 0 !important;
          }
          
          .main-content main > div {
            box-shadow: none !important;
            border: 1px solid #000 !important;
          }
        }
      `}</style>
    </div>
  )
}
