function withLogger(WrappedComponent) {
  return function LoggedComponent(props) {
    console.log(`[withLogger] Rendering ${WrappedComponent.name || 'Component'}`, props)
    return (
      <div style={{ position: 'relative' }}>
        <WrappedComponent {...props} />
        <span className="demo-badge green" style={{ position: 'absolute', top: -8, right: 8, fontSize: '0.7rem' }}>
          Logged
        </span>
      </div>
    )
  }
}

function withBorder(color = '#3b82f6') {
  return function (WrappedComponent) {
    return function BorderedComponent(props) {
      return (
        <div style={{ border: `2px solid ${color}`, borderRadius: 8, padding: 4 }}>
          <WrappedComponent {...props} />
        </div>
      )
    }
  }
}

function Hello({ name = 'World' }) {
  return (
    <div style={{ padding: '16px 20px', background: '#0F172A', borderRadius: 6 }}>
      <p style={{ color: '#e2e8f0' }}>Hello, <strong style={{ color: '#22C55E' }}>{name}</strong>!</p>
    </div>
  )
}

const LoggedHello = withLogger(Hello)
const BorderedHello = withBorder('#22C55E')(Hello)
const ComposedHello = withBorder('#eab308')(withLogger(Hello))

export default function HocDemo() {
  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>HOC: withLogger</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>Logs renders to console. Shows "Logged" badge.</p>
        <LoggedHello name="Alice" />
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>HOC: withBorder</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>Wraps component with a colored border.</p>
        <BorderedHello name="Bob" />
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Composed HOCs</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>
          <code>withBorder(yellow)(withLogger(Hello))</code> — both effects combined.
        </p>
        <ComposedHello name="Charlie" />
      </div>
    </div>
  )
}
