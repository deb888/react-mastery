import { useState, useRef, useEffect } from 'react'

export default function RefsDemo() {
  const inputRef = useRef(null)
  const [name, setName] = useState('')
  const [count, setCount] = useState(0)
  const prevCountRef = useRef(0)
  const renderCount = useRef(1)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    prevCountRef.current = count
  })

  useEffect(() => {
    renderCount.current += 1
  })

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>useRef — Auto-Focus Input</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>Input auto-focuses on mount via <code>inputRef.current.focus()</code></p>
        <div className="demo-row">
          <input ref={inputRef} className="demo-input" placeholder="Type here (auto-focused)" value={name} onChange={e => setName(e.target.value)} />
          <button className="demo-btn" onClick={() => inputRef.current?.focus()}>Focus Input</button>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 4 }}>Typed: {name || '(empty)'}</p>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>useRef — Previous State Tracker</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>Previous value stored via <code>prevCountRef.current = count</code> in useEffect.</p>
        <p>Current: <span className="demo-badge blue">{count}</span></p>
        <p>Previous: <span className="demo-badge yellow">{prevCountRef.current}</span></p>
        <div className="demo-row">
          <button className="demo-btn" onClick={() => setCount(c => c + 1)}>Increment</button>
          <button className="demo-btn secondary" onClick={() => setCount(0)}>Reset</button>
        </div>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>useRef — Render Counter (no re-render)</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>Mutating <code>.current</code> does NOT trigger re-render.</p>
        <p>Component has rendered: <span className="demo-badge green">{renderCount.current} times</span></p>
        <div className="demo-row">
          <button className="demo-btn" onClick={() => setCount(c => c + 1)}>Trigger Re-render</button>
        </div>
      </div>
    </div>
  )
}
