# Testing

## Overview

Test React components with Vitest + React Testing Library. Focus on behavior (user interactions, rendered output), not implementation details.

## Setup

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

```js
// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
```

```js
// src/test/setup.js
import '@testing-library/jest-dom';
```

## Rendering Components

```jsx
import { render, screen } from '@testing-library/react';
import Greeting from './Greeting';

test('renders greeting with name', () => {
  render(<Greeting name="Alice" />);
  expect(screen.getByText('Hello, Alice!')).toBeInTheDocument();
});
```

## Querying Elements

| Query | Description | Example |
|-------|-------------|---------|
| `getByText` | Find by text content | `getByText('Submit')` |
| `getByRole` | Find by ARIA role | `getByRole('button')` |
| `getByLabelText` | Find by label | `getByLabelText('Email')` |
| `getByPlaceholderText` | Find by placeholder | `getByPlaceholderText('Enter name')` |
| `getByTestId` | Find by `data-testid` | `getByTestId('user-card')` |

### getBy vs findBy vs queryBy

```jsx
// getBy — throws if not found (for elements that MUST exist)
expect(screen.getByText('Submit')).toBeInTheDocument();

// queryBy — returns null if not found (for elements that MAY be absent)
expect(screen.queryByText('Error')).not.toBeInTheDocument();

// findBy — returns promise, waits up to 1000ms (for async elements)
const button = await screen.findByText('Loaded');
```

## User Events

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('increments counter on click', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const button = screen.getByRole('button');
  await user.click(button);
  await user.click(button);

  expect(screen.getByText('Count: 2')).toBeInTheDocument();
});
```

### fireEvent (legacy) vs userEvent (preferred)

```jsx
// fireEvent — dispatches single event, less realistic
fireEvent.click(button);

// userEvent — simulates full user interaction chain
await user.click(button);     // mousedown, mouseup, click
await user.type(input, 'hi'); // focus, keydown, keypress, input, keyup
await user.keyboard('{Enter}');
```

## Examples

### Test button click

```jsx
// Component
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
    </div>
  );
}

// Test
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

test('starts at 0 and increments', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  expect(screen.getByText('Count: 0')).toBeInTheDocument();

  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### Test form submission

```jsx
// Component
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" value={email}
             onChange={e => setEmail(e.target.value)} />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" value={password}
             onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

// Test
test('submits form with email and password', async () => {
  const user = userEvent.setup();
  const handleLogin = vi.fn(); // vitest mock

  render(<LoginForm onLogin={handleLogin} />);

  await user.type(screen.getByLabelText('Email'), 'alice@test.com');
  await user.type(screen.getByLabelText('Password'), 'secret123');
  await user.click(screen.getByRole('button', { name: 'Login' }));

  expect(handleLogin).toHaveBeenCalledWith({
    email: 'alice@test.com',
    password: 'secret123',
  });
});
```

### Test async loading

```jsx
// Component
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(u => { setUser(u); setLoading(false); })
      .catch(e => { setError(e); setLoading(false); });
  }, [userId]);

  if (loading) return <div aria-label="loading">Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>Name: {user.name}</div>;
}

// Test
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users/1', (req, res, ctx) => {
    return res(ctx.json({ id: 1, name: 'Alice' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('loads and displays user', async () => {
  render(<UserProfile userId={1} />);

  // Loading state
  expect(screen.getByLabelText('loading')).toBeInTheDocument();

  // Wait for user to appear
  const name = await screen.findByText('Name: Alice');
  expect(name).toBeInTheDocument();
});

test('handles fetch error', async () => {
  server.use(
    rest.get('/api/users/1', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(<UserProfile userId={1} />);
  const error = await screen.findByText(/Error/);
  expect(error).toBeInTheDocument();
});
```

### Mocking with Vitest

```jsx
// Mock a module
vi.mock('./api', () => ({
  fetchUsers: vi.fn(() => Promise.resolve([{ id: 1, name: 'Alice' }])),
}));

// Mock a hook
vi.mock('./useAuth', () => ({
  useAuth: () => ({ user: { name: 'Alice' }, isLoggedIn: true }),
}));
```

### Snapshot testing (use sparingly)

```jsx
test('matches snapshot', () => {
  const { container } = render(<Button variant="primary">Click</Button>);
  expect(container).toMatchSnapshot();
});
```

**Note**: Snapshots are brittle. Prefer explicit assertions for behavior.

## Testing Behavior, Not Implementation

```jsx
// ❌ Bad — tests implementation details
test('calls setState', () => {
  // Don't test internal state
});

// ✅ Good — tests behavior
test('shows welcome message after login', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByLabelText('Email'), 'user@test.com');
  await user.type(screen.getByLabelText('Password'), 'pass');
  await user.click(screen.getByRole('button'));

  expect(screen.getByText('Welcome!')).toBeInTheDocument();
});
```

## Pro Tips

- Prefer `getByRole` — accessible and semantic.
- Use `userEvent` over `fireEvent` for realistic interactions.
- Mock network with MSW (Mock Service Worker) — no actual fetch mocking.
- Avoid testing implementation (state values, internal functions).
- Test user flows: render → interact → assert on UI.
- Use `data-testid` as last resort (when no accessible selector).
- Keep tests close to components (co-located `__tests__` or `.test.jsx`).
- Run tests in watch mode during development.
- Coverage is a tool, not a goal — focus on critical user paths.
