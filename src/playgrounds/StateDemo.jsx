import { useState } from 'react'

export default function StateDemo() {
  const [count, setCount] = useState(0)
  const [dark, setDark] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [items, setItems] = useState(['Learn React', 'Build something'])

  const addItem = () => {
    const next = `Item ${items.length + 1}`
    setItems([...items, next])
  }

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>useState — Counter</h3>
        <p>Count: <span className="demo-badge blue">{count}</span></p>
        <div className="demo-row">
          <button className="demo-btn" onClick={() => setCount(c => c + 1)}>+</button>
          <button className="demo-btn danger" onClick={() => setCount(c => c - 1)}>−</button>
          <button className="demo-btn secondary" onClick={() => setCount(0)}>Reset</button>
        </div>
      </div>

      <div className="demo-card" style={{ background: dark ? '#0F172A' : '#FFFFFF', transition: '0.3s' }}>
        <h3 style={{ color: dark ? '#22C55E' : '#1E293B', marginBottom: 12 }}>useState — Toggle (dark/light)</h3>
        <p style={{ color: dark ? '#94a3b8' : '#475569' }}>Current theme: <span className={`demo-badge ${dark ? 'green' : 'yellow'}`}>{dark ? 'Dark' : 'Light'}</span></p>
        <button className="demo-btn" onClick={() => setDark(d => !d)}>Toggle Theme</button>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>useState — Object (form)</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>Spread <code>{'...prev'}</code> to merge updated field.</p>
        <div className="demo-row">
          <input className="demo-input" placeholder="Name" value={form.name} onChange={e => updateForm('name', e.target.value)} />
          <input className="demo-input" placeholder="Email" value={form.email} onChange={e => updateForm('email', e.target.value)} />
        </div>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 8 }}>
          Name: <strong>{form.name || '(empty)'}</strong> &nbsp;|&nbsp; Email: <strong>{form.email || '(empty)'}</strong>
        </p>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>useState — Array</h3>
        <div className="demo-row">
          <button className="demo-btn" onClick={addItem}>Add Item</button>
        </div>
        <ul style={{ marginTop: 8, color: '#e2e8f0' }}>
          {items.map((item, i) => (
            <li key={i} style={{ margin: '4px 0' }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
