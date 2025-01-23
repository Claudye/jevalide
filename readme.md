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

Here's how simple it is to use Jevalide:

```javascript
import { Jevalide } from 'jevalide';

// Initialize the validator
const validator = Jevalide.init({
  messages: {
    required: 'This field is required',
    email: 'Please enter a valid email'
  }
});

// Validate a complete form
const form = validator.form({
  email: ['required', 'email'],
  password: ['required', 'minlength:8']
}, {
  email: 'user@example.com',
  password: '12345'
});

// Simple validation check
if (form.passes()) {
  console.log('All good!');
} else {
  console.log(form.getErrors());
  // Output: { password: 'Password must be at least 8 characters' }
}

// Need to validate a single input? No problem!
const emailValidator = validator.input({
  name: 'email',
  rules: ['required', 'email']
});

emailValidator.setValue('invalid-email');
console.log(emailValidator.getError());
// Output: 'Please enter a valid email'

// Add your own custom rules
validator.rule('username', (value) => ({
  passes: /^[a-zA-Z0-9_]+$/.test(value),
  value
}), 'Username can only contain letters, numbers and underscores');

// Supporting multiple languages? We've got you covered!
validator.translate('fr', {
  required: 'Ce champ est requis',
  email: 'Veuillez entrer une adresse email valide'
});

validator.setLocale('fr');
```

## Browser Usage

Simply include Jevalide in your HTML:

```html 
<script>
  const validator = Jevalide.init();
  
  // Validate your form
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
    }
  });
</script>
```

That's it! No complex setup, no configuration headaches - just clean, simple validation that works everywhere.