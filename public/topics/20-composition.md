# Composition

## Overview

Component composition = combining simple components to build complex UIs. React favors **composition over inheritance**. Uses `children`, named props, and compound components.

## children Prop Pattern

Pass JSX between opening and closing tags.

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Title</h2>
  <p>Content goes here</p>
</Card>
```

## Slot Pattern (Named Children via Props)

Pass JSX as props for multiple insertion points.

```jsx
function Layout({ header, sidebar, children, footer }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <div className="main">
        <aside>{sidebar}</aside>
        <article>{children}</article>
      </div>
      <footer>{footer}</footer>
    </div>
  );
}

<Layout
  header={<Header />}
  sidebar={<Sidebar />}
  footer={<Footer />}
>
  <MainContent />
</Layout>
```

### Explicit slot names

```jsx
function Card({ header, body, footer }) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{body}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

<Card
  header={<h2>Profile</h2>}
  body={<UserInfo user={user} />}
  footer={<button>Save</button>}
/>
```

## Compound Components Pattern

Set of components that work together implicitly sharing state via Context.

```jsx
const TabContext = createContext();

function Tabs({ defaultTab, children }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabContext);
  const isActive = activeTab === value;

  return (
    <button
      className={`tab ${isActive ? 'tab-active' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }) {
  const { activeTab } = useContext(TabContext);
  if (activeTab !== value) return null;
  return <div className="tab-panel">{children}</div>;
}
```

**Usage**:

```jsx
<Tabs defaultTab="profile">
  <TabList>
    <Tab value="profile">Profile</Tab>
    <Tab value="settings">Settings</Tab>
    <Tab value="billing">Billing</Tab>
  </TabList>
  <TabPanel value="profile"><UserProfile /></TabPanel>
  <TabPanel value="settings"><SettingsForm /></TabPanel>
  <TabPanel value="billing"><BillingInfo /></TabPanel>
</Tabs>
```

### Accordion compound component

```jsx
const AccordionContext = createContext();

function Accordion({ children }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ index, title, children }) {
  const { openIndex, setOpenIndex } = useContext(AccordionContext);
  const isOpen = openIndex === index;

  return (
    <div className="accordion-item">
      <button
        className="accordion-header"
        onClick={() => setOpenIndex(isOpen ? null : index)}
      >
        {title}
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="accordion-body">{children}</div>}
    </div>
  );
}

// Usage
<Accordion>
  <AccordionItem index={0} title="Section 1">
    <p>Content for section 1</p>
  </AccordionItem>
  <AccordionItem index={1} title="Section 2">
    <p>Content for section 2</p>
  </AccordionItem>
</Accordion>
```

## Specialization via Composition

Pass configured component as children to specialize behavior.

```jsx
function Dialog({ icon, title, children, actions }) {
  return (
    <div className="dialog">
      <div className="dialog-icon">{icon}</div>
      <h2 className="dialog-title">{title}</h2>
      <div className="dialog-body">{children}</div>
      <div className="dialog-actions">{actions}</div>
    </div>
  );
}

// Specialized warning dialog
function WarningDialog({ message, onConfirm, onCancel }) {
  return (
    <Dialog
      icon={<WarningIcon />}
      title="Are you sure?"
      actions={
        <>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} className="danger">Delete</button>
        </>
      }
    >
      <p>{message}</p>
    </Dialog>
  );
}
```

## Examples

### Card with header/body/footer

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
}

function CardFooter({ children }) {
  return <div className="card-footer">{children}</div>;
}

// Usage
<Card>
  <CardHeader><h2>User Profile</h2></CardHeader>
  <CardBody>
    <p>Name: John</p>
    <p>Email: john@example.com</p>
  </CardBody>
  <CardFooter>
    <button>Edit</button>
    <button>Delete</button>
  </CardFooter>
</Card>
```

### Modal with different content

```jsx
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    portalRoot
  );
}

// Different modals using same Modal component
<Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)}>
  <h2>Confirm Delete</h2>
  <p>This cannot be undone.</p>
  <button onClick={handleDelete}>Delete</button>
  <button onClick={() => setShowConfirm(false)}>Cancel</button>
</Modal>

<Modal isOpen={showSettings} onClose={() => setShowSettings(false)}>
  <h2>Settings</h2>
  <SettingsForm />
</Modal>
```

## Pro Tips

- Composition is more flexible than inheritance — no deep class hierarchies.
- `children` works for simple wrappers. Slots for multiple insertion points.
- Compound components via Context give implicit state sharing.
- Keep composition APIs intuitive — what makes sense at usage site?
- Extract sub-components when a component grows too large.
- Compound components pattern is used by libraries (React Router's `<Routes><Route>`, `<select><option>`).
- For highly dynamic layouts, use render props or slot props.
- Test composition — ensure children render correctly in all placements.
