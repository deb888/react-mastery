# Components

## Overview

Component = reusable piece of UI. React app is tree of components.

## Functional Components (Modern — React 16.8+)

Function that returns JSX. Preferred pattern.

```jsx
// Simple component
function Welcome() {
  return <h1>Hello, World!</h1>;
}

// Arrow function component
const Welcome = () => {
  return <h1>Hello, World!</h1>;
};

// Implicit return (no curly braces)
const Welcome = () => <h1>Hello, World!</h1>;
```

Functional components receive `props` as first argument.

```jsx
function Greeting(props) {
  return <p>Hi {props.name}</p>;
}
```

Hooks let you add state/lifecycle to functions.

## Class Components (Legacy — Pre-16.8)

Extend `React.Component`. Must have `render()` method returning JSX.

```jsx
import React, { Component } from 'react';

class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Still supported but **not recommended** for new code. No hooks, verbose, `this` binding issues.

## Component Naming

**PascalCase** always. Differentiates from native HTML elements.

```jsx
// Correct
function UserProfile() { ... }
function Card() { ... }

// Wrong — lowercase treated as HTML tag
function userProfile() { ... } // React thinks <userProfile> is HTML
```

## Composition with Children

Components receive `children` prop for nested content.

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// Usage
<Card>
  <h2>Title</h2>
  <p>Body content</p>
</Card>
```

## Component Lifecycle Mental Model

| Phase | Functional (hooks) | Class |
|-------|-------------------|-------|
| Mount | `useEffect(() => {}, [])` | `componentDidMount` |
| Update | `useEffect(() => {}, [dep])` | `componentDidUpdate` |
| Unmount | `useEffect(() => fn, [])` cleanup | `componentWillUnmount` |

## Export/Import Patterns

### Named export

```jsx
// components/Header.jsx
export function Header() { ... }

// App.jsx
import { Header } from './components/Header';
```

### Default export

```jsx
// components/Header.jsx
export default function Header() { ... }

// App.jsx
import Header from './components/Header';
```

### Index barrel

```jsx
// components/index.js
export { Header } from './Header';
export { Footer } from './Footer';
```

## Examples

### Simple component

```jsx
function Avatar({ src, alt, size = 50 }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="avatar"
    />
  );
}
```

### Nested components

```jsx
function UserCard({ user }) {
  return (
    <div className="card">
      <Avatar src={user.avatar} alt={user.name} />
      <UserInfo name={user.name} email={user.email} />
    </div>
  );
}

function UserInfo({ name, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}
```

### Wrapper/layout component

```jsx
function Layout({ children, sidebar }) {
  return (
    <div className="layout">
      <header>My App</header>
      <div className="body">
        <aside>{sidebar}</aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

// Usage
<Layout sidebar={<Sidebar />}>
  <MainContent />
</Layout>
```

## Pro Tips

- Keep components **single-responsibility** — one component, one concern.
- Extract reusable pieces early (3+ repetitions).
- Use `function` keyword over arrow for better stack traces.
- Colocate styles, tests, and stories with the component file.
- Always name components before exporting (better DevTools names).
- Pure components (given same props, same output) are easier to test.
