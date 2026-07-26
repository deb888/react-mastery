# Suspense

## Overview

`React.Suspense` declares loading states for components that need async data or code. Shows `fallback` while waiting.

```jsx
import { Suspense, lazy } from 'react';

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## React.lazy — Code Splitting

Dynamically imported component. Loaded on demand, not at initial bundle.

```jsx
import { lazy, Suspense } from 'react';

// Static import (bundled together)
import HomePage from './HomePage';

// Dynamic import (separate chunk, loaded when rendered)
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={
          <Suspense fallback={<DashboardSkeleton />}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

Each `lazy()` call creates separate chunk. Browser loads chunk on demand.

### Named exports

```jsx
const AdminPanel = lazy(() =>
  import('./Admin').then(module => ({ default: module.AdminPanel }))
);
```

## Suspense with Data Fetching (React 18+)

Suspense integrates with data frameworks (Relay, SWR, React Query) for loading states.

```jsx
// With React Query
<Suspense fallback={<UsersSkeleton />}>
  <UserList />
</Suspense>

// UserList uses useQuery with suspense: true
function UserList() {
  const { data } = useQuery('users', fetchUsers, { suspense: true });
  return <UserTable users={data} />;
}
```

**Note**: Vanilla `useEffect` + `useState` fetch does NOT trigger Suspense. Need suspending data source.

## fallback Prop

What to render while suspended content loads.

```jsx
// Simple
<Suspense fallback={<Spinner />}>
  <Content />
</Suspense>

// Skeleton
<Suspense fallback={<CardSkeleton />}>
  <UserCard user={user} />
</Suspense>

// Nothing (content appears when ready)
<Suspense fallback={null}>
  <Content />
</Suspense>
```

## Suspense Boundaries Nesting

Multiple boundaries let you reveal content progressively.

```jsx
function Page() {
  return (
    <div>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header /> {/* loads fast — small chunk */}
      </Suspense>

      <Suspense fallback={<MainSkeleton />}>
        <Main /> {/* loads slower — big chunk */}
      </Suspense>

      <Suspense fallback={<FooterSkeleton />}>
        <Footer /> {/* independent chunk */}
      </Suspense>
    </div>
  );
}
```

### Nested boundaries

```jsx
<Suspense fallback={<PageSkeleton />}>
  <Layout>
    <Suspense fallback={<SidebarSkeleton />}>
      <Sidebar />
    </Suspense>
    <Suspense fallback={<ContentSkeleton />}>
      <Content />
    </Suspense>
  </Layout>
</Suspense>
```

Outer boundary catches any unhandled suspense inside.

## Error Handling

Wrap Suspense with ErrorBoundary.

```jsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <Suspense fallback={<Spinner />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>
```

Order: `ErrorBoundary > Suspense > Content`.

## Examples

### Lazy-loaded component

```jsx
import { lazy, Suspense, useState } from 'react';

const MarkdownEditor = lazy(() => import('./MarkdownEditor'));

function EditorPage() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow(true)}>Open Editor</button>

      <Suspense fallback={<div>Loading editor...</div>}>
        {show && <MarkdownEditor />}
      </Suspense>
    </div>
  );
}
```

### Suspense with async data (conceptual — needs suspending library)

```jsx
function ProfilePage() {
  return (
    <div className="profile-page">
      <h1>Profile</h1>

      <ErrorBoundary fallback={<ProfileErrorFallback />}>
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileDetails userId={userId} />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<PostsErrorFallback />}>
        <Suspense fallback={<PostsSkeleton />}>
          <UserPosts userId={userId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
```

### Route-level code splitting

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

## Pro Tips

- Always wrap `lazy()` components in `<Suspense>` — error otherwise.
- Each `lazy()` call creates single chunk. Use webpack magic comments for chunk naming.
- Suspense is declarative — no imperative `isLoading` flags.
- Nest Suspense for progressive loading (small chunks first).
- Fallback should match content size to avoid layout shift.
- Not yet for `useEffect` data fetching — need Suspense-enabled data library.
- React 19 expected to expand Suspense for async functions and new features.
- Combine with ErrorBoundary for complete loading+error UX.
