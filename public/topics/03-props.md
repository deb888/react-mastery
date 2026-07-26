# Props

## Overview

Props = read-only data passed from parent to child. Component receives props as object argument. Immutable — never modify props inside component.

## Basic Usage

```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

<Greeting name="Alice" />
<Greeting name="Bob" />
```

## Destructuring Props

Cleaner syntax, avoids `props.` prefix.

```jsx
function Greeting({ name, age }) {
  return (
    <div>
      <p>{name}</p>
      <p>{age} years old</p>
    </div>
  );
}

// With rest operator
function Card({ title, children, ...rest }) {
  return (
    <div className="card" {...rest}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

## Default Props

Use default parameter values (modern approach).

```jsx
function Button({ text = 'Click', variant = 'primary', disabled = false }) {
  return (
    <button className={`btn btn-${variant}`} disabled={disabled}>
      {text}
    </button>
  );
}
```

### Legacy `defaultProps` (still works, not recommended)

```jsx
Button.defaultProps = {
  text: 'Click',
  variant: 'primary',
};
```

## `children` Prop

Special prop for nested JSX content.

```jsx
function Alert({ children, type = 'info' }) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}

<Alert type="success">
  <strong>Done!</strong> Your changes saved.
</Alert>
```

You can pass any JSX as children — components, elements, strings, functions.

## Prop Drilling Problem

Passing props through intermediate components that don't use them.

```jsx
function App() {
  const [user, setUser] = useState(null);
  return <Layout user={user} setUser={setUser} />;
}

function Layout({ user, setUser }) {
  // Layout doesn't use user — just passes down
  return (
    <div>
      <Header user={user} setUser={setUser} />
      <Main />
    </div>
  );
}

function Header({ user, setUser }) {
  // Header finally uses user
  return <UserMenu user={user} setUser={setUser} />;
}
```

**Solutions**: Context (topic 06), composition (topic 20), state management libraries.

## PropTypes (Legacy) vs TypeScript

### PropTypes (runtime checking, dev-only)

```jsx
import PropTypes from 'prop-types';

function User({ name, age, isAdmin }) { ... }

User.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  isAdmin: PropTypes.bool,
  onLogin: PropTypes.func,
  roles: PropTypes.arrayOf(PropTypes.string),
  metadata: PropTypes.shape({
    created: PropTypes.instanceOf(Date),
  }),
};
```

### TypeScript (compile-time, recommended)

```tsx
type UserProps = {
  name: string;
  age?: number;
  isAdmin?: boolean;
  onLogin: (email: string) => void;
  roles: string[];
};

function User({ name, age = 0, isAdmin = false, onLogin, roles }: UserProps) {
  return <div>...</div>;
}
```

## Spread Props

Pass props object directly.

```jsx
const userProps = { name: 'Alice', age: 30, role: 'admin' };

// Manual
<User name={userProps.name} age={userProps.age} role={userProps.role} />;

// Spread (same result)
<User {...userProps} />;

// Override specific props
<User {...userProps} age={31} />; // age becomes 31, not 30
```

## Patterns

### Component configuration via props

```jsx
function Table({
  columns = [],
  data = [],
  pageSize = 10,
  sortable = false,
  onRowClick,
}) {
  // configurable table behavior
}
```

### Render props (intro)

Pass a function as prop to control rendering.

```jsx
function DataProvider({ url, render }) {
  const [data, setData] = useState(null);
  // fetch data...
  return render(data);
}

<DataProvider
  url="/api/users"
  render={(data) => <UserList users={data} />}
/>;
```

Access full coverage in topic 12.

## Pro Tips

- Props flow **one-way** (parent → child).
- Use default params over `defaultProps`.
- Destructure at function parameter for readability.
- Keep required props minimal — make optional when reasonable.
- Rename destructured props: `({ name: userName })`.
- Forward unused props with `...rest` for wrapper components.
- TypeScript `interface` for public API, `type` for unions/utilities.
