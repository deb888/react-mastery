import { useState } from 'react'

export default function EventsDemo() {
  const [clickCount, setClickCount] = useState(0)
  const [lastKey, setLastKey] = useState('')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [log, setLog] = useState([])
  const [innerClicked, setInnerClicked] = useState(false)

  const addLog = (msg) => setLog(prev => [...prev.slice(-5), { msg, time: Date.now() }])

  const handleClick = (e) => {
    setClickCount(c => c + 1)
    addLog(`[click] type=${e.type} target=${e.target.tagName}`)
  }

  const handleKeyDown = (e) => {
    setLastKey(e.key)
    addLog(`[keydown] key="${e.key}" code="${e.code}"`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addLog('[submit] Form submitted (prevented default)')
  }

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleOuterClick = () => addLog('[outer] clicked (bubbled)')
  const handleMiddleClick = (e) => {
    addLog('[middle] clicked — stopping propagation')
    e.stopPropagation()
  }
  const handleInnerClick = (e) => {
    setInnerClicked(true)
    addLog('[inner] clicked')
    e.stopPropagation()
  }

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>onClick — Counter</h3>
        <p>Clicks: <span className="demo-badge blue">{clickCount}</span></p>
        <button className="demo-btn" onClick={handleClick}>Click Me</button>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>onKeyDown — Key Press</h3>
        <input className="demo-input" placeholder="Type any key..." onKeyDown={handleKeyDown} />
        <p style={{ marginTop: 4 }}>Last key: <span className="demo-badge yellow">{lastKey || '(none)'}</span></p>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>onSubmit — Form</h3>
        <form onSubmit={handleSubmit}>
          <div className="demo-row">
            <input className="demo-input" placeholder="Type and press Enter" />
            <button className="demo-btn" type="submit">Submit</button>
          </div>
        </form>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>onMouseMove — Coordinates</h3>
        <div onMouseMove={handleMouseMove} style={{
          padding: 20, background: '#0F172A', borderRadius: 8, height: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'crosshair'
        }}>
          <p>Mouse: <span className="demo-badge green">{mousePos.x}, {mousePos.y}</span></p>
        </div>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>stopPropagation — Nested Divs</h3>
        <div onClick={handleOuterClick} style={{ padding: 20, background: '#1E293B', borderRadius: 8, cursor: 'pointer' }}>
          Outer (logs on click)
          <div onClick={handleMiddleClick} style={{ padding: 16, background: '#334155', borderRadius: 6, marginTop: 8, cursor: 'pointer' }}>
            Middle (stops propagation)
            <div onClick={handleInnerClick} style={{ padding: 12, background: '#475569', borderRadius: 4, marginTop: 8, cursor: 'pointer' }}>
              Inner (stops propagation)
            </div>
          </div>
        </div>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Event Log</h3>
        <div style={{ maxHeight: 150, overflowY: 'auto', background: '#0F172A', padding: 8, borderRadius: 8 }}>
          {log.length === 0 && <p style={{ color: '#64748b', fontStyle: 'italic' }}>Interact with elements above...</p>}
          {log.map((entry, i) => (
            <div key={i} style={{ color: '#94a3b8', fontSize: '0.8rem', fontFamily: 'monospace' }}>
              ▸ {entry.msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
