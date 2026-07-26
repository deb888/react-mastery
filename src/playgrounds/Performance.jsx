import { useState, useMemo, useCallback, memo } from 'react'

const Item = memo(function Item({ item, onToggle }) {
  return (
    <li className="demo-row" style={{
      padding: '8px 12px', background: '#0F172A', borderRadius: 6, marginTop: 4
    }}>
      <input type="checkbox" checked={item.completed} onChange={() => onToggle(item.id)} />
      <span style={{
        flex: 1, color: '#e2e8f0',
        textDecoration: item.completed ? 'line-through' : 'none'
      }}>{item.text}</span>
      <span className="demo-badge" style={{ fontSize: '0.7rem' }}>Rendered</span>
    </li>
  )
})

export default function PerformanceDemo() {
  const [items, setItems] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build an app', completed: true },
    { id: 3, text: 'Optimize performance', completed: false },
  ])
  const [filter, setFilter] = useState('')
  const [trigger, setTrigger] = useState(0)
  const [nextId, setNextId] = useState(4)

  const filteredList = useMemo(() => {
    console.log('[useMemo] Filtering items...')
    return items.filter(i => i.text.toLowerCase().includes(filter.toLowerCase()))
  }, [items, filter])

  const handleToggle = useCallback((id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, completed: !i.completed } : i))
  }, [])

  const addItem = () => {
    setItems(prev => [...prev, { id: nextId, text: `Task ${nextId}`, completed: false }])
    setNextId(n => n + 1)
  }

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>React.memo — List Item</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>
          <code>Item</code> wrapped in <code>React.memo</code> — only re-renders when its props change.
        </p>
        <div className="demo-row">
          <input className="demo-input" placeholder="Filter items" value={filter} onChange={e => setFilter(e.target.value)} />
          <button className="demo-btn" onClick={addItem}>Add Item</button>
          <button className="demo-btn secondary" onClick={() => setTrigger(t => t + 1)}>
            Re-render Parent ({trigger})
          </button>
        </div>
        <ul style={{ marginTop: 8 }}>
          {filteredList.map(item => (
            <Item key={item.id} item={item} onToggle={handleToggle} />
          ))}
        </ul>
        <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 8 }}>
          Click "Re-render Parent" — memoized items don't re-render (check console).
        </p>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>useMemo + useCallback</h3>
        <div className="demo-row">
          <span className="demo-badge green">useMemo: filtered list</span>
          <span className="demo-badge blue">useCallback: stable toggle</span>
          <span className="demo-badge yellow">React.memo: Item</span>
        </div>
        <ul>
          <li style={{ color: '#94a3b8', marginTop: 8 }}>
            <code>filteredList</code> only re-computes when <code>items</code> or <code>filter</code> changes.
          </li>
          <li style={{ color: '#94a3b8' }}>
            <code>handleToggle</code> identity is stable across re-renders (same function reference).
          </li>
          <li style={{ color: '#94a3b8' }}>
            Combined with <code>React.memo</code>, items skip re-renders when parent re-renders.
          </li>
        </ul>
      </div>
    </div>
  )
}
