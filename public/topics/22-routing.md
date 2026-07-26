# Routing (React Router v6)

## Overview

React Router v6 provides declarative routing for SPAs. Maps URL paths to React components.

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Setup

```bash
npm install react-router-dom
```

## Core Components

### BrowserRouter

Wraps app. Uses HTML5 history API.

```jsx
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

### Routes / Route

`Routes` matches first `Route` with matching path.

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<Products />} />
  <Route path="/products/:id" element={<ProductDetail />} />
  <Route path="/about" element={<About />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Link

Declarative navigation. No page reload.

```jsx
import { Link } from 'react-router-dom';

<nav>
  <Link to="/">Home</Link>
  <Link to="/products">Products</Link>
  <Link to="/about">About</Link>
</nav>
```

### NavLink

Link with active styling.

```jsx
import { NavLink } from 'react-router-dom';

<NavLink
  to="/dashboard"
  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
>
  Dashboard
</NavLink>
```

## useParams — Dynamic Segments

```jsx
function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(setProduct);
  }, [id]);

  return <div>{product?.name}</div>;
}
```

## useNavigate — Programmatic Navigation

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  // Go back
  <button onClick={() => navigate(-1)}>Back</button>
}
```

## Nested Routes (Outlet)

Layout component renders child routes via `<Outlet />`.

```jsx
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="app-layout">
      <header><Navbar /></header>
      <main>
        <Outlet /> {/* child route renders here */}
      </main>
      <footer><Footer /></footer>
    </div>
  );
}

// Route config
<Route element={<Layout />}>
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<Products />} />
  <Route path="/products/:id" element={<ProductDetail />} />
</Route>
```

### Relative paths in nested routes

```jsx
<Route path="dashboard" element={<DashboardLayout />}>
  <Route index element={<Overview />} />         {/* /dashboard */}
  <Route path="analytics" element={<Analytics />} /> {/* /dashboard/analytics */}
  <Route path="settings" element={<Settings />} />   {/* /dashboard/settings */}
</Route>
```

## Search Params

```jsx
import { useSearchParams } from 'react-router-dom';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;

  const setQuery = (q) => {
    setSearchParams({ q, page: '1' });
  };

  const nextPage = () => {
    setSearchParams(prev => ({
      ...Object.fromEntries(prev),
      page: String(page + 1),
    }));
  };

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={nextPage}>Next</button>
    </div>
  );
}
```

## Protected Routes

```jsx
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Usage
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/settings" element={<Settings />} />
  </Route>
  <Route path="*" element={<NotFound />} />
</Routes>
```

## Full Example

```jsx
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/dashboard/settings">Settings</Link>
      </nav>
      <Outlet />
    </div>
  );
}

function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/">Go home</Link>
    </div>
  );
}
```

## Pro Tips

- Use `element` prop (not `component`) in Route — React Router v6.
- Wrap routes in `<Routes>` — `<Switch>` is gone in v6.
- Use `index` attribute for default child route.
- Use `replace` for redirects (login → dashboard) to avoid back-button loops.
- Use `useLocation` state for passing data between routes (avoid URL params for non-serializable data).
- Nested routes inherit parent path — no need to repeat prefix.
- Lazy load route components with React.lazy + Suspense for code splitting.
- Use `relative="path"` for relative links in nested routes (v6.4+).
- Catch-all route `path="*"` must be last.
