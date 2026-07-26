import { useState } from 'react'

function Card({ header, body, footer }) {
  return (
    <div className="demo-card" style={{ padding: 0, overflow: 'hidden' }}>
      {header && (
        <div style={{ padding: '12px 20px', background: '#1E293B', borderBottom: '1px solid #475569' }}>
          {header}
        </div>
      )}
      {body && (
        <div style={{ padding: '16px 20px' }}>
          {body}
        </div>
      )}
      {footer && (
        <div style={{ padding: '10px 20px', background: '#1E293B', borderTop: '1px solid #475569', fontSize: '0.85rem', color: '#64748b' }}>
          {footer}
        </div>
      )}
    </div>
  )
}

const Tabs = {
  Container({ defaultTab, children }) {
    const [active, setActive] = useState(defaultTab || 0)
    const tabs = []
    const panels = []

    children.forEach(child => {
      if (child.type.name === 'Tab') tabs.push(child)
      if (child.type.name === 'Panel') panels.push(child)
    })

    return (
      <div>
        <div className="demo-row" style={{ gap: 0, margin: 0 }}>
          {tabs.map((tab, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              padding: '8px 20px', cursor: 'pointer',
              borderBottom: active === i ? '2px solid #22C55E' : '2px solid transparent',
              color: active === i ? '#22C55E' : '#94a3b8',
              fontFamily: 'var(--font-body)', fontWeight: active === i ? 700 : 400,
              transition: 'all 0.2s'
            }}>
              {tab.props.children}
            </div>
          ))}
        </div>
        <div style={{ padding: '16px 0' }}>
          {panels[active]}
        </div>
      </div>
    )
  },
  Tab: function Tab({ children }) { return children },
  Panel: function Panel({ children }) { return children },
}

export default function CompositionDemo() {
  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Slot Pattern (Card)</h3>
        <p style={{ color: '#94a3b8', marginBottom: 12 }}>
          <code>Card</code> receives <code>header</code>, <code>body</code>, <code>footer</code> as props.
        </p>
        <Card
          header={<h4 style={{ color: '#60a5fa' }}>🌟 Card Header</h4>}
          body={
            <div>
              <p style={{ color: '#e2e8f0' }}>This is the card body content.</p>
              <p style={{ color: '#94a3b8', marginTop: 4 }}>You can put any JSX here — components, text, images, etc.</p>
              <span className="demo-badge green">Reusable slot</span>
            </div>
          }
          footer={<span>Footer area — metadata or actions</span>}
        />
        <Card
          header={<h4 style={{ color: '#eab308' }}>⚡ Another Card</h4>}
          body={<p style={{ color: '#e2e8f0' }}>Same Card component, completely different content via slots.</p>}
        />
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Compound Component (Tabs)</h3>
        <p style={{ color: '#94a3b8', marginBottom: 12 }}>
          <code>Tabs.Container</code>, <code>Tabs.Tab</code>, <code>Tabs.Panel</code> work together via <code>children</code>.
        </p>
        <Tabs.Container defaultTab={0}>
          <Tabs.Tab>Overview</Tabs.Tab>
          <Tabs.Tab>Details</Tabs.Tab>
          <Tabs.Tab>Settings</Tabs.Tab>

          <Tabs.Panel>
            <p style={{ color: '#e2e8f0' }}>📋 Overview panel — shows summary information.</p>
            <span className="demo-badge blue">Tab 1 content</span>
          </Tabs.Panel>
          <Tabs.Panel>
            <p style={{ color: '#e2e8f0' }}>🔍 Details panel — more in-depth data here.</p>
            <span className="demo-badge yellow">Tab 2 content</span>
          </Tabs.Panel>
          <Tabs.Panel>
            <p style={{ color: '#e2e8f0' }}>⚙️ Settings panel — configuration options.</p>
            <span className="demo-badge green">Tab 3 content</span>
          </Tabs.Panel>
        </Tabs.Container>
      </div>
    </div>
  )
}
