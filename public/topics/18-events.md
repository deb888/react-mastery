# Events

## Overview

React normalizes events across browsers via **SyntheticEvent** wrapper. Events follow camelCase naming. Pass function reference (not call).

```jsx
<button onClick={handleClick}>Click</button>   // ✅ function reference
<button onClick={handleClick()}>Click</button> // ❌ calls on render
```

## Synthetic Event

Cross-browser wrapper with same interface as native event. Includes `stopPropagation()`, `preventDefault()`.

```jsx
function handleClick(e) {
  e.preventDefault();   // works across browsers
  e.stopPropagation();  // stops bubbling
  console.log(e.type);  // 'click'
  console.log(e.target); // DOM element
}
```

### Event Pooling (React 16)

In React 16, SyntheticEvent objects are pooled (reused). Accessing async:

```jsx
// React 16 — pooled
function handleClick(e) {
  setTimeout(() => {
    console.log(e.type); // null — event returned to pool
  }, 100);
}

// Fix: persist event
function handleClick(e) {
  e.persist();
  setTimeout(() => {
    console.log(e.type); // 'click'
  }, 100);
}
```

**React 17+**: no pooling. Access event async without `persist()`.

## Event Naming

camelCase event names.

```jsx
// HTML
<button onclick="handleClick()">Click</button>

// React
<button onClick={handleClick}>Click</button>
```

## Passing Arguments

### Arrow function (preferred)

```jsx
<button onClick={() => handleClick(id)}>Delete</button>
<button onClick={(e) => handleClick(id, e)}>Delete</button>
```

### .bind (legacy)

```jsx
<button onClick={handleClick.bind(null, id)}>Delete</button>
```

**Performance note**: recreates function each render. Minimal impact unless child is memoized — then use `useCallback`.

```jsx
const handleClick = useCallback((id) => {
  // handler
}, []);

<button onClick={() => handleClick(item.id)}>Delete</button>
```

## Common Events

### onClick

```jsx
function ClickCounter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      Clicked {count} times
    </button>
  );
}
```

### onChange

Triggered on every value change (unlike HTML's onchange which fires on blur).

```jsx
<input
  type="text"
  value={value}
  onChange={e => setValue(e.target.value)}
/>
```

### onSubmit

```jsx
<form onSubmit={handleSubmit}>
  <input type="text" />
  <button>Submit</button>
</form>
```

### onKeyDown

```jsx
function KeyHandler() {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
    }
    if (e.key === 'Escape') {
      console.log('Escape pressed');
    }
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      console.log('Ctrl+S');
    }
  };

  return <input onKeyDown={handleKeyDown} />;
}
```

### onFocus / onBlur

```jsx
<input
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  placeholder="Focus me"
/>
{isFocused && <p>Input is focused</p>}
```

## Examples

### Click counter

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>-</button>
    </div>
  );
}
```

### Key handler

```jsx
function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Search and press Enter"
    />
  );
}
```

### Form submit

```jsx
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email}
             onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password}
             onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Custom event — passing data up

```jsx
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li>
      <span
        onClick={() => onToggle(todo.id)}
        style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
      >
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>x</button>
    </li>
  );
}

function TodoList() {
  const [todos, setTodos] = useState(initialTodos);

  const handleToggle = (id) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  const handleDelete = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
```

### preventDefault + stopPropagation

```jsx
function LinkWrapper({ href, children }) {
  const handleClick = (e) => {
    e.preventDefault();
    console.log('Link clicked but no navigation');
  };

  return <a href={href} onClick={handleClick}>{children}</a>;
}

function Parent() {
  const handleParentClick = () => {
    console.log('Parent onClick');
  };

  return (
    <div onClick={handleParentClick}>
      <Child />
    </div>
  );
}

function Child() {
  const handleChildClick = (e) => {
    e.stopPropagation();
    console.log('Only child');
  };

  return <button onClick={handleChildClick}>Stop Propagation</button>;
}
```

## Pro Tips

- Use `onChange` for text inputs (fires on each keystroke).
- Use `onBlur` for validation (fires when focus leaves).
- Pass `e` explicitly as last argument when passing custom params.
- Keyboard events: check `e.key` (modern) over `e.keyCode` (deprecated).
- `onChange` on select/checkbox uses `e.target.value` / `e.target.checked`.
- Event handlers receive SyntheticEvent — compatible with native `addEventListener`.
- For document-level events, use `useEffect` + `addEventListener` directly.
- Prevent default on form submit (`e.preventDefault()`) always.
