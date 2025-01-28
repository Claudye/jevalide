# Jevalide

Tired of writing complex validation logic? Jevalide is your solution for clean, maintainable form validation that just works.

## Why Choose Jevalide?

Write your validation rules once and use them everywhere. Jevalide is a lightweight validation library that works seamlessly in both browser and Node.js environments. Whether you're building a complex web application or a simple Node.js service, Jevalide has got you covered.

No complexity - just simple, powerful validation when you need it.

## Installation

Using npm:
```bash
npm install jevalide
```

## Quick Start

Jevalide simplifies validation with minimal setup. Here's how it works:

### Simple Validation with `validate`

The `Jevalide.validate` method is perfect for quickly validating data without additional configuration:

```javascript
// Import Jevalide
import { Jevalide } from 'jevalide';

const data = {
  email: 'test@example.com',
  password: '12345'
};

const rules = {
  email: ['required', 'email'],
  password: ['required', 'minlength:8']
};

const validator = Jevalide.validate(data, rules);

if (validator.isValid()) {
  console.log('Validation passed!');
} else {
  console.log(validator.getErrors());
  // Output: { password: 'Password must be at least 8 characters' }
}
```

### Customize with `init`

The `Jevalide.init` method allows you to set up global configurations, such as custom rules, messages, and locales:

```javascript
// Initialize with custom options
const validator = Jevalide.init({
  rules: {
    customRule: (value) => ({
      passes: /^[a-zA-Z]+$/.test(value),
      value
    })
  },
  messages: {
    required: 'This field is required',
    email: 'Please enter a valid email',
    customRule: 'Only letters are allowed'
  },
  local: 'en'
});
```

### Validate Forms

Effortlessly validate entire forms:

```javascript
const form = validator.form({
  email: ['required', 'email'],
  password: ['required', 'minlength:8']
}, {
  email: 'user@example.com',
  password: '12345'
});

if (form.passes()) {
  console.log('All good!');
} else {
  console.log(form.getErrors());
  // Output: { password: 'Password must be at least 8 characters' }
}
```

### Input Validation

Handle single input validation:

```javascript
const emailValidator = validator.input({
  name: 'email',
  rules: ['required', 'email']
});

emailValidator.setValue('invalid-email');
console.log(emailValidator.getError());
// Output: 'Please enter a valid email'
```

### Custom Rules Made Easy

Add your own validation logic:

```javascript
validator.rule('username', (value) => ({
  passes: /^[a-zA-Z0-9_]+$/.test(value),
  value
}), 'Username can only contain letters, numbers, and underscores');
```

### Support for Multiple Languages

Customize messages for different locales:

```javascript
validator.translate('fr', {
  required: 'Ce champ est requis',
  email: 'Veuillez entrer une adresse email valide'
});

validator.setLocale('fr');
```

## Usage in Different Environments

### Node.js

For CommonJS environments:
```javascript
const { Jevalide } = require('jevalide');
```

### Browser

For browser environments, simply include Jevalide in your HTML:

```html
<script>
  const validator = Jevalide.init({
    messages: {
      required: 'This field is required',
      email: 'Please enter a valid email'
    }
  });

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    const form = validator.form({
      email: ['required', 'email'],
      password: ['required', 'minlength:8']
    }, {
      email: document.querySelector('input[name="email"]').value,
      password: document.querySelector('input[name="password"]').value
    });

    if (form.passes()) {
      // Submit the form
    } else {
      console.log(form.getErrors());
    }
  });
</script>
```

---

With Jevalide, validation is no longer a hassle. Customize once, reuse everywhere, and keep your validation logic clean and maintainable.

