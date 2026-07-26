import { useState, useEffect, useRef, useCallback } from 'react'

function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const execute = useCallback(() => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)
    setData(null)

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        if (controller.signal.aborted) {
          resolve()
          return
        }
        if (url.includes('error')) {
          setError(new Error('Simulated fetch error'))
        } else {
          setData({ message: `Response from ${url}`, items: ['Alpha', 'Beta', 'Gamma'], timestamp: Date.now() })
        }
        setLoading(false)
        resolve()
      }, 2000)

      controller.signal.addEventListener('abort', () => {
        clearTimeout(timeout)
        setLoading(false)
        resolve()
      })
    })
  }, [url])

  const cancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
      setError(new Error('Request aborted'))
    }
  }, [])

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  return { data, loading, error, execute, cancel }
}

export default function DataFetchingDemo() {
  const [url, setUrl] = useState('/api/data')
  const { data, loading, error, execute, cancel } = useFetch(url)
  const [autoFetch, setAutoFetch] = useState(false)

  useEffect(() => {
    if (autoFetch) execute()
  }, [autoFetch, execute])

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>Custom Hook: useFetch</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>
          Simulated fetch with loading, error, success states. Supports abort via AbortController.
        </p>
        <div className="demo-row">
          <span className="demo-badge blue">useState</span>
          <span className="demo-badge green">useEffect</span>
          <span className="demo-badge yellow">useRef</span>
          <span className="demo-badge red">useCallback</span>
          <span className="demo-badge">AbortController</span>
        </div>
      </div>

      <div className="demo-card">
        <div className="demo-row">
          <select className="demo-input" value={url} onChange={e => setUrl(e.target.value)}>
            <option value="/api/data">/api/data (success)</option>
            <option value="/api/error">/api/error (simulated error)</option>
          </select>
          <button className="demo-btn" onClick={execute} disabled={loading}>Fetch</button>
          <button className="demo-btn danger" onClick={cancel} disabled={!loading}>Cancel</button>
        </div>

        {loading && (
          <div style={{ marginTop: 12, padding: 20, background: '#0F172A', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ color: '#eab308' }}>⏳ Loading...</p>
            <button className="demo-btn secondary" onClick={cancel} style={{ marginTop: 8 }}>Abort Request</button>
          </div>
        )}

        {error && (
          <div style={{ marginTop: 12, padding: 16, background: 'rgba(239,68,68,0.05)', borderRadius: 8, border: '1px solid #EF4444', textAlign: 'center' }}>
            <p style={{ color: '#EF4444' }}>⚠️ {error.message}</p>
            <button className="demo-btn" onClick={execute} style={{ marginTop: 8 }}>Retry</button>
          </div>
        )}

        {data && (
          <div style={{ marginTop: 12, padding: 16, background: '#0F172A', borderRadius: 8 }}>
            <p style={{ color: '#22C55E' }}>{data.message}</p>
            <ul style={{ marginTop: 8 }}>
              {data.items.map((item, i) => (
                <li key={i} style={{ color: '#e2e8f0', margin: '2px 0' }}>{item}</li>
              ))}
            </ul>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 8 }}>
              Fetched at: {new Date(data.timestamp).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>

      <div className="demo-card">
        <h4 style={{ color: '#60a5fa', marginBottom: 8 }}>Auto-fetch on Mount</h4>
        <div className="demo-row">
          <button className={`demo-btn ${autoFetch ? 'danger' : ''}`} onClick={() => setAutoFetch(a => !a)}>
            {autoFetch ? 'Disable Auto-fetch' : 'Enable Auto-fetch'}
          </button>
          <span className="demo-badge yellow">{autoFetch ? 'ON' : 'OFF'}</span>
        </div>
        {autoFetch && <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>Auto-fetch fires on mount and URL change.</p>}
      </div>
    </div>
  )
}
