import { useState } from 'react'

export default function JsxBasics() {
  const [count, setCount] = useState(0)
  const name = 'React Learner'
  const getGreeting = () => 'Hello from a function call!'
  const isLoggedIn = true
  const dynamicStyle = { color: '#22C55E', fontWeight: 'bold', fontSize: '1.2rem' }

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ marginBottom: 12, color: '#22C55E' }}>Rendering Variables</h3>
        <p>Name variable: <strong>{name}</strong></p>
        <p>Count from state: <span className="demo-badge blue">{count}</span></p>
        <div className="demo-row">
          <button className="demo-btn" onClick={() => setCount(c => c + 1)}>+1</button>
        </div>
      </div>

      <div className="demo-card">
        <h3 style={{ marginBottom: 12, color: '#22C55E' }}>Function Call Expression</h3>
        <p>{getGreeting()}</p>
        <p>Math in JSX: <strong>{2 + 3 * 4}</strong></p>
      </div>

      <div className="demo-card">
        <h3 style={{ marginBottom: 12, color: '#22C55E' }}>Ternary Operator</h3>
        <p>User is: <span className={`demo-badge ${isLoggedIn ? 'green' : 'red'}`}>{isLoggedIn ? 'Logged In' : 'Logged Out'}</span></p>
        <p>Count {count > 5 ? 'is greater than 5' : 'is 5 or less'}</p>
      </div>

      <div className="demo-card">
        <h3 style={{ marginBottom: 12, color: '#22C55E' }}>className &amp; style Prop</h3>
        <p className="demo-badge green">This uses className="demo-badge green"</p>
        <p style={dynamicStyle}>This uses inline style object (green, bold, large)</p>
        <p style={{ background: '#1E293B', padding: '8px 12px', borderRadius: 8, color: '#94a3b8' }}>Another styled element</p>
      </div>

      <div className="demo-card">
        <h3 style={{ marginBottom: 12, color: '#22C55E' }}>Fragment &amp; Self-Closing Tags</h3>
        <>
          <p>This content is wrapped in a fragment (no extra DOM node).</p>
          <br />
          <p>Above us is a self-closing &lt;br /&gt; tag.</p>
        </>
        <hr style={{ margin: '12px 0', borderColor: '#475569' }} />
        <p>Horizontal rule above is also self-closing.</p>
        <input className="demo-input" placeholder="Self-closing input" readOnly value="Self-closing <input />" style={{ width: '100%', marginTop: 8 }} />
      </div>
    </div>
  )
}
