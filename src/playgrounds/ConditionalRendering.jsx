import { useState } from 'react'

function LoadingDemo({ loading }) {
  return (
    <div className="demo-card">
      <h4 style={{ color: '#60a5fa', marginBottom: 8 }}>1. Ternary + Loading State</h4>
      {loading ? (
        <p style={{ color: '#eab308' }}>⏳ Loading data...</p>
      ) : (
        <p style={{ color: '#22C55E' }}>✅ Data loaded successfully!</p>
      )}
    </div>
  )
}

function EmptyStateDemo({ items }) {
  return (
    <div className="demo-card">
      <h4 style={{ color: '#60a5fa', marginBottom: 8 }}>2. && + Empty State</h4>
      {items.length === 0 && <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>📭 No items to display.</p>}
      {items.length > 0 && (
        <ul>{items.map((item, i) => <li key={i} style={{ color: '#e2e8f0' }}>{item}</li>)}</ul>
      )}
    </div>
  )
}

function ErrorStateDemo() {
  const [error, setError] = useState(null)
  return (
    <div className="demo-card">
      <h4 style={{ color: '#60a5fa', marginBottom: 8 }}>3. If-Else (Variable)</h4>
      <div className="demo-row">
        <button className="demo-btn" onClick={() => setError(null)}>Clear Error</button>
        <button className="demo-btn danger" onClick={() => setError(new Error('Network request failed!'))}>Trigger Error</button>
      </div>
      {(() => {
        if (error) {
          return <p style={{ color: '#EF4444' }}>⚠️ {error.message}</p>
        }
        return <p style={{ color: '#22C55E' }}>✅ No errors</p>
      })()}
    </div>
  )
}

function AuthGateDemo({ loggedIn }) {
  let content
  if (loggedIn) {
    content = (
      <div>
        <p style={{ color: '#22C55E' }}>🔓 Welcome back, Admin!</p>
        <span className="demo-badge green">Authenticated</span>
      </div>
    )
  } else {
    content = (
      <div>
        <p style={{ color: '#94a3b8' }}>🔒 Please log in to continue.</p>
        <span className="demo-badge red">Guest</span>
      </div>
    )
  }
  return (
    <div className="demo-card">
      <h4 style={{ color: '#60a5fa', marginBottom: 8 }}>4. Element Variables (Auth Gate)</h4>
      {content}
    </div>
  )
}

export default function ConditionalRenderingDemo() {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)
  const [renderKey, setRenderKey] = useState(0)

  const addItem = () => setItems(prev => [...prev, `Item ${prev.length + 1}`])

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Conditional Rendering — 4 Techniques</h3>
        <div className="demo-row">
          <span className="demo-badge blue">&&</span>
          <span className="demo-badge green">Ternary</span>
          <span className="demo-badge yellow">if/else</span>
          <span className="demo-badge red">Element variables</span>
        </div>
      </div>

      <LoadingDemo loading={loading} />
      <div className="demo-row">
        <button className="demo-btn" onClick={() => setLoading(l => !l)}>
          Toggle Loading ({loading ? 'ON' : 'OFF'})
        </button>
      </div>

      <EmptyStateDemo items={items} key={renderKey} />
      <div className="demo-row">
        <button className="demo-btn" onClick={addItem} disabled={items.length >= 3}>Add Item</button>
        <button className="demo-btn secondary" onClick={() => { setItems([]); setRenderKey(k => k + 1) }}>Clear List</button>
      </div>

      <ErrorStateDemo />

      <AuthGateDemo loggedIn={loggedIn} />
      <div className="demo-row">
        <button className="demo-btn" onClick={() => setLoggedIn(l => !l)}>
          Toggle Auth ({loggedIn ? 'Log Out' : 'Log In'})
        </button>
      </div>
    </div>
  )
}
