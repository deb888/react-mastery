# Conditional Rendering

## Overview

Conditionally render different JSX based on state/props. Multiple techniques — choose based on complexity.

## Techniques

### 1. `&&` (Short-circuit AND)

Renders right side when condition is truthy.

```jsx
function Notification({ count }) {
  return (
    <div>
      <span>Messages</span>
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  );
}
```

**Pitfall**: `0` renders as `0`.

```jsx
// ❌ Renders "0" when count is 0
{count && <span>{count}</span>}

// ✅ Safe — explicit boolean
{count > 0 && <span>{count}</span>}

// ✅ Safe — double NOT
{!!count && <span>{count}</span>}
```

### 2. Ternary `? :`

Renders one of two options.

```jsx
function UserGreeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn
        ? <UserMenu />
        : <LoginButton />
      }
    </div>
  );
}
```

Nested ternaries are hard to read — extract or use if/else.

```jsx
// ❌ Hard to read
<div>
  {status === 'loading' ? <Spinner />
    : status === 'error' ? <Error />
    : status === 'empty' ? <Empty />
    : <Content />
  }
</div>

// ✅ Better — extract function
function renderContent(status) {
  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <Error />;
  if (status === 'empty') return <Empty />;
  return <Content />;
}
```

### 3. If/else with early return

Cleanest for multiple conditions.

```jsx
function Dashboard({ user, loading, error }) {
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  if (!user) return <LoginPrompt />;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <UserStats user={user} />
    </div>
  );
}
```

### 4. Element variables

Store JSX in variables.

```jsx
function AuthButton({ isLoggedIn, isAdmin }) {
  let button;

  if (isLoggedIn && isAdmin) {
    button = <AdminPanel />;
  } else if (isLoggedIn) {
    button = <UserDashboard />;
  } else {
    button = <LoginForm />;
  }

  return <div>{button}</div>;
}
```

### 5. Immediately-Invoked Function

```jsx
function Status({ status }) {
  return (
    <div>
      {(() => {
        switch (status) {
          case 'loading': return <Spinner />;
          case 'error': return <Error />;
          case 'success': return <Success />;
          default: return <Idle />;
        }
      })()}
    </div>
  );
}
```

## Common Patterns

### Loading states

```jsx
function DataView({ data, loading }) {
  if (loading) return <div className="skeleton" />;
  return <Content data={data} />;
}
```

### Empty states

```jsx
function UserList({ users }) {
  if (users.length === 0) {
    return <EmptyState message="No users found" />;
  }

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

### Error states

```jsx
function Profile({ userId }) {
  const { user, loading, error } = useUser(userId);

  if (loading) return <Spinner />;
  if (error) return <ErrorFallback message={error.message} onRetry />;
  if (!user) return <NotFound />;

  return <UserProfile user={user} />;
}
```

### Auth gates

```jsx
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

// Usage
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## Multiple Conditions

```jsx
function OrderStatus({ status }) {
  const statusConfig = {
    pending: { icon: '⏳', text: 'Processing', color: 'yellow' },
    shipped: { icon: '📦', text: 'On the way', color: 'blue' },
    delivered: { icon: '✅', text: 'Completed', color: 'green' },
    cancelled: { icon: '❌', text: 'Cancelled', color: 'red' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`status status-${config.color}`}>
      {config.icon} {config.text}
    </div>
  );
}
```

### Enum object pattern

```jsx
const VIEWS = {
  list: <ListView />,
  grid: <GridView />,
  table: <TableView />,
};

function ViewContainer({ view }) {
  return VIEWS[view] || <FallbackView />;
}
```

## Examples

### Multi-state view

```jsx
function FetchView({ url }) {
  const { data, loading, error } = useFetch(url);

  if (loading) {
    return (
      <div className="loading-state">
        <Spinner />
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <h3>Failed to load</h3>
        <p>{error.message}</p>
        <button onClick={retry}>Retry</button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <img src="/empty.svg" alt="No data" />
        <p>Nothing to show yet</p>
      </div>
    );
  }

  return (
    <div className="success-state">
      <DataGrid data={data} />
    </div>
  );
}
```

### Conditional classNames

```jsx
function Button({ variant = 'primary', disabled, loading, children }) {
  const className = [
    'btn',
    `btn-${variant}`,
    loading ? 'btn-loading' : '',
    disabled ? 'btn-disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <button className={className} disabled={disabled || loading}>
      {loading ? <Spinner /> : children}
    </button>
  );
}
```

## Pro Tips

- Early return pattern is cleanest for multi-condition logic.
- Avoid nesting ternaries — extract functions or use if/else.
- `&&` is concise for "render if truthy" — guard against falsy values (0, NaN).
- Use enum/map patterns over switch for many conditions.
- Keep conditional logic near the component's top for readability.
- For complex UI conditions, consider state machines (xstate).
- Use CSS `display: none` instead of conditional render for perf-sensitive hidden tabs.
- Empty states are UX features, not edge cases — design them intentionally.
