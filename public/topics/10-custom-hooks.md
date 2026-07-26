# Custom Hooks

## Overview

Custom hook = JavaScript function starting with `use` that calls other hooks. Reuses stateful logic across components. Encapsulates complex behavior.

## Convention

- Name starts with `use` — enables hook linting rules.
- May call built-in hooks (`useState`, `useEffect`, `useRef`, etc.)
- Returns whatever callers need: values, functions, or both.

```jsx
function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

## Composing Built-in Hooks

```jsx
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}
```

## When to Extract Custom Hook

- Duplicate logic across components (fetching, form handling, timers)
- Complex state logic that clutters component
- Side effects with cleanup that repeat
- State that needs to be shared across components (non-global)

## Examples

### 1. useToggle

```jsx
// Hook
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue(prev => !prev);
  return [value, toggle];
}

// Usage
function DarkModeToggle() {
  const [isDark, toggleDark] = useToggle(false);
  return (
    <button onClick={toggleDark}>
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
```

### 2. useLocalStorage

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Failed saving to localStorage', e);
    }
  }, [key, value]);

  return [value, setValue];
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16);

  return (
    <div>
      <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <input type="range" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} />
    </div>
  );
}
```

### 3. useDebounce

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Usage
function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      fetch(`/api/search?q=${debouncedQuery}`)
        .then(r => r.json())
        .then(setResults);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

### 4. useFetch

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserList() {
  const { data: users, loading, error } = useFetch('/api/users');

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <UserList users={users} />;
}
```

### 5. useWindowSize

```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Usage
function ResponsiveLayout() {
  const { width } = useWindowSize();

  return (
    <div className={width < 768 ? 'mobile' : 'desktop'}>
      {width < 768 ? <MobileNav /> : <Sidebar />}
    </div>
  );
}
```

### 6. useIntersectionObserver

```jsx
function useIntersectionObserver(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}

// Usage
function LazyImage({ src, alt }) {
  const imgRef = useRef(null);
  const isVisible = useIntersectionObserver(imgRef);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : placeholder}
      alt={alt}
    />
  );
}
```

### 7. usePrevious

```jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
```

## Pro Tips

- Custom hooks are just functions — test them with `renderHook` from testing library.
- Hook returned functions should ideally be stable (`useCallback`).
- Don't call hooks conditionally even inside custom hook.
- Name hooks descriptively: `useOnlineStatus`, `useMediaQuery`, `useClipboard`.
- Extract when you write the same logic 2+ times.
- Custom hooks compose — call one hook from another.
- Return primitive values or stable object references to avoid unnecessary re-renders.
