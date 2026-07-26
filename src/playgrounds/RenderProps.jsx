import { useState, useEffect } from 'react'

function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return children(pos)
}

function DataProvider({ url, render }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setData({ url, items: ['Item A', 'Item B', 'Item C'], timestamp: Date.now() })
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [url])

  if (loading) return <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Loading data from {url}...</p>
  return render(data)
}

export default function RenderPropsDemo() {
  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Render Props: MouseTracker</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>
          <code>MouseTracker</code> calls <code>children(x, y)</code> with mouse position.
        </p>
        <MouseTracker>
          {({ x, y }) => (
            <div style={{
              padding: 20, background: '#0F172A', borderRadius: 8,
              border: '1px solid #475569', textAlign: 'center'
            }}>
              <p>Mouse is at <span className="demo-badge blue">{x}, {y}</span></p>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', background: '#22C55E',
                position: 'fixed', left: x - 8, top: y - 8, pointerEvents: 'none',
                opacity: 0.6, transform: 'scale(1.5)'
              }} />
            </div>
          )}
        </MouseTracker>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Render Props: DataProvider</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>
          <code>DataProvider</code> accepts <code>url</code> prop and <code>render</code> render prop.
        </p>
        <DataProvider
          url="/api/users"
          render={(data) => (
            <div style={{ background: '#0F172A', padding: 12, borderRadius: 8 }}>
              <p style={{ color: '#22C55E', marginBottom: 4 }}>Data from: <code>{data.url}</code></p>
              <ul>
                {data.items.map((item, i) => (
                  <li key={i} style={{ color: '#e2e8f0', margin: '2px 0' }}>{item}</li>
                ))}
              </ul>
              <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Fetched at: {new Date(data.timestamp).toLocaleTimeString()}</p>
            </div>
          )}
        />
      </div>
    </div>
  )
}
