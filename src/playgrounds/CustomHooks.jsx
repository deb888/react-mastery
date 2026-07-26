import { useState, useEffect, useCallback } from 'react'

function useToggle(initial = false) {
  const [value, setValue] = useState(initial)
  const toggle = useCallback(() => setValue(v => !v), [])
  const setOn = useCallback(() => setValue(true), [])
  const setOff = useCallback(() => setValue(false), [])
  return { value, toggle, setOn, setOff }
}

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return size
}

function useCountdown(initial = 10) {
  const [count, setCount] = useState(initial)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running || count <= 0) return
    const id = setInterval(() => setCount(c => c - 1), 1000)
    return () => clearInterval(id)
  }, [running, count])

  const start = useCallback(() => { setCount(initial); setRunning(true) }, [initial])
  const stop = useCallback(() => setRunning(false), [])
  const reset = useCallback(() => { setRunning(false); setCount(initial) }, [initial])

  return { count, running, start, stop, reset }
}

export default function CustomHooksDemo() {
  const { value: toggleVal, toggle } = useToggle()
  const { width, height } = useWindowSize()
  const { count, running, start, stop, reset } = useCountdown(15)

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Custom Hook: useToggle</h3>
        <p>Toggle state: <span className={`demo-badge ${toggleVal ? 'green' : 'red'}`}>{toggleVal ? 'ON' : 'OFF'}</span></p>
        <button className="demo-btn" onClick={toggle}>Toggle</button>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Custom Hook: useWindowSize</h3>
        <p>Width: <span className="demo-badge blue">{width}px</span></p>
        <p>Height: <span className="demo-badge blue">{height}px</span></p>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Resize browser window to see updates</p>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Custom Hook: useCountdown</h3>
        <p>Count: <span className={`demo-badge ${count <= 5 ? 'red' : count <= 10 ? 'yellow' : 'green'}`}>{count}</span></p>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Status: {running ? '⏳ Running' : '⏸️ Paused'}</p>
        <div className="demo-row">
          <button className="demo-btn" onClick={start} disabled={running}>Start</button>
          <button className="demo-btn secondary" onClick={stop} disabled={!running}>Stop</button>
          <button className="demo-btn danger" onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  )
}
