# Reducers (useReducer)

## Overview

`useReducer` manages complex state logic with predictable state transitions. Alternative to `useState` when state updates involve multiple sub-values or depend on previous state.

```jsx
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <button onClick={() => dispatch({ type: 'increment' })}>
      Count: {state.count}
    </button>
  );
}
```

## Reducer Function Pattern

Pure function that takes `(state, action)` and returns `newState`.

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    case 'set':
      return { ...state, count: action.payload };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
```

## Action Types

Actions are objects with `type` (required convention) and optional `payload`.

```jsx
// String type
dispatch({ type: 'increment' });

// With payload
dispatch({ type: 'addTodo', payload: { id: 1, text: 'Learn React' } });

// Action creator function
const addTodo = (text) => ({
  type: 'addTodo',
  payload: { id: Date.now(), text },
});
dispatch(addTodo('Learn reducers'));
```

## When useReducer > useState

| useReducer | useState |
|-----------|----------|
| Complex state (objects with multiple fields) | Simple independent values |
| Next state depends on previous | Independent updates |
| State logic is non-trivial (multiple transitions) | Single value, few transitions |
| State logic should be testable in isolation | Trivial logic inline |
| Dispatch actions for dev tools / logging | Simple setter |

## Decision Guide

```jsx
// useState for simple
const [count, setCount] = useState(0);
const [name, setName] = useState('');

// useReducer for complex
const [todos, dispatch] = useReducer(todoReducer, []);
const [form, dispatch] = useReducer(formReducer, initialForm);
```

## Examples

### 1. Counter

```jsx
const initialState = { count: 0 };

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    case 'reset': return initialState;
    case 'add': return { count: state.count + action.payload };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'add', payload: 5 })}>+5</button>
    </div>
  );
}
```

### 2. Todo list

```jsx
function todoReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now(), text: action.payload, done: false }];
    case 'toggle':
      return state.map(t =>
        t.id === action.payload ? { ...t, done: !t.done } : t
      );
    case 'remove':
      return state.filter(t => t.id !== action.payload);
    case 'clear':
      return state.filter(t => !t.done);
    default:
      return state;
  }
}

function TodoApp() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch({ type: 'add', payload: text.trim() });
      setText('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={text} onChange={e => setText(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
              onClick={() => dispatch({ type: 'toggle', payload: todo.id })}
            >
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: 'remove', payload: todo.id })}>x</button>
          </li>
        ))}
      </ul>
      {todos.some(t => t.done) && (
        <button onClick={() => dispatch({ type: 'clear' })}>Clear Done</button>
      )}
    </div>
  );
}
```

### 3. Form state management

```jsx
const initialForm = {
  values: { name: '', email: '', age: '' },
  errors: {},
  touched: {},
  isSubmitting: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case 'change':
      return {
        ...state,
        values: { ...state.values, [action.payload.name]: action.payload.value },
      };
    case 'blur':
      return {
        ...state,
        touched: { ...state.touched, [action.payload.name]: true },
      };
    case 'setErrors':
      return { ...state, errors: action.payload };
    case 'submit':
      return { ...state, isSubmitting: true };
    case 'success':
      return { ...initialForm };
    case 'error':
      return { ...state, isSubmitting: false, errors: action.payload };
    default:
      return state;
  }
}

function SignupForm() {
  const [form, dispatch] = useReducer(formReducer, initialForm);

  const validate = () => {
    const errors = {};
    if (!form.values.name) errors.name = 'Required';
    if (!form.values.email) errors.email = 'Required';
    dispatch({ type: 'setErrors', payload: errors });
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch({ type: 'submit' });
    api.signup(form.values)
      .then(() => dispatch({ type: 'success' }))
      .catch(err => dispatch({ type: 'error', payload: err }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.values.name}
        onChange={e => dispatch({ type: 'change', payload: e.target })}
        onBlur={e => dispatch({ type: 'blur', payload: e.target })}
      />
      {form.touched.name && form.errors.name && <span>{form.errors.name}</span>}
      <button disabled={form.isSubmitting}>Submit</button>
    </form>
  );
}
```

## Lazy Initialization

Pass initializer function as third arg.

```jsx
function init(initialCount) {
  return { count: initialCount };
}

const [state, dispatch] = useReducer(reducer, 10, init);
// state.count starts at 10
```

## Pro Tips

- Reducer must be **pure** — no side effects, no async, no random values.
- Action types as string constants to avoid typos.
- Use `switch` with `default` throwing error for unhandled actions.
- Combine with `useContext` for global state (simple Redux alternative).
- Reducer logic is testable in isolation — pure function.
- TypeScript: type `State` and `Action` with discriminated unions.
- For truly global state, consider zustand/Redux — `useReducer` + Context works for medium apps.
