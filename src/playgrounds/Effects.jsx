import { useState, useEffect } from 'react'

function MouseTracker() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <div style={{ padding: '12px 16px', background: '#0F172A', borderRadius: 8, marginTop: 8 }}>
      <p>Mouse position: <span className="demo-badge blue">{pos.x}, {pos.y}</span></p>
      <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Listener added/cleaned via effect cleanup.</p>
    </div>
  )
}

function Countdown() {
  const [time, setTime] = useState(30)

  useEffect(() => {
    if (time <= 0) return
    const id = setInterval(() => setTime(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [time])

  return (
    <div style={{ padding: '12px 16px', background: '#0F172A', borderRadius: 8, marginTop: 8 }}>
      <p>Countdown: <span className={`demo-badge ${time <= 5 ? 'red' : time <= 15 ? 'yellow' : 'green'}`}>{time}s</span></p>
      {time === 0 && <p style={{ color: '#22C55E' }}>⏰ Time's up!</p>}
    </div>
  )
}

export default function EffectsDemo() {
  const [count, setCount] = useState(0)
  const [effectLog, setEffectLog] = useState([])

  useEffect(() => {
    document.title = 'React Mastery'
    setEffectLog(prev => [...prev, 'Document title set to "React Mastery"'])
  }, [])

  useEffect(() => {
    setEffectLog(prev => [...prev, `Count changed to ${count}`])
  }, [count])

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>useEffect — Empty Deps []</h3>
        <p>Sets document title once on mount.</p>
        <span className="demo-badge green">See browser tab title</span>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>useEffect — With Deps [count]</h3>
        <p>Count: <span className="demo-badge blue">{count}</span></p>
        <div className="demo-row">
          <button className="demo-btn" onClick={() => setCount(c => c + 1)}>Increment</button>
        </div>
        <div style={{ marginTop: 8, maxHeight: 120, overflowY: 'auto', background: '#0F172A', padding: 8, borderRadius: 8, fontSize: '0.8rem', color: '#94a3b8' }}>
          {effectLog.slice(-6).map((entry, i) => <div key={i}>▸ {entry}</div>)}
        </div>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>useEffect — Cleanup (Mouse Move)</h3>
        <MouseTracker />
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>useEffect — Cleanup (Interval)</h3>
        <Countdown />
      </div>
    </div>
  )
}
