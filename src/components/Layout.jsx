import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import './Layout.css'

export default function Layout({ children, topics }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
        const idx = topics.findIndex(t => `/topic/${t.id}` === location.pathname)
        if (idx > 0) navigate(`/topic/${topics[idx - 1].id}`)
      }
      if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
        const idx = topics.findIndex(t => `/topic/${t.id}` === location.pathname)
        if (idx < topics.length - 1) navigate(`/topic/${topics[idx + 1].id}`)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [location, navigate, topics])

  return (
    <div className="app-layout">
      <header className="app-header">
        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="app-title" onClick={() => navigate('/')}>
          <span className="app-logo">⚛️</span> React Mastery
        </h1>
        <div className="header-right">
          <span className="key-hint">← → navigate</span>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="header-link">React Docs ↗</a>
        </div>
      </header>
      <div className="app-body">
        <Sidebar topics={topics} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  )
}
