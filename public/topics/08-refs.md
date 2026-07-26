# Refs (useRef)

## Overview

`useRef` provides mutable object with `.current` property. Persists across renders. Changing ref **does not** trigger re-render.

```jsx
import { useRef } from 'react';

function Component() {
  const countRef = useRef(0);
  // countRef.current — mutable, persists, no re-render
}
```

## DOM Refs

Access DOM nodes directly. Most common use case.

```jsx
function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} type="text" />;
}
```

### Accessing input value

```jsx
function Form() {
  const nameRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Name: ${nameRef.current.value}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## ForwardRef

Pass ref through component tree to child DOM element.

```jsx
import { forwardRef, useRef } from 'react';

// Child
const FancyInput = forwardRef((props, ref) => {
  return <input ref={ref} className="fancy" {...props} />;
});

// Parent
function Parent() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <FancyInput ref={inputRef} />;
}
```

**Why**: Functional components don't expose DOM nodes by default. `forwardRef` opt-in.

### useImperativeHandle

Control what ref exposes (avoid when possible).

```jsx
const Counter = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, () => ({
    reset: () => setCount(0),
    getValue: () => count,
  }));

  return <p>{count}</p>;
});
```

## Holding Previous Values

```jsx
function PreviousValue({ value }) {
  const prevRef = useRef();

  useEffect(() => {
    prevRef.current = value;
  }, [value]);

  return (
    <div>
      <p>Current: {value}</p>
      <p>Previous: {prevRef.current}</p>
    </div>
  );
}
```

## Timer IDs

Store interval/timeout IDs without causing re-renders.

```jsx
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div>
      <p>{count}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

## Instance Variables

Ref as mutable instance property (like `this.something` in class).

```jsx
function RenderCounter() {
  const renderCount = useRef(1);

  useEffect(() => {
    renderCount.current += 1;
  });

  return <p>Rendered {renderCount.current} times</p>;
}
```

### Tracking previous state (custom hook)

```jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function App() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <p>Now: {count}, before: {prevCount}</p>;
}
```

### Avoiding stale closures

```jsx
function IntervalLogger() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(countRef.current); // always latest
    }, 1000);
    return () => clearInterval(id);
  }, []);
}
```

## Examples

### Auto-focus input on mount

```jsx
function LoginForm() {
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <form>
      <input ref={emailRef} type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
    </form>
  );
}
```

### Measuring DOM node

```jsx
function MeasureBox() {
  const boxRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const { width, height } = boxRef.current.getBoundingClientRect();
    setSize({ w: width, h: height });
  }, []);

  return (
    <div>
      <div ref={boxRef} style={{ padding: 20, background: '#eee' }}>
        Measure me
      </div>
      <p>Width: {size.w}, Height: {size.h}</p>
    </div>
  );
}
```

## Pro Tips

- Refs are escape hatch — use when declarative approach doesn't work.
- Don't overuse DOM refs — prefer React's declarative state.
- `useRef` initial value is set once — ignore subsequent changes.
- Ref changes don't trigger effects (unless you add `ref.current` to deps — don't).
- Combine with `callback ref` pattern for dynamic ref setting.
- Use `forwardRef` for reusable input/button components.
- In React 19, `ref` becomes a prop like any other — `forwardRef` may become optional.
