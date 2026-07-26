function UserCard({ name = 'Unknown', role = 'User', avatar, bio = 'No bio available' }) {
  return (
    <div className="demo-card" style={{ borderLeft: '4px solid #3b82f6', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{
        width: 60, height: 60, borderRadius: '50%', background: '#1E293B',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', border: '2px solid #3b82f6', flexShrink: 0
      }}>
        {avatar || '👤'}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ color: '#60a5fa', margin: 0 }}>{name} <span className="demo-badge blue">{role}</span></h4>
        <p style={{ color: '#94a3b8', marginTop: 4, fontSize: '0.9rem' }}>{bio}</p>
      </div>
    </div>
  )
}

export default function PropsDemo() {
  const baseProps = { name: 'Sam Wilson', role: 'Developer', avatar: '🦅', bio: 'Frontend specialist.' }
  const extraProps = { hobby: 'Photography', location: 'NYC' }

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Destructured Props with Defaults</h3>
        <p style={{ marginBottom: 12, color: '#94a3b8' }}>
          <code>UserCard</code> destructures <code>name</code>, <code>role</code>, <code>avatar</code>, <code>bio</code> — all with default params.
        </p>
        <UserCard name="Alice Chen" role="Architect" avatar="🏗️" bio="Designs scalable systems." />
        <UserCard name="Bob Smith" role="Designer" avatar="🎨" bio="Loves clean UIs." />
        <UserCard />
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Spread Props</h3>
        <p style={{ marginBottom: 12, color: '#94a3b8' }}>
          Spreading <code>{'{...baseProps}'}</code> passes all properties as individual props.
        </p>
        <UserCard {...baseProps} />
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 8 }}>
          Extra props like hobby, location exist in the object but aren't destructured — they're ignored.
        </p>
        <div className="demo-row">
          <span className="demo-badge green">Destructuring</span>
          <span className="demo-badge yellow">Default Params</span>
          <span className="demo-badge blue">Spread Props</span>
        </div>
      </div>
    </div>
  )
}
