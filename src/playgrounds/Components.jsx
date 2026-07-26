function Greeting({ name }) {
  return (
    <div className="demo-card" style={{ borderLeft: '4px solid #22C55E' }}>
      <p>👋 Hello, <strong>{name}</strong>!</p>
      <span className="demo-badge blue">Greeting component</span>
    </div>
  )
}

function Wrapper({ title, children }) {
  return (
    <div className="demo-card" style={{ borderLeft: '4px solid #60a5fa' }}>
      <h4 style={{ marginBottom: 8, color: '#60a5fa' }}>{title}</h4>
      <div style={{ background: '#0F172A', padding: 12, borderRadius: 8 }}>
        {children}
      </div>
      <div className="demo-row" style={{ marginTop: 8 }}>
        <span className="demo-badge yellow">Wrapper / children prop</span>
      </div>
    </div>
  )
}

export default function ComponentsDemo() {
  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Component Reuse</h3>
        <p style={{ marginBottom: 12 }}>Same <code>Greeting</code> component rendered 4 times with different props:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Greeting name="Alice" />
          <Greeting name="Bob" />
          <Greeting name="Charlie" />
          <Greeting name="Diana" />
        </div>
      </div>

      <Wrapper title="Composition with Children">
        <p style={{ color: '#e2e8f0', marginBottom: 8 }}>This content is passed as <code>children</code>.</p>
        <Greeting name="Inside Wrapper" />
        <p style={{ color: '#94a3b8', marginTop: 8, fontSize: '0.85rem' }}>Nested components work inside children too!</p>
      </Wrapper>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 8 }}>Key Concept</h3>
        <p>Components are reusable functions returning JSX. Props pass data in. Children compose content inside.</p>
        <div className="demo-row">
          <span className="demo-badge green">Functional Component</span>
          <span className="demo-badge blue">Props</span>
          <span className="demo-badge yellow">children</span>
        </div>
      </div>
    </div>
  )
}
