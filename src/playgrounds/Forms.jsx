import { useState, useRef } from 'react'

function ControlledForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      setSubmitted(true)
    }
  }

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  if (submitted) {
    return (
      <div style={{ padding: 16, background: '#0F172A', borderRadius: 8, textAlign: 'center' }}>
        <p style={{ color: '#22C55E', fontSize: '1.1rem' }}>✅ Form submitted successfully!</p>
        <p style={{ color: '#94a3b8' }}>Name: {form.name} | Email: {form.email}</p>
        <p style={{ color: '#94a3b8' }}>Message: {form.message}</p>
        <button className="demo-btn secondary" style={{ marginTop: 8 }} onClick={() => { setForm({ name: '', email: '', message: '' }); setErrors({}); setSubmitted(false) }}>
          Reset Form
        </button>
      </div>
    )
  }

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }

  return (
    <div>
      <h4 style={{ color: '#60a5fa', marginBottom: 12 }}>Controlled Form (useState)</h4>
      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Name</label>
          <input className="demo-input" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" />
          {errors.name && <span style={{ color: '#EF4444', fontSize: '0.8rem' }}>{errors.name}</span>}
        </div>
        <div style={fieldStyle}>
          <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Email</label>
          <input className="demo-input" value={form.email} onChange={e => update('email', e.target.value)} placeholder="email@example.com" />
          {errors.email && <span style={{ color: '#EF4444', fontSize: '0.8rem' }}>{errors.email}</span>}
        </div>
        <div style={fieldStyle}>
          <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Message</label>
          <textarea className="demo-input" value={form.message} onChange={e => update('message', e.target.value)} placeholder="Your message" rows={3} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
          {errors.message && <span style={{ color: '#EF4444', fontSize: '0.8rem' }}>{errors.message}</span>}
        </div>
        <button className="demo-btn" type="submit">Submit</button>
      </form>
    </div>
  )
}

function UncontrolledForm() {
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const [result, setResult] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setResult({
      name: nameRef.current.value,
      email: emailRef.current.value
    })
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h4 style={{ color: '#eab308', marginBottom: 12 }}>Uncontrolled Form (useRef)</h4>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
          <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Name</label>
          <input ref={nameRef} className="demo-input" defaultValue="" placeholder="Your name" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
          <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Email</label>
          <input ref={emailRef} className="demo-input" defaultValue="" placeholder="email@example.com" />
        </div>
        <button className="demo-btn secondary" type="submit">Submit (Uncontrolled)</button>
      </form>
      {result && (
        <p style={{ color: '#eab308', marginTop: 8, fontSize: '0.9rem' }}>
          Submitted: {result.name} — {result.email}
        </p>
      )}
    </div>
  )
}

export default function FormsDemo() {
  return (
    <div className="playground-demo">
      <div className="demo-card">
        <ControlledForm />
      </div>
      <div className="demo-card">
        <UncontrolledForm />
      </div>
    </div>
  )
}
