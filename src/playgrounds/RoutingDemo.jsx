import { useState } from 'react'

const pages = [
  { id: 'home', label: 'Home', content: '🏠 Welcome to the home page!' },
  { id: 'about', label: 'About', content: 'ℹ️ This is a simulated router demo.' },
  { id: 'profile', label: 'Profile', content: '👤 User profile page with protected access.' },
  { id: 'settings', label: 'Settings', content: '⚙️ App settings page.' },
]

const protectedPages = ['profile']

function ProtectedRoute({ page, children }) {
  return (
    <div className="demo-card" style={{ borderLeft: '4px solid #eab308' }}>
      <p style={{ color: '#eab308', marginBottom: 8 }}>🔐 Protected Route: {page.label}</p>
      {children}
    </div>
  )
}

export default function RoutingDemo() {
  const [activePage, setActivePage] = useState('home')
  const [params, setParams] = useState({ userId: '42' })
  const [isAuth, setIsAuth] = useState(true)

  const currentPage = pages.find(p => p.id === activePage)
  const isProtected = protectedPages.includes(activePage)

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Simulated Router (useState)</h3>
        <p style={{ color: '#94a3b8', marginBottom: 12 }}>
          React Router concepts shown via state-based navigation: links, params, protected routes, nested views.
        </p>
        <div className="demo-row">
          <span className="demo-badge green">Navigation</span>
          <span className="demo-badge blue">Route Params</span>
          <span className="demo-badge yellow">Protected Routes</span>
        </div>
      </div>

      <div className="demo-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #475569' }}>
          {pages.map(p => (
            <button key={p.id} onClick={() => setActivePage(p.id)}
              className={`demo-btn ${activePage === p.id ? '' : 'secondary'}`}
              style={{ flex: 1, borderRadius: 0, borderRight: '1px solid #475569', transform: 'none' }}>
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ padding: 20 }}>
          {isProtected ? (
            isAuth ? (
              <ProtectedRoute page={currentPage}>
                <p style={{ color: '#e2e8f0' }}>{currentPage.content}</p>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 4 }}>
                  Route params: userId = {params.userId}
                </p>
              </ProtectedRoute>
            ) : (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <p style={{ color: '#EF4444' }}>🔒 Please log in to access this page.</p>
              </div>
            )
          ) : (
            <div>
              <p style={{ color: '#e2e8f0' }}>{currentPage.content}</p>
              {activePage === 'home' && (
                <div style={{ marginTop: 12 }}>
                  <div className="demo-row">
                    <input className="demo-input" placeholder="Route param: userId" value={params.userId}
                      onChange={e => setParams(p => ({ ...p, userId: e.target.value }))} />
                    <span className="demo-badge blue">params.userId = {params.userId}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="demo-card">
        <h4 style={{ color: '#60a5fa', marginBottom: 8 }}>Auth / Protected Route Toggle</h4>
        <div className="demo-row">
          <button className={`demo-btn ${isAuth ? 'danger' : ''}`} onClick={() => setIsAuth(a => !a)}>
            {isAuth ? 'Log Out' : 'Log In'}
          </button>
          <span className={`demo-badge ${isAuth ? 'green' : 'red'}`}>
            {isAuth ? 'Authenticated' : 'Guest'}
          </span>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 8 }}>
          Click "Profile" tab with auth off/on to see protected route behavior.
        </p>
      </div>
    </div>
  )
}
