# Portals

## Overview

Portal renders children into a different DOM node outside parent hierarchy. Useful for overlays that need to escape overflow/ z-index / clipping boundaries.

```jsx
import { createPortal } from 'react-dom';

function PortalComponent({ children }) {
  return createPortal(children, document.getElementById('portal-root'));
}
```

## Basic Usage

```jsx
// index.html — portal target
<body>
  <div id="root"></div>
  <div id="portal-root"></div>
</body>

// React component
import { createPortal } from 'react-dom';

function Portal({ children }) {
  return createPortal(
    children,
    document.getElementById('portal-root')
  );
}
```

## Use Cases

### 1. Modal

```jsx
import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';

function Modal({ open, onClose, children }) {
  if (!open) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>x</button>
        {children}
      </div>
    </div>,
    document.getElementById('portal-root')
  );
}

// Usage
function App() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ overflow: 'hidden' }}>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2>Modal Title</h2>
        <p>This content is rendered outside parent DOM hierarchy.</p>
      </Modal>
    </div>
  );
}
```

### 2. Tooltip

```jsx
function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const showTooltip = () => {
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
    setVisible(true);
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </span>

      {visible && createPortal(
        <div className="tooltip" style={{ top: position.top, left: position.left }}>
          {text}
        </div>,
        document.getElementById('portal-root')
      )}
    </>
  );
}
```

### 3. Dropdown menu

```jsx
function Dropdown({ trigger, children }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const handleClick = () => {
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom, left: rect.left });
    setOpen(!open);
  };

  return (
    <>
      <span ref={btnRef} onClick={handleClick}>
        {trigger}
      </span>

      {open && createPortal(
        <div className="dropdown-menu" style={{ position: 'fixed', top: pos.top, left: pos.left }}>
          {children}
          <button onClick={() => setOpen(false)}>Close</button>
        </div>,
        document.getElementById('portal-root')
      )}
    </>
  );
}
```

### 4. Toast notifications

```jsx
function ToastContainer() {
  return createPortal(
    <div className="toast-container">
      {/* Toasts rendered here, outside app DOM */}
    </div>,
    document.getElementById('portal-root')
  );
}

function Toast({ message, type = 'info' }) {
  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
}
```

## Portal Event Bubbling

Events bubble through React tree, not DOM tree.

```jsx
<div onClick={() => console.log('Parent click')}>
  <Portal>
    <button onClick={() => console.log('Button click')}>
      Inside Portal
    </button>
  </Portal>
</div>

// Clicking button logs:
// "Button click"
// "Parent click"  ← bubbles through React tree, not DOM
```

**IMPORTANT**: Portal content is child of different DOM node but event bubbling follows React component hierarchy. This is intentional — portals don't break event propagation as expected.

## Accessibility

```jsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, onClose, children, title }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;

    // Focus trap inside modal
    const firstFocusable = modalRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();

    return () => prev?.focus();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose} aria-label="Close modal">
          Close
        </button>
      </div>
    </div>,
    document.getElementById('portal-root')
  );
}
```

## Pro Tips

- Add `role="dialog"` and `aria-modal="true"` for accessible modals.
- Trap focus inside portal for keyboard navigation.
- Close on Escape key + overlay click for good UX.
- Portal target should exist before mount — add `<div id="portal-root">` to HTML.
- Body scroll lock when modal is open (`overflow: hidden` on body).
- Portals are for DOM escape, not for styling — keep z-index/overflow needs.
- Events from portal content bubble to React ancestors, not DOM ancestors.
- Multiple portals can share same target div.
