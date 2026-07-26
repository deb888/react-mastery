# Effects (useEffect)

## Overview

`useEffect` runs side effects after render. Synchronizes component with external systems (API, DOM, subscriptions, timers).

```jsx
import { useEffect } from 'react';

useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup (optional)
  };
}, [dependencies]);
```

## Dependency Array

Controls when effect runs.

| Deps | Runs |
|------|------|
| `[]` | Once on mount |
| `[dep1, dep2]` | On mount + when any dep changes |
| omitted | On mount + every render |
| returned cleanup | On unmount + before re-run |

### Empty array — mount only

```jsx
useEffect(() => {
  fetch('/api/initial').then(setData);
}, []); // runs once
```

### With dependencies — mount + when dep changes

```jsx
const [userId, setUserId] = useState(1);

useEffect(() => {
  fetch(`/api/users/${userId}`).then(setUser);
}, [userId]); // re-fetches when userId changes
```

### No array — every render (rare, usually avoid)

```jsx
useEffect(() => {
  document.title = `Count: ${count}`;
}); // runs after every render
```

## Cleanup Function

Return function from effect. Runs on unmount and before re-run.

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    setTime(new Date().toLocaleTimeString());
  }, 1000);

  return () => {
    clearInterval(timer); // cleanup on unmount
  };
}, []);
```

## Common Use Cases

### 1. Data fetching

```jsx
function User({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  return <div>{user?.name}</div>;
}
```

### 2. Subscriptions

```jsx
useEffect(() => {
  const socket = new WebSocket('ws://example.com');

  socket.onmessage = (event) => {
    setMessages(prev => [...prev, event.data]);
  };

  return () => socket.close();
}, []);
```

### 3. DOM manipulation

```jsx
useEffect(() => {
  const el = document.getElementById('my-chart');
  const chart = new Chart(el, { data });

  return () => chart.destroy();
}, [data]);
```

### 4. Timers

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return <p>{seconds}s</p>;
}
```

### 5. Event listeners

```jsx
function WindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <p>{size.width} x {size.height}</p>;
}
```

## StrictMode Double-Invoke

In development, React StrictMode mounts/unmounts components twice to detect bugs.

```jsx
// In development — effect runs twice
useEffect(() => {
  console.log('mounted'); // logs twice
  return () => console.log('unmounted'); // logs once between
}, []);
```

**Not a bug**. Ensures your cleanup works. Production unaffected.

## Examples

### Document title

```jsx
function Profile({ name }) {
  useEffect(() => {
    const prev = document.title;
    document.title = `Profile: ${name}`;
    return () => { document.title = prev; };
  }, [name]);

  return <div>Profile: {name}</div>;
}
```

### Fetch with abort

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') setError(err);
    });

  return () => controller.abort();
}, [url]);
```

## Pro Tips

- Each `useEffect` should handle **one concern** (split multiple effects).
- Don't lie about deps — include everything the effect reads.
- For async functions, define inside effect or use custom hook.
- Skip `useEffect` for user events (button click → direct handler).
- Consider custom hooks to encapsulate effects (useFetch, useEventListener).
- Use `useLayoutEffect` for synchronous DOM measurements (rare).
- Effects run **after** paint — user sees flash for sync DOM changes.
