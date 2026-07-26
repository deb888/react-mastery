import { useState } from 'react'

let nextId = 5

const initial = [
  { id: 1, text: 'Apples', checked: false },
  { id: 2, text: 'Bananas', checked: true },
  { id: 3, text: 'Cherries', checked: false },
  { id: 4, text: 'Dates', checked: false },
]

function ListCorrect() {
  const [items, setItems] = useState(initial.map(i => ({ ...i })))
  const [filter, setFilter] = useState('')

  const toggle = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))

  const addItem = () => {
    setItems(prev => [...prev, { id: nextId++, text: `Item ${nextId}`, checked: false }])
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const filtered = items.filter(i => i.text.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h4 style={{ color: '#22C55E', marginBottom: 8 }}>✅ Correct (stable key = id)</h4>
      <div className="demo-row">
        <input className="demo-input" placeholder="Filter items" value={filter} onChange={e => setFilter(e.target.value)} />
        <button className="demo-btn" onClick={addItem}>Add Item</button>
      </div>
      <ul>
        {filtered.map(item => (
          <li key={item.id} className="demo-row" style={{ padding: '4px 0' }}>
            <input type="checkbox" checked={item.checked} onChange={() => toggle(item.id)} />
            <span style={{ flex: 1, color: '#e2e8f0', textDecoration: item.checked ? 'line-through' : 'none' }}>
              {item.text}
            </span>
            <button className="demo-btn danger" style={{ padding: '2px 10px', fontSize: '0.8rem' }} onClick={() => removeItem(item.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ListIncorrect() {
  const [items, setItems] = useState(initial.map(i => ({ ...i })))
  const [filter, setFilter] = useState('')

  const toggle = (index) => setItems(prev => prev.map((i, idx) => idx === index ? { ...i, checked: !i.checked } : i))

  const addItem = () => {
    setItems(prev => [...prev, { id: nextId++, text: `Item ${nextId}`, checked: false }])
  }

  const removeItem = (index) => setItems(prev => prev.filter((_, idx) => idx !== index))

  const filtered = items.filter(i => i.text.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h4 style={{ color: '#EF4444', marginBottom: 8 }}>❌ Incorrect (index as key)</h4>
      <div className="demo-row">
        <input className="demo-input" placeholder="Filter items" value={filter} onChange={e => setFilter(e.target.value)} />
        <button className="demo-btn" onClick={addItem}>Add Item</button>
      </div>
      <ul>
        {filtered.map((item, index) => (
          <li key={index} className="demo-row" style={{ padding: '4px 0' }}>
            <input type="checkbox" checked={item.checked} onChange={() => toggle(index)} />
            <span style={{ flex: 1, color: '#e2e8f0', textDecoration: item.checked ? 'line-through' : 'none' }}>
              {item.text}
            </span>
            <button className="demo-btn danger" style={{ padding: '2px 10px', fontSize: '0.8rem' }} onClick={() => removeItem(index)}>✕</button>
          </li>
        ))}
      </ul>
      <p style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: 4 }}>
        ⚠️ Check some boxes, then use filter. Index-based keys cause checkbox state to shift to wrong items!
      </p>
    </div>
  )
}

export default function ListsKeysDemo() {
  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Lists &amp; Keys — Correct vs Index</h3>
        <p style={{ color: '#94a3b8', marginBottom: 12 }}>
          Side-by-side comparison. Check some boxes, then filter or reorder. The index-keyed list will show incorrect checkbox state.
        </p>
        <div className="demo-row" style={{ marginBottom: 8 }}>
          <span className="demo-badge green">Stable key (id)</span>
          <span className="demo-badge red">Index key</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ListCorrect />
        <ListIncorrect />
      </div>
    </div>
  )
}
