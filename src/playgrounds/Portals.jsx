import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function ModalContent({ onClose }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  return createPortal(
    <div ref={overlayRef} onClick={handleOverlayClick} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="demo-card" style={{
        maxWidth: 420, width: '90%', position: 'relative',
        border: '2px solid #22C55E'
      }}>
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>🚪 Portal Modal</h3>
        <p style={{ color: '#e2e8f0', marginBottom: 16 }}>
          This modal is rendered via <code>createPortal</code> to <code>document.body</code>.
          Click overlay background or press Esc to close.
        </p>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 16 }}>
          Event bubbling: overlay click handler checks <code>e.target === overlayRef.current</code>.
        </p>
        {/*
          Focus trap note: In production, add focus trap logic here.
          Use a focusable container + tab cycling for full accessibility.
        */}
        <div className="demo-row">
          <button className="demo-btn" autoFocus>Focusable 1</button>
          <button className="demo-btn secondary">Focusable 2</button>
          <button className="demo-btn danger" onClick={onClose}>Close</button>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 12 }}>
          Note: Focus trap not implemented — add for production use.
        </p>
      </div>
    </div>,
    document.body
  )
}

export default function PortalsDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>createPortal Demo</h3>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>
          <code>createPortal</code> renders the modal outside the DOM hierarchy (direct child of body)
          but still within the React tree — events bubble normally.
        </p>
        <div className="demo-row">
          <button className="demo-btn" onClick={() => setOpen(true)}>
            Open Portal Modal
          </button>
          <span className="demo-badge blue">createPortal</span>
          <span className="demo-badge green">document.body</span>
        </div>
      </div>

      {open && <ModalContent onClose={() => setOpen(false)} />}
    </div>
  )
}
