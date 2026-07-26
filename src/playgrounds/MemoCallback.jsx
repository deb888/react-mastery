import { useState, useMemo, useCallback, memo } from 'react'

function factorial(n) {
  if (n <= 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

const ExpensiveList = memo(function ExpensiveList({ items, onRemove }) {
  return (
    <ul style={{ marginTop: 8 }}>
      {items.map(item => (
        <li key={item.id} className="demo-row" style={{ padding: '4px 0' }}>
          <span style={{ flex: 1, color: '#e2e8f0' }}>{item.name}</span>
          <button className="demo-btn danger" style={{ padding: '2px 10px', fontSize: '0.8rem' }} onClick={() => onRemove(item.id)}>✕</button>
        </li>
      ))}
    </ul>
  )
})

export default function MemoCallbackDemo() {
  const [num, setNum] = useState(5)
  const [items, setItems] = useState([
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
  ])
  const [trigger, setTrigger] = useState(0)

  const factResult = useMemo(() => {
    console.log('Computing factorial...')
    return factorial(num)
  }, [num])

  const handleRemove = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>useMemo — Expensive Computation</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>Factorial is <code>{num}!</code> only re-computes when <code>num</code> changes.</p>
        <div className="demo-row">
          <input className="demo-input" type="number" min="0" max="20" value={num} onChange={e => setNum(Number(e.target.value))} style={{ width: 80 }} />
          <span className="demo-badge green">{num}! = {factResult.toLocaleString()}</span>
        </div>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>React.memo + useCallback</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>
          <code>ExpensiveList</code> wrapped in <code>React.memo</code> — only re-renders when props change.
          <code>onRemove</code> is stable via <code>useCallback</code>.
        </p>
        <ExpensiveList items={items} onRemove={handleRemove} />
        <div className="demo-row" style={{ marginTop: 8 }}>
          <button className="demo-btn secondary" onClick={() => setTrigger(t => t + 1)}>Re-render Parent ({trigger})</button>
          <span className="demo-badge yellow">Parent re-render won't re-render list</span>
        </div>
      </div>
    </div>
  )
}
