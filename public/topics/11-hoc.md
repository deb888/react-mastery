# Higher-Order Components (HOC)

## Overview

HOC = function that takes a component and returns an enhanced component. Pattern for reusing component logic. `withXxx` naming convention.

```jsx
const EnhancedComponent = withFeature(BaseComponent);
```

## Basic HOC Structure

```jsx
function withLogger(WrappedComponent) {
  return function EnhancedComponent(props) {
    useEffect(() => {
      console.log(`Rendering ${WrappedComponent.name}`);
    });

    return <WrappedComponent {...props} />;
  };
}

const ButtonWithLogging = withLogger(Button);
```

## Common HOC Use Cases

### 1. Auth guarding

```jsx
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user } = useAuth();

    if (!user) {
      return <Navigate to="/login" />;
    }

    return <WrappedComponent {...props} user={user} />;
  };
}

const ProtectedDashboard = withAuth(Dashboard);

// Usage in router
<Route path="/dashboard" element={<ProtectedDashboard />} />
```

### 2. Logging

```jsx
function withLogger(WrappedComponent) {
  return class extends React.Component {
    componentDidMount() {
      console.log(`Mounted: ${WrappedComponent.name}`);
    }

    componentWillUnmount() {
      console.log(`Unmounted: ${WrappedComponent.name}`);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
```

### 3. Data injection (legacy pattern, now prefer hooks)

```jsx
function withData(WrappedComponent, fetchUrl) {
  return function DataComponent(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetch(fetchUrl)
        .then(r => r.json())
        .then(d => { setData(d); setLoading(false); });
    }, []);

    return (
      <WrappedComponent
        {...props}
        data={data}
        loading={loading}
      />
    );
  };
}

const UserListWithData = withData(UserList, '/api/users');
```

### 4. Styling

```jsx
function withStyles(styles) {
  return function (WrappedComponent) {
    return function StyledComponent(props) {
      const combinedStyles = { ...styles, ...props.style };
      return <WrappedComponent {...props} style={combinedStyles} />;
    };
  };
}

const StyledCard = withStyles({
  padding: 20,
  borderRadius: 8,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
})(Card);
```

## HOC Composition

Combine multiple HOCs:

```jsx
// Manual
const EnhancedComponent = withAuth(withLogger(withData(Component, '/api')));

// Using compose utility
import { compose } from 'redux'; // or lodash.flowRight

const enhance = compose(
  withAuth,
  withLogger,
  withData('/api')
);

const EnhancedComponent = enhance(Component);
```

## Caveats

### 1. Ref forwarding

Refs don't pass through HOC automatically. Use `forwardRef`.

```jsx
function withLogger(WrappedComponent) {
  function EnhancedComponent(props, ref) {
    return <WrappedComponent {...props} ref={ref} />;
  }
  return forwardRef(EnhancedComponent);
}

// Usage
const ref = useRef();
<EnhancedComponent ref={ref} />;
```

### 2. Static methods

HOC wraps component — static methods are lost.

```jsx
WrappedComponent.staticMethod = () => {};

// After HOC — staticMethod is not on EnhancedComponent
const Enhanced = withLogger(WrappedComponent);
Enhanced.staticMethod(); // Error

// Fix: copy static methods
function withLogger(Wrapped) {
  const Enhanced = (props) => <Wrapped {...props} />;
  Enhanced.staticMethod = Wrapped.staticMethod; // manual copy
  return Enhanced;
}

// Or use hoist-non-react-statics
import hoistNonReactStatics from 'hoist-non-react-statics';
```

### 3. displayName

Set displayName for better debugging.

```jsx
function withLogger(WrappedComponent) {
  function Enhanced(props) {
    return <WrappedComponent {...props} />;
  }
  Enhanced.displayName = `WithLogger(${WrappedComponent.displayName || WrappedComponent.name})`;
  return Enhanced;
}
```

### 4. Naming collisions

```jsx
// Dangerous — both inject `user` prop
withUser(WithProfile(UserDashboard)); // Which user wins?
```

HOC should pass through unknown props and let final component resolve conflicts.

## Examples

### withAuthRedirect

```jsx
function withAuthRedirect(WrappedComponent) {
  return function AuthRedirect(props) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Spinner />;
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

    return <WrappedComponent {...props} user={user} />;
  };
}

const ProfilePage = withAuthRedirect(Profile);
```

### withLoading

```jsx
function withLoading(WrappedComponent) {
  return function LoadingWrapper({ isLoading, ...props }) {
    if (isLoading) {
      return <div className="spinner-container"><Spinner /></div>;
    }
    return <WrappedComponent {...props} />;
  };
}

const DataTableWithLoading = withLoading(DataTable);

// Usage
<DataTableWithLoading isLoading={loading} data={items} />
```

## Pro Tips

- Prefer hooks over HOCs for modern React (simpler, no nesting, no naming collisions).
- HOCs still useful for class components and third-party integration.
- Keep HOCs pure — don't mutate wrapped component.
- Compose HOCs with `flowRight` or `compose` for readability.
- Always forward refs and copy static methods.
- Set meaningful displayName.
- Consider `render props` (topic 12) or hooks as alternatives.
