# JSX Basics

## Overview

JSX = JavaScript XML. Syntax extension for React. Looks like HTML but compiles to `React.createElement` calls. Describes UI structure declaratively.

```jsx
// JSX
const element = <h1>Hello</h1>;

// Compiled to
const element = React.createElement('h1', null, 'Hello');
```

## Embedded Expressions `{}`

Use curly braces to embed any JavaScript expression inside JSX.

```jsx
const name = 'Alice';
const age = 30;

const element = (
  <div>
    <p>Name: {name}</p>
    <p>Age: {age}</p>
    <p>Next year: {age + 1}</p>
    <p>Uppercase: {name.toUpperCase()}</p>
  </div>
);
```

**Valid expressions**: strings, numbers, arrays, function calls, ternaries, objects (via `JSON.stringify`).

**Invalid**: statements like `if`, `for`, `switch`.

```jsx
// WRONG — statements don't work
const bad = <div>{if (true) 'yes'}</div>;

// RIGHT — use ternary
const good = <div>{isLoggedIn ? 'Welcome' : 'Login'}</div>;
```

## Attributes

React uses `camelCase` for most attributes.

```jsx
// className instead of class
const element = <div className="container">Content</div>;

// htmlFor instead of for
const label = <label htmlFor="email">Email</label>;

// Style takes object (camelCase keys)
const style = { backgroundColor: 'blue', fontSize: 16 };
const styled = <div style={style}>Styled</div>;

// Dynamic attributes
const type = 'text';
const input = <input type={type} disabled={isDisabled} />;
```

## Self-Closing Tags

Tags without children must self-close.

```jsx
// Correct
const img = <img src="photo.jpg" alt="Photo" />;
const br = <br />;
const input = <input type="text" />;

// Also correct with children
const div = <div>text</div>;
```

## Fragments

Fragments let you group children without adding extra DOM nodes.

```jsx
// Short syntax
function List() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  );
}

// Full syntax (needed for key prop)
function ListItems() {
  return (
    <React.Fragment key="group">
      <li>A</li>
      <li>B</li>
    </React.Fragment>
  );
}
```

## JavaScript in JSX

### Arrays render as lists

```jsx
const items = ['Apple', 'Banana', 'Cherry'];
const list = <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>;
```

### Ternary for conditional

```jsx
<div>{isDark ? <DarkTheme /> : <LightTheme />}</div>
```

### Short-circuit `&&`

```jsx
<div>{unreadCount > 0 && <span>{unreadCount}</span>}</div>
```

**Pitfall**: `0` renders as `0`. Always use boolean condition.

```jsx
// Renders "0" when count is 0
<div>{count && <span>{count}</span>}</div>;

// Safe
<div>{count > 0 && <span>{count}</span>}</div>;
```

### Functions in JSX

```jsx
function formatName(user) {
  return `${user.first} ${user.last}`;
}

const element = <h1>Hello, {formatName(user)}</h1>;
```

## Key Rules

1. **Single root element** — component must return one element (or fragment).

```jsx
// Wrong
function Bad() {
  return <h1>Title</h1><p>Body</p>;
}

// Correct
function Good() {
  return (
    <>
      <h1>Title</h1>
      <p>Body</p>
    </>
  );
}
```

2. **Close all tags** — even self-closing ones.

```jsx
// Wrong
<img src="x.jpg">
<br>

// Correct
<img src="x.jpg" />
<br />
```

3. **camelCase attributes** — `onClick`, `className`, `tabIndex`, `strokeWidth`.

4. **Reserved words** — `class` → `className`, `for` → `htmlFor`.

5. **Comments** — use `{/* comment */}` inside JSX.

```jsx
return (
  <div>
    {/* This is a comment */}
    <p>Visible content</p>
  </div>
);
```

## Pro Tips

- JSX prevents injection attacks by default (escapes values).
- Use parentheses for multi-line JSX to avoid ASI issues.
- Whitespace in JSX: text on separate lines renders a space.
- Boolean attributes: `disabled={true}` → `disabled`, `disabled={false}` → omitted.
- Spread attributes: `<Child {...props} />` passes all props.
