# State

## Overview

State = component's memory. Data that changes over time. Triggers re-render when updated.

## `useState` Hook

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

### Array destructuring

`useState(initialValue)` returns array of two items:
- `[0]` — current state value
- `[1]` — setter function

### Multiple state variables

```jsx
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
}
```

## Functional Updates

When new state depends on previous state.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(prev => prev + 1);  // safe in all cases
    setCount(prev => prev + 1);  // increments by 2
  };
}
```

**Why**: State updates are batched. Without functional update, multiple calls use stale value.

## State Batching

React 18+ batches all state updates (event handlers, timeouts, effects).

```jsx
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // Single re-render with both updates applied
}
```

In React <18, only event handlers batched by default.

## Lazy Initialization

Pass function to `useState` for expensive initial computation. Runs once.

```jsx
function Expensive() {
  // Computed only on first render
  const [data, setData] = useState(() => {
    const items = computeExpensiveValue();
    return items;
  });
}
```

## Rules of Hooks

1. **Call hooks at top level** — not inside loops, conditions, or nested functions.
2. **Only call from React functions** — function components or custom hooks.

```jsx
// WRONG — conditional hook
if (isEnabled) {
  const [value, setValue] = useState(0);
}

// WRONG — inside loop
for (let i = 0; i < items.length; i++) {
  const [val, setVal] = useState(items[i]);
}

// RIGHT — always called, same order every render
function Component() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
}
```

## Props vs State

| Feature | Props | State |
|---------|-------|-------|
| Mutable? | No (read-only) | Yes (use setter) |
| Who owns? | Parent | Component itself |
| Triggers re-render? | Yes (changed by parent) | Yes (setter called) |
| Initialized by? | Parent | Component |
| Default values? | Default params | `useState(initial)` |

## Common Patterns

### Toggle

```jsx
function Toggle() {
  const [isOn, setIsOn] = useState(false);
  return <button onClick={() => setIsOn(prev => !prev)}>{isOn ? 'ON' : 'OFF'}</button>;
}
```

### Counter

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(prev => prev - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(prev => prev + 1)}>+</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### Form input

```jsx
function Input() {
  const [value, setValue] = useState('');

  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
```

### Object state (spread merge)

```jsx
function UserForm() {
  const [user, setUser] = useState({ name: '', email: '', role: 'user' });

  const update = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <input value={user.name} onChange={e => update('name', e.target.value)} />
      <input value={user.email} onChange={e => update('email', e.target.value)} />
    </div>
  );
}
```

**Note**: `useState` does **not** merge objects (unlike class `setState`). Must spread manually.

### Array state

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
  };

  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const removeTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
}
```

## Pro Tips

- Split state into multiple `useState` calls for unrelated values.
- Use custom hooks to encapsulate complex state logic.
- Prefer functional updates when referencing previous state.
- Lift state up when sibling components share data.
- Don't store computed values in state — compute during render.
- Use `useReducer` for complex state objects (topic 07).
- State update is async — log outside setter for latest value.
