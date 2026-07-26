import { useReducer, useState } from 'react'

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 }
    case 'decrement': return { count: state.count - 1 }
    case 'reset': return { count: 0 }
    default: return state
  }
}

function todoReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now(), text: action.text, completed: false }]
    case 'toggle':
      return state.map(t => t.id === action.id ? { ...t, completed: !t.completed } : t)
    case 'remove':
      return state.filter(t => t.id !== action.id)
    default:
      return state
  }
}

export default function ReducersDemo() {
  const [counter, dispatch] = useReducer(counterReducer, { count: 0 })
  const [todos, dispatchTodo] = useReducer(todoReducer, [])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (!input.trim()) return
    dispatchTodo({ type: 'add', text: input })
    setInput('')
  }

  return (
    <div className="playground-demo">
      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>useReducer — Counter</h3>
        <p>Count: <span className="demo-badge blue">{counter.count}</span></p>
        <div className="demo-row">
          <button className="demo-btn" onClick={() => dispatch({ type: 'increment' })}>+</button>
          <button className="demo-btn danger" onClick={() => dispatch({ type: 'decrement' })}>−</button>
          <button className="demo-btn secondary" onClick={() => dispatch({ type: 'reset' })}>Reset</button>
        </div>
      </div>

      <div className="demo-card">
        <h3 style={{ color: '#22C55E', marginBottom: 12 }}>useReducer — Todo List</h3>
        <p className="demo-row" style={{ color: '#94a3b8', marginBottom: 8 }}>
          Actions: <code>add</code>, <code>toggle</code>, <code>remove</code>
        </p>
        <div className="demo-row">
          <input className="demo-input" placeholder="New todo" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()} />
          <button className="demo-btn" onClick={addTodo}>Add</button>
        </div>
        <ul style={{ marginTop: 12 }}>
          {todos.map(t => (
            <li key={t.id} className="demo-row" style={{
              padding: '8px 12px', background: '#0F172A', borderRadius: 8,
              marginTop: 4, textDecoration: t.completed ? 'line-through' : 'none',
              color: t.completed ? '#64748b' : '#e2e8f0'
            }}>
              <span style={{ flex: 1, cursor: 'pointer' }} onClick={() => dispatchTodo({ type: 'toggle', id: t.id })}>
                {t.completed ? '✅' : '⬜'} {t.text}
              </span>
              <button className="demo-btn danger" style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                onClick={() => dispatchTodo({ type: 'remove', id: t.id })}>✕</button>
            </li>
          ))}
        </ul>
        {todos.length === 0 && <p style={{ color: '#64748b', fontStyle: 'italic' }}>No todos yet. Add one above!</p>}
      </div>
    </div>
  )
}
