const topics = [
  { id: '01-jsx-basics', title: 'JSX Basics', icon: '⚛️', category: 'Fundamentals' },
  { id: '02-components', title: 'Components', icon: '🧩', category: 'Fundamentals' },
  { id: '03-props', title: 'Props', icon: '📤', category: 'Fundamentals' },
  { id: '04-state', title: 'State (useState)', icon: '🎯', category: 'Hooks' },
  { id: '05-effects', title: 'Effects (useEffect)', icon: '🔄', category: 'Hooks' },
  { id: '06-context', title: 'Context API', icon: '🌐', category: 'Hooks' },
  { id: '07-reducers', title: 'Reducers (useReducer)', icon: '📋', category: 'Hooks' },
  { id: '08-refs', title: 'Refs (useRef)', icon: '🔗', category: 'Hooks' },
  { id: '09-memo', title: 'Memo & Callback', icon: '⚡', category: 'Hooks' },
  { id: '10-custom-hooks', title: 'Custom Hooks', icon: '🪝', category: 'Hooks' },
  { id: '11-hoc', title: 'Higher-Order Components', icon: '🎭', category: 'Patterns' },
  { id: '12-render-props', title: 'Render Props', icon: '🎨', category: 'Patterns' },
  { id: '13-error-boundaries', title: 'Error Boundaries', icon: '🛡️', category: 'Patterns' },
  { id: '14-suspense', title: 'Suspense & Lazy', icon: '⏳', category: 'Patterns' },
  { id: '15-portals', title: 'Portals', icon: '🚪', category: 'Patterns' },
  { id: '16-forms', title: 'Forms & Validation', icon: '📝', category: 'Essentials' },
  { id: '17-lists-keys', title: 'Lists & Keys', icon: '📊', category: 'Essentials' },
  { id: '18-events', title: 'Event Handling', icon: '👆', category: 'Essentials' },
  { id: '19-conditional', title: 'Conditional Rendering', icon: '🔀', category: 'Essentials' },
  { id: '20-composition', title: 'Composition', icon: '🏗️', category: 'Patterns' },
  { id: '21-data-fetching', title: 'Data Fetching', icon: '📡', category: 'Essentials' },
  { id: '22-routing', title: 'React Router', icon: '🧭', category: 'Ecosystem' },
  { id: '23-performance', title: 'Performance', icon: '🏎️', category: 'Advanced' },
  { id: '24-testing', title: 'Testing', icon: '🧪', category: 'Advanced' },
  { id: '25-typescript', title: 'TypeScript', icon: '📘', category: 'Advanced' },
]

export const categories = [...new Set(topics.map(t => t.category))]

export default topics
