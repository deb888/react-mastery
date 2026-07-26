import { Component, useState, Suspense, lazy } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="demo-card" style={{ border: '2px solid #EF4444', textAlign: 'center' }}>
          <h3 style={{ color: '#EF4444' }}>Error: {this.state.error?.message}</h3>
          <button className="demo-btn" onClick={() => { this.setState({ hasError: false, error: null }); this.props.onReset?.() }}>
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const LazyComponent = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: function HeavyComponent() {
          return (
            <div style={{
              padding: 20, background: '#0F172A', borderRadius: 8,
              border: '1px solid #22C55E', textAlign: 'center'
            }}>
              <p style={{ color: '#22C55E', fontSize: '1.1rem' }}>✅ Lazy Component Loaded!</p>
              <p style={{ color: '#94a3b8', marginTop: 4 }}>
                This module was loaded asynchronously after a simulated delay.
              </p>
            </div>
          )
        }
      })
    }, 2000)
  })
})

function AsyncDataComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchData = () => {
    setLoading(true)
    setData(null)
    setTimeout(() => {
      setData({ message: 'Hello from async data!', timestamp: Date.now() })
      setLoading(false)
    }, 2000)
  }

  if (loading) return <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Loading data...</p>

  return (
    <div>
      {!data && <button className="demo-btn" onClick={fetchData}>Load Async Data</button>}
      {data && (
        <div style={{ padding: 16, background: '#0F172A', borderRadius: 8, marginTop: 8 }}>
          <p style={{ color: '#22C55E' }}>{data.message}</p>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Loaded at: {new Date(data.timestamp).toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  )
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="demo-card" style={{ border: '2px solid #EF4444', textAlign: 'center' }}>
      <h3 style={{ color: '#EF4444' }}>Error: {error.message}</h3>
      <button className="demo-btn" onClick={resetErrorBoundary}>Retry</button>
    </div>
  )
}

export default function SuspenseDemo() {
  const [showLazy, setShowLazy] = useState(false)
  const [key, setKey] = useState(0)

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Suspense + lazy()</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>
          <code>lazy(() =&gt; import(...))</code> loads component on-demand.
          <code>Suspense</code> shows fallback while loading.
        </p>
        <div className="demo-row">
          <button className="demo-btn" onClick={() => { setShowLazy(true); setKey(k => k + 1) }}>
            Load Lazy Component
          </button>
          {showLazy && (
            <ErrorBoundary onReset={() => setShowLazy(false)}>
              <Suspense fallback={
                <div style={{ padding: 20, textAlign: 'center', color: '#64748b' }}>
                  ⏳ Loading lazy component...
                </div>
              }>
                <LazyComponent key={key} />
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Simulated Async Data</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>
          Using setTimeout + loading state to simulate async data fetching with Suspense-like UX.
        </p>
        <AsyncDataComponent />
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Suspense + ErrorBoundary Combo</h3>
        <p style={{ color: '#94a3b8' }}>
          Wrapping <code>Suspense</code> in an <code>ErrorBoundary</code> handles both loading and error states gracefully.
        </p>
        <div className="demo-row" style={{ marginTop: 8 }}>
          <span className="demo-badge green">Suspense fallback</span>
          <span className="demo-badge red">ErrorBoundary</span>
          <span className="demo-badge yellow">lazy()</span>
        </div>
      </div>
    </div>
  )
}
