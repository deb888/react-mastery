import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

function ThemedCard() {
  const { theme } = useContext(ThemeContext)
  const isDark = theme === 'dark'
  return (
    <div className="demo-card" style={{
      background: isDark ? '#020617' : '#FFFFFF',
      border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`
    }}>
      <h4 style={{ color: isDark ? '#22C55E' : '#1E293B', marginBottom: 8 }}>Themed Card</h4>
      <p style={{ color: isDark ? '#94a3b8' : '#475569' }}>
        This card reads the theme from context. Current: <span className={`demo-badge ${isDark ? 'green' : 'yellow'}`}>{theme}</span>
      </p>
    </div>
  )
}

function ThemedButton() {
  const { theme, toggle } = useContext(ThemeContext)
  const isDark = theme === 'dark'
  return (
    <button className="demo-btn" onClick={toggle} style={{
      background: isDark ? '#22C55E' : '#1E293B',
      color: isDark ? '#020617' : '#FFFFFF'
    }}>
      Switch to {isDark ? 'Light' : 'Dark'} Mode
    </button>
  )
}

export default function ContextDemo() {
  return (
    <ThemeProvider>
      <div className="playground-demo">
        <div className="demo-card">
          <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Context API</h3>
          <p style={{ color: '#94a3b8', marginBottom: 12 }}>
            <code>ThemeContext</code> provides <code>theme</code> and <code>toggle</code> to all children without prop drilling.
          </p>
          <div className="demo-row">
            <span className="demo-badge green">createContext</span>
            <span className="demo-badge blue">useContext</span>
            <span className="demo-badge yellow">Provider</span>
          </div>
        </div>

        <ThemedCard />
        <ThemedCard />

        <div className="demo-row" style={{ marginTop: 12 }}>
          <ThemedButton />
        </div>
      </div>
    </ThemeProvider>
  )
}
