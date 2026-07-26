# Lists and Keys

## Overview

Render lists using `.map()`. Each list item needs `key` prop for React to identify changes (additions, removals, reorders).

```jsx
const items = ['Apple', 'Banana', 'Cherry'];

function FruitList() {
  return (
    <ul>
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}
```

## Why Keys Matter — Reconciliation

Keys help React identify which items changed, were added, or removed.

**Without keys** (index as key):

```jsx
// BAD — index as key
{items.map((item, index) => <ListItem key={index} item={item} />)}

// Problem: inserting at beginning shifts all indexes
// React re-renders everything instead of moving DOM nodes
```

**With stable keys**:

```jsx
// GOOD — unique ID as key
{todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
```

Without keys, React uses index by default — causes bugs with:
- List reordering
- Insert/delete at non-end positions
- List items with local state
- Animations

## Key Rules

1. **Stable** — same item always gets same key across renders.
2. **Unique** — no two siblings share same key.
3. **Predictable** — doesn't change between renders.

```jsx
// GOOD: database ID
{todos.map(todo => <li key={todo.id}>{todo.text}</li>)}

// GOOD: generated unique ID
{items.map(item => <li key={item.id}>{item.name}</li>)}

// BAD: array index
{items.map((item, i) => <li key={i}>{item}</li>)}

// BAD: random values
{items.map(item => <li key={Math.random()}>{item}</li>)}
```

### Key in Fragments

```jsx
import { Fragment } from 'react';

function BlogPosts({ posts }) {
  return posts.map(post => (
    <Fragment key={post.id}>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </Fragment>
  ));
}
```

## Examples

### List with stable IDs

```jsx
const initialTodos = [
  { id: 1, text: 'Learn React', done: false },
  { id: 2, text: 'Build project', done: false },
  { id: 3, text: 'Deploy app', done: false },
];

function TodoList() {
  const [todos, setTodos] = useState(initialTodos);

  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  return (
    <ul>
      {todos.map(todo => (
        <li
          key={todo.id}
          onClick={() => toggleTodo(todo.id)}
          style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
```

### List without keys (demonstrating the bug)

```jsx
// ❌ BUG DEMO — inputs lose focus on reorder
function BuggyList() {
  const [items, setItems] = useState(['a', 'b', 'c']);

  const reverse = () => setItems([...items].reverse());

  return (
    <div>
      <button onClick={reverse}>Reverse</button>
      {items.map((item, index) => (
        // No key or key=index — inputs reset when list reorders
        <div key={index}>
          {item}: <input />
        </div>
      ))}
    </div>
  );
}

// ✅ FIXED — use unique key
function FixedList() {
  const [items, setItems] = useState([
    { id: 1, value: 'a' },
    { id: 2, value: 'b' },
    { id: 3, value: 'c' },
  ]);

  const reverse = () => setItems([...items].reverse());

  return (
    <div>
      <button onClick={reverse}>Reverse</button>
      {items.map(item => (
        <div key={item.id}>
          {item.value}: <input />
        </div>
      ))}
    </div>
  );
}
```

### Dynamic list with add/remove

```jsx
function DynamicList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
  ]);
  const [input, setInput] = useState('');
  const nextId = useRef(3);

  const addItem = () => {
    if (!input.trim()) return;
    setItems(prev => [
      ...prev,
      { id: nextId.current++, text: input.trim() },
    ]);
    setInput('');
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div>
      <div>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button onClick={addItem}>Add</button>
      </div>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.text}
            <button onClick={() => removeItem(item.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Filtering and sorting

```jsx
function FilterableList() {
  const [items] = useState([
    { id: 1, name: 'React', category: 'frontend' },
    { id: 2, name: 'Node', category: 'backend' },
    { id: 3, name: 'CSS', category: 'frontend' },
    { id: 4, name: 'Postgres', category: 'backend' },
  ]);
  const [filter, setFilter] = useState('all');
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = items
    .filter(item => filter === 'all' || item.category === filter)
    .sort((a, b) =>
      sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <div>
      <select value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
      </select>
      <button onClick={() => setSortAsc(prev => !prev)}>
        {sortAsc ? 'A-Z' : 'Z-A'}
      </button>
      <ul>
        {filtered.map(item => (
          <li key={item.id}>{item.name} — {item.category}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Pro Tips

- Use stable IDs from your data (database IDs, UUIDs, unique slugs).
- If no ID exists, generate stable ones on data creation (NOT on render).
- Key must be unique among siblings, not globally.
- Never use `Math.random()` or `Date.now()` as keys — causes unnecessary remounts.
- Keys on fragment `<React.Fragment key={id}>` when no wrapper element.
- Key only works in array context — not needed on standalone elements.
- Changing a component's key unmounts old and mounts new (reset state trick).
- `key` prop is not accessible inside component — React uses it internally.
