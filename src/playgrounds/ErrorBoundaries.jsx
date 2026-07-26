import { Component, useState } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="demo-card" style={{
          border: '2px solid #EF4444',
          background: 'rgba(239, 68, 68, 0.05)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#EF4444', marginBottom: 8 }}>⚠️ Error Caught</h3>
          <p style={{ color: '#fca5a5', marginBottom: 12 }}>
            {this.state.error?.message || 'Something went wrong'}
          </p>
          <button className="demo-btn" onClick={() => this.setState({ hasError: false, error: null })}>
            Reset &amp; Recover
          </button>
          {this.props.children}
        </div>
      )
    }
    return this.props.children
  }
}

function BuggyComponent() {
  const [throwError, setThrowError] = useState(false)
  if (throwError) throw new Error('💥 Simulated crash! Click "Reset & Recover" to fix.')
  return (
    <div className="demo-card" style={{ textAlign: 'center' }}>
      <p style={{ color: '#e2e8f0', marginBottom: 8 }}>This component is working fine.</p>
      <button className="demo-btn danger" onClick={() => setThrowError(true)}>
        💣 Trigger Error
      </button>
    </div>
  )
}

export default function ErrorBoundariesDemo() {
  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Error Boundary Demo</h3>
        <p style={{ color: '#94a3b8', marginBottom: 12 }}>
          Wrapping <code>BuggyComponent</code> in <code>ErrorBoundary</code> catches thrown errors
          and shows fallback UI instead of crashing the whole app.
        </p>
        <div className="demo-row">
          <span className="demo-badge red">componentDidCatch</span>
          <span className="demo-badge blue">getDerivedStateFromError</span>
          <span className="demo-badge green">Fallback UI</span>
        </div>
      </div>

      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    </div>
  )
}
