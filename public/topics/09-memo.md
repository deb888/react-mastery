# Memoization (React.memo, useMemo, useCallback)

## Overview

Memoization = caching result of expensive computation to avoid re-execution. React provides three APIs: `React.memo` (component), `useMemo` (value), `useCallback` (function).

## React.memo

Wraps component. Only re-renders when props change (shallow comparison).

```jsx
import { memo } from 'react';

const ExpensiveList = memo(function ExpensiveList({ items }) {
  console.log('Rendering list');
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
});

// Parent — re-renders don't affect memoized child if items reference same
function App() {
  const [count, setCount] = useState(0);
  const items = useMemo(() => [{ id: 1, name: 'A' }], []);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <ExpensiveList items={items} />
    </div>
  );
}
```

### Custom comparison function

```jsx
const List = memo(
  ({ items }) => <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>,
  (prev, next) => prev.items.length === next.items.length
);
```

## useMemo

Memoizes computed value. Recomputes only when deps change.

```jsx
import { useMemo } from 'react';

function SearchResults({ query, data }) {
  // Only re-filters when query or data actually change
  const results = useMemo(() => {
    return data.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, data]);

  return (
    <ul>
      {results.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}
```

### Expensive computation

```jsx
function PrimeNumbers({ limit }) {
  const primes = useMemo(() => {
    // Expensive calculation
    const result = [];
    for (let i = 2; i <= limit; i++) {
      if (isPrime(i)) result.push(i);
    }
    return result;
  }, [limit]);

  return <p>Found {primes.length} primes</p>;
}
```

## useCallback

Memoizes function reference. Prevents child re-renders when function passed as prop.

```jsx
import { useCallback, memo } from 'react';

const Button = memo(({ onClick, label }) => {
  console.log(`Rendering ${label}`);
  return <button onClick={onClick}>{label}</button>;
});

function App() {
  const [count, setCount] = useState(0);

  // Stable reference — doesn't change between renders
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // no deps — setCount is stable

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  return (
    <div>
      <p>{count}</p>
      <Button onClick={increment} label="+" />
      <Button onClick={reset} label="Reset" />
    </div>
  );
}
```

## When They Help

| API | Helps When |
|-----|-----------|
| `React.memo` | Component re-renders often with same props |
| `useMemo` | Expensive calculation referenced in render |
| `useCallback` | Passing function to memoized child |

### Referential equality

```jsx
// Without useCallback — new function every render
<Child onClick={() => setCount(c => c + 1)} /> // breaks memo

// With useCallback — stable reference
const onClick = useCallback(() => setCount(c => c + 1), []);
<Child onClick={onClick} /> // memo works
```

## When They Hurt (premature optimization)

```jsx
// DON'T — useMemo on trivial computation
const total = useMemo(() => a + b, [a, b]); // overhead > benefit

// DON'T — memoizing every component
const SimpleDiv = memo(({ text }) => <div>{text}</div>);

// DON'T — useCallback on every handler
const handleChange = useCallback((e) => {
  setValue(e.target.value); // trivial
}, []);
```

**Rule**: Profile first. Memoization has cost (memory + comparison).

## Relationship with Re-renders

Parent re-render → child re-renders by default. Memoization blocks this when inputs unchanged.

```
App re-renders (setCount)
  ├── Header         ← re-renders (no memo)
  ├── ExpensiveList   ← SKIP (memo, items unchanged)
  └── Footer         ← re-renders (no memo)
```

## Examples

### Memoized list item

```jsx
const TodoItem = memo(function TodoItem({ todo, onToggle }) {
  return (
    <li onClick={() => onToggle(todo.id)}
        style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
      {todo.text}
    </li>
  );
});

function TodoList({ todos, onToggle }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
      ))}
    </ul>
  );
}
```

### Expensive computation

```jsx
function Dashboard({ transactions }) {
  const stats = useMemo(() => ({
    total: transactions.reduce((s, t) => s + t.amount, 0),
    average: transactions.length
      ? transactions.reduce((s, t) => s + t.amount, 0) / transactions.length
      : 0,
    max: Math.max(...transactions.map(t => t.amount)),
    min: Math.min(...transactions.map(t => t.amount)),
  }), [transactions]);

  return <StatsDisplay stats={stats} />;
}
```

### Stable callback props

```jsx
function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = useCallback(async (q) => {
    const data = await fetch(`/api/search?q=${q}`).then(r => r.json());
    setResults(data);
  }, []);

  // Stable debounce — doesn't reset on re-render
  return <SearchInput onSearch={search} />;
}
```

## Pro Tips

- `useMemo` doesn't guarantee memoization — React may clear cache (e.g., memory pressure).
- Add all values used inside to deps array.
- `useCallback(fn, deps)` = `useMemo(() => fn, deps)`.
- Prefer moving state down / lifting content up over memoization.
- Use `key` prop change to force re-mount (alternative to memo).
- `memo` only checks props — not context or internal state changes.
- For lists with stable keys, `memo` + `useCallback` is powerful combo.
- Measure with React DevTools Profiler before adding memoization.
