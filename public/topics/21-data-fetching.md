# Data Fetching

## Overview

Data fetching in React typically uses `useEffect` + `fetch`. Modern apps often use libraries (React Query, SWR) for caching, revalidation, and loading states.

## Basic Fetch with useEffect

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <UserTable users={users} />;
}
```

## Loading, Error, Success Pattern

```jsx
function DataFetcher({ url }) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState(prev => ({ ...prev, loading: true, error: null }));

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ data: null, loading: false, error: err });
      });

    return () => { cancelled = true; };
  }, [url]);

  const { data, loading, error } = state;

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorFallback error={error} />;
  if (!data || data.length === 0) return <EmptyState />;
  return <DataView data={data} />;
}
```

## AbortController for Cleanup

Cancel fetch when component unmounts or URL changes.

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/search?q=${query}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [query]);

  return <ResultsList results={results} loading={loading} />;
}
```

## Custom useFetch Hook

```jsx
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { ...options, signal: controller.signal })
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
function UsersPage() {
  const { data: users, loading, error } = useFetch('/api/users');

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <UserList users={users} />;
}
```

## Modern Approaches: React Query / SWR

### React Query (TanStack Query)

```jsx
import { useQuery } from '@tanstack/react-query';

function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  return <UserList users={data} />;
}
```

**Benefits**: caching, background refetch, retry, pagination, devtools.

### SWR

```jsx
import useSWR from 'swr';

const fetcher = url => fetch(url).then(r => r.json());

function Users() {
  const { data, error, isLoading } = useSWR('/api/users', fetcher);

  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  return <UserList users={data} />;
}
```

## Parallel Requests

```jsx
function Dashboard() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/posts').then(r => r.json()),
    ])
      .then(([usersData, postsData]) => {
        setUsers(usersData);
        setPosts(postsData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;
  return (
    <div>
      <UserSummary users={users} />
      <PostSummary posts={posts} />
    </div>
  );
}
```

## Dependent Requests

```jsx
function UserPosts({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(userData => {
        setUser(userData);
        return fetch(`/api/users/${userId}/posts`);
      })
      .then(r => r.json())
      .then(setPosts);
  }, [userId]);

  return (
    <div>
      <h2>{user?.name}</h2>
      <PostList posts={posts} />
    </div>
  );
}
```

## Caching Strategies

### Simple cache with useRef

```jsx
function useFetchWithCache(url) {
  const cache = useRef({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cache.current[url]) {
      setData(cache.current[url]);
      setLoading(false);
      return;
    }

    fetch(url)
      .then(r => r.json())
      .then(data => {
        cache.current[url] = data;
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}
```

## Pro Tips

- Always handle loading, error, and empty states.
- Use `AbortController` to cancel stale requests.
- Extract `useFetch` custom hook for reusability.
- For production apps, use React Query / SWR — they handle caching, dedup, refetch.
- Don't fetch in `useEffect` without cleanup for changing dependencies.
- Show loading skeleton matching content shape (avoid layout shift).
- Handle race conditions — slower response after faster one (use `cancelled` flag or AbortController).
- Consider error boundaries for network errors in large apps.
- Use `Promise.all` for parallel independent requests.
- Chain `.then()` for dependent requests.
