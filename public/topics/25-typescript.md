# TypeScript with React

## Overview

TypeScript adds static typing to React — catch bugs at compile time, improve autocompletion, and document component APIs.

```bash
npm create vite@latest my-app -- --template react-ts
```

## Typing Props

### type vs interface

Both work. `type` for unions/utility types, `interface` for object shapes (can be extended).

```tsx
// type
type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
};

// interface
interface User {
  id: number;
  name: string;
  email: string;
}

// Extending interface
interface AdminUser extends User {
  role: 'admin';
  permissions: string[];
}
```

### Using props in components

```tsx
type GreetingProps = {
  name: string;
  age?: number;
};

function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <p>Hello, {name}</p>
      {age !== undefined && <p>Age: {age}</p>}
    </div>
  );
}
```

### With default values

```tsx
function Button({
  label = 'Click',
  variant = 'primary',
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
```

## Children Prop Typing

```tsx
// ReactNode — any renderable content
type CardProps = {
  children: React.ReactNode;
  title: string;
};

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### Typing specific children

```tsx
type ListProps = {
  children: React.ReactElement<{ name: string }> | React.ReactElement<{ name: string }>[];
};
```

## useState Type Inference

```tsx
// Inferred
const [count, setCount] = useState(0);     // count: number
const [name, setName] = useState('');       // name: string
const [isReady, setIsReady] = useState(false); // isReady: boolean

// Explicit type (needed for null/union initial values)
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<Item[]>([]);

// Lazy initializer typed
const [data, setData] = useState<Data>(() => {
  return computeExpensiveData();
});
```

## useRef Typing

```tsx
// DOM ref
const inputRef = useRef<HTMLInputElement>(null);
// inputRef.current: HTMLInputElement | null

// Mutable value (not DOM)
const countRef = useRef<number>(0);
// countRef.current: number

// Example
function AutoFocus() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // optional chaining since null initially
  }, []);

  return <input ref={inputRef} type="text" />;
}
```

## Event Handlers Typing

```tsx
// Specific event types
function InputField() {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return <input value={value} onChange={handleChange} />;
}

// Common event types
type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type ClickEvent = React.MouseEvent<HTMLButtonElement>;
type SubmitEvent = React.FormEvent<HTMLFormElement>;
type KeyEvent = React.KeyboardEvent<HTMLInputElement>;
type FocusEvent = React.FocusEvent<HTMLInputElement>;
```

### Inline event handlers

```tsx
<button
  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleClick(id);
  }}
>
  Click
</button>

<form onSubmit={(e: React.FormEvent) => {
  e.preventDefault();
  handleSubmit();
}}>
  <input onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value)
  } />
</form>
```

## Generic Components

Reusable component that works with multiple types.

```tsx
type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}

// Usage — type inferred
<List
  items={users}
  renderItem={(user) => <li>{user.name}</li>}
/>;

// Explicit type
<List<User>
  items={users}
  renderItem={(user) => <li>{user.name}</li>}
/>;
```

### Generic with constraints

```tsx
interface HasId {
  id: number;
}

function List<T extends HasId>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(item => <li key={item.id}>{renderItem(item)}</li>)}</ul>;
}
```

## Typing Custom Hooks

```tsx
function useLocalStorage<T>(key: string, initial: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  const set = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, set];
}

// Usage — type inferred
const [theme, setTheme] = useLocalStorage('theme', 'light');
// theme: string
const [count, setCount] = useLocalStorage('count', 0);
// count: number
```

### Typing fetch hook

```tsx
type UseFetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then(res => res.json() as Promise<T>)
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
type User = { id: number; name: string };
const { data: users } = useFetch<User[]>('/api/users');
```

## Patterns

### Props extending HTML elements

```tsx
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

function Input({ label, error, ...inputProps }: InputProps) {
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

### Discriminated unions for state

```tsx
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function useData<T>(url: string): RequestState<T> {
  const [state, setState] = useState<RequestState<T>>({ status: 'idle' });

  useEffect(() => {
    setState({ status: 'loading' });
    fetch(url)
      .then(r => r.json() as Promise<T>)
      .then(data => setState({ status: 'success', data }))
      .catch(err => setState({ status: 'error', error: err.message }));
  }, [url]);

  return state;
}

// Usage — exhaustive switch
function UserProfile({ userId }: { userId: number }) {
  const state = useData<User>(`/api/users/${userId}`);

  switch (state.status) {
    case 'idle':
    case 'loading':
      return <Spinner />;
    case 'error':
      return <Error message={state.error} />;
    case 'success':
      return <UserCard user={state.data} />;
  }
}
```

## Pro Tips

- Prefer `interface` for public component APIs (can be extended).
- Use `type` for unions, intersections, and utility types.
- Let TypeScript infer types when possible (return types, useState).
- Use `satisfies` operator for complex type checking (TS 4.9+).
- Type event handlers explicitly — `React.ChangeEvent<HTMLInputElement>`.
- Use `as const` for literal action types in reducers.
- Generic components improve reusability — type the generic parameter.
- `forwardRef` with generics needs type assertion or overloads.
- Use `ComponentPropsWithoutRef<'button'>` to extend native element props.
- tsconfig: `"strict": true` catches more errors at compile time.
