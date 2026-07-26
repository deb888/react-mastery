# Forms

## Overview

Two approaches: controlled (React manages value via state) and uncontrolled (DOM manages value, React reads via ref). Controlled is preferred for most cases.

## Controlled Components

React state = single source of truth. Every input change updates state → re-render with new value.

```jsx
function ControlledForm() {
  const [name, setName] = useState('');

  const handleChange = (e) => setName(e.target.value);

  return (
    <div>
      <input type="text" value={name} onChange={handleChange} />
      <p>Hello, {name}</p>
    </div>
  );
}
```

### Common inputs

#### Text

```jsx
<input
  type="text"
  value={text}
  onChange={e => setText(e.target.value)}
/>
```

#### Textarea

```jsx
<textarea
  value={bio}
  onChange={e => setBio(e.target.value)}
  rows={4}
/>
```

#### Checkbox

```jsx
<input
  type="checkbox"
  checked={isSubscribed}
  onChange={e => setIsSubscribed(e.target.checked)}
/>
```

#### Radio

```jsx
<label>
  <input
    type="radio"
    name="gender"
    value="male"
    checked={gender === 'male'}
    onChange={e => setGender(e.target.value)}
  />
  Male
</label>
<label>
  <input
    type="radio"
    name="gender"
    value="female"
    checked={gender === 'female'}
    onChange={e => setGender(e.target.value)}
  />
  Female
</label>
```

#### Select

```jsx
<select value={role} onChange={e => setRole(e.target.value)}>
  <option value="">Select role</option>
  <option value="admin">Admin</option>
  <option value="user">User</option>
  <option value="guest">Guest</option>
</select>
```

## Uncontrolled Components

DOM manages value. Read values via ref when needed.

```jsx
import { useRef } from 'react';

function UncontrolledForm() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: nameRef.current.value,
      email: emailRef.current.value,
    };
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} type="text" defaultValue="" />
      <input ref={emailRef} type="email" defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

Use `defaultValue` (not `value`) for uncontrolled inputs.

## Form Validation

### Inline validation

```jsx
function ValidatedForm() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email';
        return '';
      case 'password':
        if (!value) return 'Password required';
        if (value.length < 6) return 'Min 6 characters';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(values).forEach(key => {
      const err = validate(key, values[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log('Submitted:', values);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="email" value={values.email}
               onChange={handleChange} onBlur={handleBlur} />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div>
        <input name="password" type="password" value={values.password}
               onChange={handleChange} onBlur={handleBlur} />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Submit validation

```jsx
function handleSubmit(e) {
  e.preventDefault();
  const errors = {};

  if (!name.trim()) errors.name = 'Name required';
  if (!email.includes('@')) errors.email = 'Invalid email';

  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }

  // Submit data
  api.submit({ name, email });
}
```

## onSubmit Handler

```jsx
function Form() {
  const [values, setValues] = useState(initial);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      await api.post('/submit', values);
      // success handling
    } catch (err) {
      // error handling
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Checkbox Group

```jsx
function CheckboxGroup() {
  const [selected, setSelected] = useState([]);

  const toggle = (value) => {
    setSelected(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const options = ['React', 'Vue', 'Angular', 'Svelte'];

  return (
    <div>
      {options.map(opt => (
        <label key={opt}>
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
          />
          {opt}
        </label>
      ))}
      <p>Selected: {selected.join(', ')}</p>
    </div>
  );
}
```

## Form Libraries Intro

### React Hook Form (performant, minimal re-renders)

```jsx
import { useForm } from 'react-hook-form';

function HookForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register('email', { required: true, pattern: /\S+@\S+/ })} />
      {errors.email && <span>Email required</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Formik (popular, imperative)

```jsx
import { Formik, Form, Field, ErrorMessage } from 'formik';

function FormikForm() {
  return (
    <Formik
      initialValues={{ email: '', name: '' }}
      validate={values => {
        const errors = {};
        if (!values.email) errors.email = 'Required';
        return errors;
      }}
      onSubmit={values => console.log(values)}
    >
      <Form>
        <Field name="email" type="email" />
        <ErrorMessage name="email" component="div" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}
```

## Pro Tips

- Prefer controlled components for validation, dynamic fields, and conditional UI.
- Uncontrolled OK for simple, non-validated forms.
- Use `e.preventDefault()` in `onSubmit` to stop page reload.
- Group related inputs with `name` attribute + single state object.
- Handle loading states during submission (`isSubmitting`).
- Debounce validation in `onChange` for performance.
- Use form libraries for complex forms (dynamic fields, multi-step, extensive validation).
- For accessibility: labels, `aria-describedby` for errors, fieldset/legend for groups.
