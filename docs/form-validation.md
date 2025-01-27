# FormValidator

The `FormValidator` class is a powerful and flexible form validation solution that provides comprehensive validation capabilities for both simple and complex form structures. It supports nested objects, custom validation rules, and event-driven validation workflows.

## Features

- Nested object validation
- Extensive event system for validation lifecycle
- Custom validation rules
- Validation state management
- Field-level and form-level validation
- Easy error handling
- Chainable API

## Basic Usage

```javascript
import { Jevalide } from 'jevalide';

const { form } = Jevalide.init();

const validator = form(
  {
    name: 'required|min:3',
    email: 'required|email',
    'profile.age': 'required|number|min:18'
  },
  {
    name: 'John',
    email: 'john@example.com',
    profile: { age: 25 }
  }
);

if (validator.isValid()) {
  // Form is valid, proceed with submission
  console.log(validator.getData());
} else {
  // Handle validation errors
  console.log(validator.errors);
}
```

## Constructor

```javascript
const validator = form(inputs, data, config)
```

Creates a new FormValidator instance.

- `inputs`: Validation rules for form fields
- `data`: Initial form data
- `config`: Optional configuration object

## Core Methods

### Data Management

#### `setData(data)`
Sets the form data.

```javascript
validator.setData({ name: 'John', email: 'john@example.com' });
```

#### `mergeData(data)`
Merges new data with existing form data.

```javascript
validator.mergeData({ name: 'John' }); // Only updates the name field
```

#### `getData()`
Retrieves the current form data.

```javascript
const data = validator.getData();
```

### Validation

#### `isValid()`
Validates all form inputs and returns the overall validation status.

```javascript
if (validator.isValid()) {
  // Proceed with form submission
}
```

#### `with(callback)`
Adds a custom validation rule at the form level.

```javascript
validator.with(form => {
  const data = form.getData();
  return data.password === data.passwordConfirmation;
});
```

### Error Handling

#### `errors`
Get validation errors for all failed fields.

```javascript
const errors = validator.errors;
// { email: 'Please enter a valid email address' }
```

### Event Handling

#### `onPasses(callback)`
Register a callback for when validation passes.

```javascript
validator.onPasses((form) => {
  console.log('Validation passed!');
});
```

#### `onFails(callback)`
Register a callback for when validation fails.

```javascript
validator.onFails((form) => {
  console.log('Validation failed:', form.errors);
});
```

#### `onValidate(callback)`
Register a callback that runs after validation, regardless of the result.

```javascript
validator.onValidate((form) => {
  console.log('Validation completed');
});
```

### Input Management

#### `addInput(inputInstance)`
Add a new input validator to the form.

```javascript
const { input } = Jevalide.init();
validator.addInput(
  input({
    name: 'phone',
    rules: 'required|phone'
  })
);
```

#### `get(name)`
Retrieve an input validator by name.

```javascript
const emailValidator = validator.get('email');
```

#### `has(name)`
Check if an input exists in the form.

```javascript
if (validator.has('email')) {
  // Handle email field
}
```

## Advanced Usage

### Nested Object Validation

```javascript
const validator = form({
  'user.profile.age': 'required|number|min:18',
  'user.profile.contact.email': 'required|email'
}, {
  user: {
    profile: {
      age: 25,
      contact: {
        email: 'john@example.com'
      }
    }
  }
});
```

### Custom Form-Level Validation

```javascript
const validator = form({
  password: 'required|min:8',
  passwordConfirm: 'required'
}, data)
  .with(form => {
    const data = form.getData();
    return data.password === data.passwordConfirm;
  })
  .with(form => {
    const data = form.getData();
    return data.password.match(/[A-Z]/) !== null;
  });
```

### Event Handling for Complex Workflows

```javascript
validator
  .onValidate((form) => {
    console.log('Validation started');
  })
  .onPasses((form) => {
    submitToServer(form.getData());
  })
  .onFails((form) => {
    displayErrors(form.errors);
  });
```

## Real-World Examples

### Contact Form Validation

```javascript
const contactForm = form({
  name: 'required|min:2',
  email: 'required|email',
  subject: 'required|min:5',
  message: 'required|min:20'
}, {})
  .onPasses(async (form) => {
    const data = form.getData();
    await sendEmail(data);
    showSuccess('Message sent successfully!');
  })
  .onFails((form) => {
    showErrors(form.errors);
  });
```

### Registration Form with Password Confirmation

```javascript
const registrationForm = form({
  username: 'required|alphanum|min:3',
  email: 'required|email',
  password: 'required|min:8',
  passwordConfirm: 'required'
}, formData)
  .with(form => {
    const data = form.getData();
    return data.password === data.passwordConfirm;
  })
  .onPasses(async (form) => {
    await registerUser(form.getData());
  });
```

### Dynamic Form Validation

```javascript
const dynamicForm = form({}, {});

// Add fields dynamically
['field1', 'field2', 'field3'].forEach(fieldName => {
  dynamicForm.addInput(
    input({
      name: fieldName,
      rules: 'required'
    })
  );
});

// Remove field if needed
dynamicForm.remove('field2');
```

## Best Practices

1. **Rule Organization**: Keep validation rules clear and organized:
   ```javascript
   const rules = {
     name: 'required|min:3',
     email: 'required|email',
     phone: 'required|phone'
   };
   const validator = form(rules, data);
   ```

2. **Nested Validation**: Use dot notation for nested object validation:
   ```javascript
   'user.profile.email': 'required|email'
   ```

3. **Custom Validation**: Use the `with` method for complex, form-level validation rules:
   ```javascript
   validator.with(form => {
     // Complex validation logic
     return true;
   });
   ```

4. **Error Handling**: Always check validation status before proceeding:
   ```javascript
   if (validator.isValid()) {
     // Safe to proceed
   } else {
     // Handle errors
     console.log(validator.errors);
   }
   ```

## Notes

- All validation methods are synchronous
- The validator maintains internal state of validation results
- Event callbacks are executed in the order they were registered
- Custom validation rules can access the entire form state
- The library is framework-agnostic and can be used with any JavaScript project