# Context API

## Overview

Context provides way to pass data through component tree without passing props manually at every level. Solves prop drilling.

## Creating Context

Three parts: `createContext`, `Provider`, `useContext`.

```jsx
import { createContext, useContext } from 'react';

// 1. Create
const ThemeContext = createContext('light');

function App() {
  // 2. Provide
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return <Button />;
}

function Button() {
  // 3. Consume
  const theme = useContext(ThemeContext);
  return <button className={`btn-${theme}`}>Click</button>;
}
```

## Provider

Wraps subtree to provide value to all descendants.

```jsx
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

Nested providers override parent value (shadowing).

## `useContext` Hook

Simpler than legacy `Context.Consumer` render prop.

```jsx
// Modern hook
const theme = useContext(ThemeContext);

// Legacy render prop (avoid)
<ThemeContext.Consumer>
  {theme => <div>{theme}</div>}
</ThemeContext.Consumer>
```

## Default Context Value

Used when component is rendered **outside** any Provider.

```jsx
const AuthContext = createContext({ user: null, isLoggedIn: false });
// Used as fallback if no Provider above
```

## Solving Prop Drilling

```jsx
// Before context — props passed 5 levels
<App user={user}>
  <Layout user={user}>
    <Nav user={user}>
      <Avatar user={user} /> {/* finally used here */}
    </Nav>
  </Layout>
</App>

// After context
<App>
  <UserProvider user={user}>
    <Layout>
      <Nav>
        <Avatar /> {/* useContext(UserContext) */}
      </Nav>
    </Layout>
  </UserProvider>
</App>
```

## When to Use

**Good fit**:
- Themes (light/dark mode)
- Locale/i18n
- User auth state
- Global UI state (sidebar open, toasts)

**Bad fit**:
- State that changes frequently (every re-render triggers all consumers)
- Replacing all prop drilling (keep props for immediate children)

## Provider Nesting

```jsx
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocaleProvider>
          <RouterProvider>
            <AppShell />
          </RouterProvider>
        </LocaleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

Each provider adds tree depth but avoids explicit prop passing.

## Performance — Splitting Contexts

Merging unrelated values in single context causes unnecessary re-renders.

```jsx
// BAD — changing theme re-renders all auth consumers
<CombinedContext.Provider value={{ theme, user, locale }}>
  <App />
</CombinedContext.Provider>

// GOOD — separate contexts
<ThemeContext.Provider value={theme}>
  <AuthContext.Provider value={user}>
    <LocaleContext.Provider value={locale}>
      <App />
    </LocaleContext.Provider>
  </AuthContext.Provider>
</ThemeContext.Provider>
```

## Examples

### Theme context

```jsx
const ThemeContext = createContext('light');

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      style={{ background: theme === 'dark' ? '#333' : '#fff' }}
    >
      Current: {theme}
    </button>
  );
}
```

### User auth context

```jsx
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const user = await api.login(email, password);
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
}

// Usage
function Profile() {
  const { user, logout } = useAuth();
  return <div><p>{user.name}</p><button onClick={logout}>Logout</button></div>;
}
```

## Pro Tips

- Create custom hook per context (`useTheme`, `useAuth`) for convenience + validation.
- Context value changes → **all** consumers re-render. Memoize value if needed.
- For high-frequency updates (animations, real-time), consider external state (zustand, jotai).
- Default value is fallback only — rarely the real value.
- Don't overuse context — props are fine for 1-2 levels.
- Split contexts by domain (auth, theme, locale) not by convenience.
