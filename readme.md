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
## Some Built-In Rules

---
| **Name**                     | **Description**                                                                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `required`                   | Ensures the field is not empty. Works with strings, arrays, objects, numbers, booleans, etc. <br>**Example**: `required`                              |
| `nullable`                   | Always passes; effectively makes a field optional. <br>**Example**: `nullable`                                                                        |
| `in:x,y`                     | Checks if the input value is among the comma-separated list (`x`, `y`, etc.). <br>**Example**: `required\|in:admin,user,guest`                        |
| `size:x`                     | If it’s a file, checks file size. Otherwise checks the exact length for strings. <br>**Example**: `required\|size:5`                                  |
| `isBoolean`                  | Checks if the input is a boolean or a “boolean-like” string (`"true","false","yes","no","1","0"`). <br>**Example**: `required\|isBoolean`             |
| `between:x,y`                | General “range” check for numbers, strings, dates, or file size. Ensures the value is between `x` and `y`. <br>**Example**: `required\|between:18,99` |
| `regex:pattern`              | Validates that the input matches the given regular expression. <br>**Example**: `regex:^[0-9]{3}-[0-9]{4}$`                                           |
| `only:string` / `only:digit` | Restricts the input to either letters only (for `"string"`) or strictly digits (for `"digit"`). <br>**Example**: `only:string` or `only:digit`        |
| `digit:x`                    | Checks if the input is purely digits and exactly `x` digits long. <br>**Example**: `digit:5`                                                          |
| `maxDigit:x`                 | Checks if the input is purely digits and **at most** `x` digits long. <br>**Example**: `maxDigit:10`                                                  |
| `minDigit:x`                 | Checks if the input is purely digits and **at least** `x` digits long. <br>**Example**: `minDigit:3`                                                  |
| `equal:value`                | Ensures the input is strictly equal (`===`) to the given value. <br>**Example**: `equal:secret`                                                       |
| `same:fieldValue`            | Ensures the input loosely equals (`==`) another field’s value (useful for confirmations). <br>**Example**: `same:password`                            |
| `object`                     | Checks if the input is a valid object (not null or an array). Optionally enforce required keys. <br>**Example**: `required\|object:name,age`          |
| `json`                       | Checks if the input is valid JSON. Optionally ensure required keys or indexes. <br>**Example**: `json:key1,key2`                                      |
| `array`                      | Checks if the input is an array; optionally validate certain indexes. <br>**Example**: `array:0,1`                                                    |
| `email`                      | Validates if the input is a valid email address. <br>**Example**: `required\|email`                                                                   |
| `minlength:x`                | Ensures the string length is at least `x`. <br>**Example**: `required\|minlength:8`                                                                   |
| `maxlength:x`                | Ensures the string length does not exceed `x`. <br>**Example**: `required\|maxlength:10`                                                              |
| `string`                     | Checks if the value is a string. <br>**Example**: `required\|string`                                                                                  |
| `url`                        | Checks if the string is a valid URL. <br>**Example**: `required\|url`                                                                                 |
| `startWithUpper`             | Ensures the string starts with an uppercase letter. <br>**Example**: `startWithUpper`                                                                 |
| `startWithLower`             | Ensures the string starts with a lowercase letter. <br>**Example**: `startWithLower`                                                                  |
| `startWith:x,y`              | Checks if the string starts with any of the given prefixes (`x`, `y`, etc.). <br>**Example**: `startWith:pre1,pre2`                                   |
| `endWith:x,y`                | Checks if the string ends with any of the given suffixes (`x`, `y`, etc.). <br>**Example**: `endWith:suf1,suf2`                                       |
| `contains:x,y`               | Checks if the string contains **all** of the listed substrings (`x`, `y`, etc.). <br>**Example**: `contains:foo,bar`                                  |
| `length:x`                   | Validates that the string length is exactly `x`. <br>**Example**: `length:9`                                                                          |
| `password`                   | Basic password complexity: length ≥ 8, uppercase, lowercase, number, special char. <br>**Example**: `required\|password`                              |
| `startWithString`            | Ensures the input does **not** start with a digit. <br>**Example**: `startWithString`                                                                 |
| `endWithString`              | Ensures the input does **not** end with a digit. <br>**Example**: `endWithString`                                                                     |
| `containsLetter`             | Ensures the string contains at least one letter. <br>**Example**: `containsLetter`                                                                    |
| `excludes:x,y`               | Ensures none of the characters/strings listed (`x`, `y`) appear in the input. <br>**Example**: `excludes:@,/,#`                                       |
| `upper`                      | Ensures the string is entirely uppercase. <br>**Example**: `upper`                                                                                    |
| `lower`                      | Ensures the string is entirely lowercase. <br>**Example**: `lower`                                                                                    |
| `stringBetween:min,max`      | Ensures the string length is between `min` and `max`. <br>**Example**: `stringBetween:2,5`                                                            |

With Jevalide, validation is no longer a hassle. Customize once, reuse everywhere, and keep your validation logic clean and maintainable.

