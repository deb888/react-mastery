# Performance

## Overview

React performance optimization focuses on reducing unnecessary re-renders and computation. Tools: `React.memo`, `useMemo`, `useCallback`, virtualization, code splitting.

## React.memo — Component Memoization

Skip re-render when props haven't changed (shallow comparison).

```jsx
import { memo } from 'react';

const ListItem = memo(function ListItem({ item, onSelect }) {
  console.log('Rendering:', item.id);
  return (
    <li onClick={() => onSelect(item.id)}>
      {item.name}
    </li>
  );
});
```

**When to use**:
- Component renders often with same props
- Component subtree is expensive to re-render
- Component is leaf in tree (no children)

**When NOT to use**:
- Props change every render (comparison overhead > render cost)
- Trivial component (div with text)

## useMemo — Value Memoization

Memoize expensive calculation results.

```jsx
function Report({ transactions, filters }) {
  // Without useMemo — recalculates every render
  const filteredData = transactions.filter(t => {
    return t.date >= filters.start && t.date <= filters.end;
  });

  // With useMemo — recalculates only when deps change
  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      return t.date >= filters.start && t.date <= filters.end;
    });
  }, [transactions, filters]);

  return <Chart data={filteredData} />;
}
```

### Expensive computation

```jsx
function PrimeCalculator({ max }) {
  const primes = useMemo(() => {
    console.log('Computing primes...');
    const result = [];
    for (let i = 2; i <= max; i++) {
      if (isPrime(i)) result.push(i);
    }
    return result;
  }, [max]);

  return <p>Found {primes.length} primes</p>;
}
```

## useCallback — Function Memoization

Stable function references — prevents child re-renders.

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  // Stable — setCount is already stable, but this shows pattern
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // Stable — only recreates when items change
  const addItem = useCallback((item) => {
    setItems(prev => [...prev, item]);
  }, []);

  return (
    <div>
      <CountDisplay count={count} onIncrement={increment} />
      <ItemList items={items} onAdd={addItem} />
    </div>
  );
}
```

## Virtualization (react-window)

Render only visible items in long lists.

```jsx
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
      width={300}
    >
      {Row}
    </FixedSizeList>
  );
}
```

## Code Splitting with lazy

Split bundle into smaller chunks loaded on demand.

```jsx
import { lazy, Suspense } from 'react';

const AdminPanel = lazy(() => import('./AdminPanel'));
const Analytics = lazy(() => import('./Analytics'));

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div>
      <button onClick={() => setShowAdmin(true)}>Admin</button>

      <Suspense fallback={<div>Loading...</div>}>
        {showAdmin && <AdminPanel />}
      </Suspense>
    </div>
  );
}
```

## Avoiding Unnecessary Re-renders

### 1. Colocate state

```jsx
// ❌ Bad — state in parent causes all children to re-render
function Page() {
  const [search, setSearch] = useState('');
  return (
    <div>
      <SearchInput value={search} onChange={setSearch} />
      <Header />      {/* re-renders on search */}
      <Sidebar />     {/* re-renders on search */}
      <MainContent /> {/* re-renders on search */}
    </div>
  );
}

// ✅ Good — state in SearchInput only
function Page() {
  return (
    <div>
      <SearchInput />
      <Header />
      <Sidebar />
      <MainContent />
    </div>
  );
}
```

### 2. Lift content up

```jsx
// ❌ Bad — JSX recreated every render
function Parent() {
  return (
    <ExpensiveWrapper>
      <Child />
    </ExpensiveWrapper>
  );
}

// ✅ Good — pass as children, stable reference
function Parent({ children }) {
  return <ExpensiveWrapper>{children}</ExpensiveWrapper>;
}

// Usage
<Parent>
  <Child />
</Parent>
```

### 3. Key prop optimization

Use stable keys for lists — avoid index.

```jsx
// ❌ Index key — React can't track items
{todos.map((todo, i) => <TodoItem key={i} todo={todo} />)}

// ✅ Unique ID — React can add/remove/reorder
{todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
```

## Profiling with React DevTools

```jsx
// 1. Install React DevTools
// 2. Open Profiler tab
// 3. Record interactions
// 4. Identify: unnecessary renders, slow components, large re-render trees
```

**What to look for**:
- Components re-rendering without prop changes
- Large component trees re-rendering from small state changes
- Expensive computations running on every render

## Examples

### Memo demo

```jsx
const ExpensiveChild = memo(function ExpensiveChild({ value }) {
  console.log('ExpensiveChild render');
  return (
    <div className="expensive">
      {Array(1000).fill(null).map((_, i) => (
        <span key={i}>{value}</span>
      ))}
    </div>
  );
});

function App() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState('hello');

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <button onClick={() => setValue(value + '!')}>Change Value</button>
      {/* Only re-renders when value changes */}
      <ExpensiveChild value={value} />
    </div>
  );
}
```

### List virtualization concept

```jsx
function LargeList({ items }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  const itemHeight = 50;
  const containerHeight = 400;

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={() => setScrollTop(containerRef.current.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight }}>
        {visibleItems.map((item, i) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: (startIndex + i) * itemHeight,
              height: itemHeight,
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Pro Tips

- Profile **before** optimizing — don't guess.
- `React.memo` is free for leaf components, expensive for large prop objects.
- `useMemo`/`useCallback` are for referential stability, not just "expensive calc".
- Move state down to smallest common ancestor.
- Libraries like zustand/jotai avoid Context re-render issues.
- Bundle analysis: `vite-bundle-visualizer` or `webpack-bundle-analyzer`.
- Images: lazy loading (`loading="lazy"`), responsive sizes, WebP.
- Avoid creating new objects/arrays in render — they break memoization.
- Keys reset component state — use for forcing re-mount (not a perf trick per se).
- React 18 automatic batching reduces renders — still need memo for pure component skipping.
