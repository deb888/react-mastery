# Render Props

## Overview

Render props = pattern where component receives a function prop that returns JSX. The component calls this function with its internal state, giving parent control over rendering.

```jsx
<DataProvider render={(data) => <UserList data={data} />} />
```

## Basic Pattern

```jsx
function Toggle({ render }) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(prev => !prev);

  return render({ on, toggle });
}

// Usage
<Toggle
  render={({ on, toggle }) => (
    <div>
      <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
    </div>
  )}
/>
```

### children as render prop

```jsx
function Toggle({ children }) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(prev => !prev);

  return children({ on, toggle });
}

<Toggle>
  {({ on, toggle }) => (
    <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
  )}
</Toggle>
```

## Examples

### 1. MouseTracker

```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div style={{ height: '100vh' }} onMouseMove={handleMouseMove}>
      {render(position)}
    </div>
  );
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <div>
      <h1>Mouse position: {x}, {y}</h1>
      <Cursor x={x} y={y} />
    </div>
  )}
/>
```

### 2. DataProvider (fetch + render prop)

```jsx
function DataProvider({ url, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return render({ data, loading, error });
}

// Usage
<DataProvider
  url="/api/users"
  render={({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <Error message={error.message} />;
    return <UserTable users={data} />;
  }}
/>
```

### 3. MediaQuery

```jsx
function MediaQuery({ query, children }) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return children(matches);
}

// Usage
<MediaQuery query="(min-width: 768px)">
  {isDesktop => isDesktop ? <DesktopNav /> : <MobileNav />}
</MediaQuery>
```

### 4. Form validation

```jsx
function ValidatedInput({ validate, children }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (touched) {
      setError(validate(newValue));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validate(value));
  };

  return children({
    value,
    error,
    touched,
    onChange: handleChange,
    onBlur: handleBlur,
    isValid: !error,
  });
}

// Usage
<ValidatedInput validate={v => v.length < 3 ? 'Too short' : null}>
  {({ value, error, onChange, onBlur }) => (
    <div>
      <input value={value} onChange={onChange} onBlur={onBlur} />
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  )}
</ValidatedInput>
```

## Compare: HOC vs Render Props vs Hooks

| Pattern | Pros | Cons |
|---------|------|------|
| HOC | Simple composition with `compose`, static at config time | Naming collisions, wrapper hell, static method issues |
| Render Props | Dynamic, explicit what's rendered, no naming collisions | Nested "callback hell" in JSX, runtime overhead |
| Hooks (modern) | No nesting, no wrapper, composable, testable | Cannot use in class components, rules of hooks |

### Migration from render props to hooks

```jsx
// Render props
<MediaQuery query="(min-width: 768px)">
  {isDesktop => ...}
</MediaQuery>

// Hook (modern)
function Component() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return ...;
}
```

## Pro Tips

- Render props predates hooks — most use cases now covered by custom hooks.
- Still useful when the consumer needs to customize rendering of shared logic.
- Naming: `render`, `children` (as function), or descriptive names like `renderItem`.
- Performance: wrap render prop with `useCallback` to avoid unnecessary re-renders.
- Combine with `memo` on wrapper component for extra optimization.
- TypeScript: type the render prop as function signature.
- Libraries like React Router, Formik, and React Spring still use render props internally.
