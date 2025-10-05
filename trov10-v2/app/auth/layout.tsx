export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-4)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'var(--bg-white)',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--border-light)',
        boxShadow: 'var(--shadow-lg)',
        padding: 'var(--space-8)'
      }}>
        {children}
      </div>
    </div>
  )
}
