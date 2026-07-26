# Error Boundaries

## Overview

Error boundaries catch JavaScript errors during rendering, in lifecycle methods, and in constructors of the whole tree below them. Display fallback UI instead of crashing the whole app.

**Must be class component** — no hook equivalent yet (React 18).

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Error caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}
```

## Lifecycle Methods

### `getDerivedStateFromError`

Static method. Updates state to render fallback UI. Called during render phase — no side effects.

```jsx
static getDerivedStateFromError(error) {
  return { hasError: true, error };
}
```

### `componentDidCatch`

Called during commit phase. Side effects OK — logging, reporting to monitoring service.

```jsx
componentDidCatch(error, errorInfo) {
  logErrorToService(error, errorInfo.componentStack);
}
```

## What Boundaries Catch

✅ Render errors
✅ Lifecycle errors (`componentDidMount`, `componentDidUpdate`)
✅ Constructor errors

```jsx
function BuggyComponent() {
  throw new Error('💥');
  return <div>Never reached</div>;
}

<ErrorBoundary>
  <BuggyComponent />
</ErrorBoundary>
// Shows fallback instead of white screen
```

## What Boundaries Do NOT Catch

❌ Event handlers (use try-catch)

```jsx
function ClickHandler() {
  const handleClick = () => {
    try {
      throw new Error('Click error');
    } catch (err) {
      setError(err);
    }
  };

  if (error) return <ErrorFallback />;
  return <button onClick={handleClick}>Click</button>;
}
```

❌ Async code (`setTimeout`, `requestAnimationFrame`, promises)

```jsx
useEffect(() => {
  // This is NOT caught by error boundary
  setTimeout(() => {
    throw new Error('Async error');
  }, 1000);
}, []);
```

❌ Server-side rendering
❌ Errors in the error boundary itself

## Error Boundary Placement

### Top-level (app-wide)

```jsx
<ErrorBoundary fallback={<AppCrash />}>
  <App />
</ErrorBoundary>
```

### Per-route or per-section

```jsx
<Layout>
  <ErrorBoundary fallback={<WidgetError />}>
    <Sidebar />
  </ErrorBoundary>
  <ErrorBoundary fallback={<ContentError />}>
    <MainContent />
  </ErrorBoundary>
</Layout>
```

### Wrapping specific components

```jsx
<ErrorBoundary fallback={<UserCardError />}>
  <UserCard user={user} />
</ErrorBoundary>
```

## Examples

### ErrorBoundary wrapper component

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.group('Error Boundary');
    console.error('Error:', error);
    console.error('Component Stack:', info.componentStack);
    console.groupEnd();
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary-fallback">
            <h2>Something went wrong</h2>
            <details>
              <summary>Error details</summary>
              <pre>{this.state.error?.message}</pre>
            </details>
            <button onClick={() => this.setState({ hasError: false, error: null })}>
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### Fallback UI

```jsx
function ErrorFallback({ error, resetError }) {
  return (
    <div className="error-container">
      <h2>⚠️ Oops, something broke</h2>
      <p>{error?.message}</p>
      <button onClick={resetError}>Try Again</button>
    </div>
  );
}

// Usage
<ErrorBoundary fallback={<ErrorFallback />}>
  <Profile />
</ErrorBoundary>
```

### Logging errors

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Send to monitoring service
    analytics.trackError(error, {
      componentStack: info.componentStack,
      userId: currentUser?.id,
      url: window.location.href,
    });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Our team has been notified.</h1>;
    }
    return this.props.children;
  }
}
```

### Reset boundary

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback({
        error: this.state.error,
        reset: this.reset,
      });
    }
    return this.props.children;
  }
}

// Usage with reset button
<ErrorBoundary
  fallback={({ error, reset }) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  )}
>
  <DataView />
</ErrorBoundary>
```

## Pro Tips

- Place boundaries strategically — not too granular, not too coarse.
- Use `componentDidCatch` for logging/monitoring integration.
- Reset state via `key` prop change to re-mount children.
- No hook equivalent yet — React 19 may introduce `useErrorBoundary`.
- Event handler errors need manual `try-catch` + state management.
- Wrap Router-level components for route-level error isolation.
- Combine with `Suspense` for complete error + loading handling.
- Test error boundaries by throwing errors in child components.
