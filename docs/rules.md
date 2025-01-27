# Validation Rules

Jevalide comes with a comprehensive set of validation rules that can be used to validate form inputs. This document details all available rules and how to use them.

## Using Rules

Rules can be specified in two ways:

1. Using string syntax with pipe separator:
```javascript
{
  email: 'required|email|maxlength:100'
}
```

2. Using array syntax:
```javascript
{
  email: ['required', 'email', 'maxlength:100']
}
```

## Available Rules

### Core Rules

#### `required`
Validates if a value is present and not empty.
- For arrays: must have at least one element
- For objects: must have at least one property
- For strings: must have non-whitespace characters
- For numbers: any number (including 0) is valid
- For booleans: any boolean value is valid

```javascript
field: 'required'
// "hello" ✓
// "" ✗
// [1, 2] ✓
// [] ✗
// { key: "value" } ✓
// {} ✗
```

#### `nullable`
Allows the field to be null or undefined.
```javascript
field: 'nullable'
// null ✓
// undefined ✓
// "" ✓
```

### String Type & Pattern Rules

#### `is_string`
Validates that the value is a string.
```javascript
field: 'required|is_string'
// "hello" ✓
// 123 ✗
// {} ✗
```

#### `regex:pattern`
Validates the input against a regular expression pattern.
```javascript
code: 'required|regex:^[A-Z]{2}\\d{4}

#### `isBoolean`
Validates if the value is or can be converted to a boolean.
```javascript
field: 'required|isBoolean'
// true ✓
// false ✓
// "true" ✓
// "1" ✓
// "yes" ✓
// "invalid" ✗
```

#### `object`
Validates if the value is a valid object. Can check for required keys.
```javascript
field: 'required|object'
// {} ✓
// { name: "John" } ✓
// null ✗
// [] ✗

field: 'required|object:name,age'
// { name: "John", age: 30 } ✓
// { name: "John" } ✗
```

#### `array`
Validates if the value is an array. Can check for required indexes.
```javascript
field: 'required|array'
// [] ✓
// [1, 2, 3] ✓
// {} ✗

field: 'required|array:0,1'
// [1, 2, 3] ✓
// [1] ✗
```

#### `json`
Validates if the value is a valid JSON string. Can check for required keys.
```javascript
field: 'required|json'
// '{"name":"John"}' ✓
// 'invalid json' ✗

field: 'required|json:name,age'
// '{"name":"John","age":30}' ✓
// '{"name":"John"}' ✗
```

### Comparison Rules

#### `in:value1,value2,...`
Checks if the input is in the specified list of values.
```javascript
status: 'required|in:pending,approved,rejected'
// "pending" ✓
// "invalid" ✗
```

#### `equal:value`
Checks if the input is strictly equal to a specific value.
```javascript
answer: 'required|equal:42'
// 42 ✓
// "42" ✗
```

#### `same:fieldName`
Checks if the input matches another field's value (loose comparison).
```javascript
password_confirmation: 'required|same:password'
// Matches if value equals password field
```

### Number Rules

#### `digit:count`
Validates that the input is a numeric value with exactly the specified number of digits.
```javascript
code: 'required|digit:4'
// "1234" ✓
// "123" ✗
// "12345" ✗
```

#### `maxDigit:count`
Validates that the input is a numeric value with at most the specified number of digits.
```javascript
pin: 'required|maxDigit:6'
// "123456" ✓
// "1234567" ✗
```

#### `minDigit:count`
Validates that the input is a numeric value with at least the specified number of digits.
```javascript
code: 'required|minDigit:4'
// "1234" ✓
// "123" ✗
```

### Size and Range Rules

#### `size:value`
For files: validates the file size
For other types: same as `length` rule
```javascript
file: 'required|size:2mb'
// 2MB file ✓
// 3MB file ✗

text: 'required|size:10'
// "1234567890" ✓
// "123456789" ✗
```

#### `between:min,max`
Multi-purpose range validation that adapts to different types:
- Numbers: validates numeric range
- Strings: validates length range (same as stringBetween)
- Dates: validates date range
- Files: validates file size range

```javascript
// Number
age: 'required|between:18,65'
// 25 ✓
// 15 ✗

// String
username: 'required|between:3,20'
// "john_doe" ✓
// "jo" ✗

// Date
date: 'required|between:2023-01-01,2023-12-31'
// "2023-06-15" ✓
// "2024-01-01" ✗

// File
document: 'required|between:1mb,5mb'
// 3MB file ✓
// 6MB file ✗
```

### String Validation

#### `email`
Validates email addresses using a comprehensive regex pattern.
```javascript
email: 'required|email'
// test@example.com ✓
// invalid-email ✗
```

#### `url`
Validates URLs (http, https, ftp protocols).
```javascript
website: 'required|url'
// https://example.com ✓
// invalid-url ✗
```

#### `minlength:number`
Ensures the string length is at least the specified value.
```javascript
username: 'required|minlength:3'
// john ✓
// jo ✗
```

#### `maxlength:number`
Ensures the string length does not exceed the specified value.
```javascript
title: 'required|maxlength:100'
// My Article Title ✓
// [very long text exceeding 100 characters] ✗
```

#### `length:number` (or `len:number`)
Ensures the string has exactly the specified length.
```javascript
code: 'required|length:6'
// 123456 ✓
// 12345 ✗
```

#### `stringBetween:min,max`
Ensures the string length is between the specified minimum and maximum values.
```javascript
username: 'required|stringBetween:3,20'
// john_doe ✓
// jo ✗
```

### String Content Rules

#### `startWithUpper`
Ensures the string starts with an uppercase letter.
```javascript
name: 'required|startWithUpper'
// John ✓
// john ✗
```

#### `startWithLower`
Ensures the string starts with a lowercase letter.
```javascript
variable: 'required|startWithLower'
// userName ✓
// UserName ✗
```

#### `startWith:prefix1,prefix2,...`
Ensures the string starts with one of the specified prefixes.
```javascript
domain: 'required|startWith:http:,https:'
// https://example.com ✓
// ftp://example.com ✗
```

#### `endWith:suffix1,suffix2,...`
Ensures the string ends with one of the specified suffixes.
```javascript
email: 'required|endWith:.com,.net,.org'
// john@example.com ✓
// john@example.io ✗
```

#### `contains:substring1,substring2,...`
Ensures the string contains all specified substrings.
```javascript
content: 'required|contains:important,urgent'
// This is an important and urgent message ✓
// This is a message ✗
```

#### `excludes:char1,char2,...`
Ensures the string does not contain any of the specified characters.
```javascript
username: 'required|excludes:@,#,&'
// john_doe ✓
// john@doe ✗
```

#### `upper`
Ensures the entire string is uppercase.
```javascript
code: 'required|upper'
// VALID ✓
// Valid ✗
```

#### `lower`
Ensures the entire string is lowercase.
```javascript
username: 'required|lower'
// johndoe ✓
// johnDoe ✗
```

### Special Format Rules

#### `password`
Validates password complexity with the following requirements:
- Minimum length of 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*(),.?":{}|<>)

```javascript
password: 'required|password'
// MyP@ssw0rd ✓
// password123 ✗
```

#### `startWithString`
Ensures the string starts with a letter (not a number).
```javascript
reference: 'required|startWithString'
// ref123 ✓
// 123ref ✗
```

#### `endWithString`
Ensures the string ends with a letter (not a number).
```javascript
code: 'required|endWithString'
// 123ref ✓
// ref123 ✗
```

#### `containsLetter`
Ensures the string contains at least one letter.
```javascript
input: 'required|containsLetter'
// abc123 ✓
// 12345 ✗
```

## Advanced Usage

### Combining Multiple Rules

Rules can be combined to create complex validation requirements:

```javascript
const rules = {
  // Username: 3-20 chars, lowercase, no special chars
  username: 'required|stringBetween:3,20|lower|excludes:@,#,&,$',
  
  // Email: valid format, max 100 chars
  email: 'required|email|maxlength:100',
  
  // Password: complex requirements
  password: 'required|password|minlength:8',
  
  // Profile URL: valid URL starting with https
  profileUrl: 'required|url|startWith:https:'
};
```

### Common Validation Patterns

#### User Registration
```javascript
{
  username: 'required|stringBetween:3,20|lower',
  email: 'required|email',
  password: 'required|password',
  terms: 'required'
}
```

#### Profile Update
```javascript
{
  fullName: 'required|startWithUpper',
  bio: 'maxlength:500',
  website: 'url|startWith:https:',
  socialHandle: 'required|excludes:@,#,&'
}
```

#### Product Creation
```javascript
{
  sku: 'required|upper|length:8',
  name: 'required|stringBetween:3,100',
  description: 'required|maxlength:1000'
}
```

## Best Practices

1. Always combine `required` with other rules when the field is mandatory
2. Use `stringBetween` instead of separate `minlength` and `maxlength` for better readability
3. Consider user experience when combining multiple rules
4. Use consistent validation patterns across similar fields
5. Include clear error messages for each validation rule
// "AB1234" ✓
// "12ABCD" ✗
```

#### `only:type`
Restricts the input to only accept specific types of values:
- `string`: only letters (no numbers)
- `digit`: only numeric values
```javascript
name: 'required|only:string'
// "John" ✓
// "John123" ✗

code: 'required|only:digit'
// "123" ✓
// "ABC" ✗
```

### Type Validation

#### `isBoolean`
Validates if the value is or can be converted to a boolean.
```javascript
field: 'required|isBoolean'
// true ✓
// false ✓
// "true" ✓
// "1" ✓
// "yes" ✓
// "invalid" ✗
```

#### `object`
Validates if the value is a valid object. Can check for required keys.
```javascript
field: 'required|object'
// {} ✓
// { name: "John" } ✓
// null ✗
// [] ✗

field: 'required|object:name,age'
// { name: "John", age: 30 } ✓
// { name: "John" } ✗
```

#### `array`
Validates if the value is an array. Can check for required indexes.
```javascript
field: 'required|array'
// [] ✓
// [1, 2, 3] ✓
// {} ✗

field: 'required|array:0,1'
// [1, 2, 3] ✓
// [1] ✗
```

#### `json`
Validates if the value is a valid JSON string. Can check for required keys.
```javascript
field: 'required|json'
// '{"name":"John"}' ✓
// 'invalid json' ✗

field: 'required|json:name,age'
// '{"name":"John","age":30}' ✓
// '{"name":"John"}' ✗
```

### Comparison Rules

#### `in:value1,value2,...`
Checks if the input is in the specified list of values.
```javascript
status: 'required|in:pending,approved,rejected'
// "pending" ✓
// "invalid" ✗
```

#### `equal:value`
Checks if the input is strictly equal to a specific value.
```javascript
answer: 'required|equal:42'
// 42 ✓
// "42" ✗
```

#### `same:fieldName`
Checks if the input matches another field's value (loose comparison).
```javascript
password_confirmation: 'required|same:password'
// Matches if value equals password field
```

### Number Rules

#### `digit:count`
Validates that the input is a numeric value with exactly the specified number of digits.
```javascript
code: 'required|digit:4'
// "1234" ✓
// "123" ✗
// "12345" ✗
```

#### `maxDigit:count`
Validates that the input is a numeric value with at most the specified number of digits.
```javascript
pin: 'required|maxDigit:6'
// "123456" ✓
// "1234567" ✗
```

#### `minDigit:count`
Validates that the input is a numeric value with at least the specified number of digits.
```javascript
code: 'required|minDigit:4'
// "1234" ✓
// "123" ✗
```

### Size and Range Rules

#### `size:value`
For files: validates the file size
For other types: same as `length` rule
```javascript
file: 'required|size:2mb'
// 2MB file ✓
// 3MB file ✗

text: 'required|size:10'
// "1234567890" ✓
// "123456789" ✗
```

#### `between:min,max`
Multi-purpose range validation that adapts to different types:
- Numbers: validates numeric range
- Strings: validates length range (same as stringBetween)
- Dates: validates date range
- Files: validates file size range

```javascript
// Number
age: 'required|between:18,65'
// 25 ✓
// 15 ✗

// String
username: 'required|between:3,20'
// "john_doe" ✓
// "jo" ✗

// Date
date: 'required|between:2023-01-01,2023-12-31'
// "2023-06-15" ✓
// "2024-01-01" ✗

// File
document: 'required|between:1mb,5mb'
// 3MB file ✓
// 6MB file ✗
```

### String Validation

#### `email`
Validates email addresses using a comprehensive regex pattern.
```javascript
email: 'required|email'
// test@example.com ✓
// invalid-email ✗
```

#### `url`
Validates URLs (http, https, ftp protocols).
```javascript
website: 'required|url'
// https://example.com ✓
// invalid-url ✗
```

#### `minlength:number`
Ensures the string length is at least the specified value.
```javascript
username: 'required|minlength:3'
// john ✓
// jo ✗
```

#### `maxlength:number`
Ensures the string length does not exceed the specified value.
```javascript
title: 'required|maxlength:100'
// My Article Title ✓
// [very long text exceeding 100 characters] ✗
```

#### `length:number` (or `len:number`)
Ensures the string has exactly the specified length.
```javascript
code: 'required|length:6'
// 123456 ✓
// 12345 ✗
```

#### `stringBetween:min,max`
Ensures the string length is between the specified minimum and maximum values.
```javascript
username: 'required|stringBetween:3,20'
// john_doe ✓
// jo ✗
```

### String Content Rules

#### `startWithUpper`
Ensures the string starts with an uppercase letter.
```javascript
name: 'required|startWithUpper'
// John ✓
// john ✗
```

#### `startWithLower`
Ensures the string starts with a lowercase letter.
```javascript
variable: 'required|startWithLower'
// userName ✓
// UserName ✗
```

#### `startWith:prefix1,prefix2,...`
Ensures the string starts with one of the specified prefixes.
```javascript
domain: 'required|startWith:http:,https:'
// https://example.com ✓
// ftp://example.com ✗
```

#### `endWith:suffix1,suffix2,...`
Ensures the string ends with one of the specified suffixes.
```javascript
email: 'required|endWith:.com,.net,.org'
// john@example.com ✓
// john@example.io ✗
```

#### `contains:substring1,substring2,...`
Ensures the string contains all specified substrings.
```javascript
content: 'required|contains:important,urgent'
// This is an important and urgent message ✓
// This is a message ✗
```

#### `excludes:char1,char2,...`
Ensures the string does not contain any of the specified characters.
```javascript
username: 'required|excludes:@,#,&'
// john_doe ✓
// john@doe ✗
```

#### `upper`
Ensures the entire string is uppercase.
```javascript
code: 'required|upper'
// VALID ✓
// Valid ✗
```

#### `lower`
Ensures the entire string is lowercase.
```javascript
username: 'required|lower'
// johndoe ✓
// johnDoe ✗
```

### Special Format Rules

#### `password`
Validates password complexity with the following requirements:
- Minimum length of 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*(),.?":{}|<>)

```javascript
password: 'required|password'
// MyP@ssw0rd ✓
// password123 ✗
```

#### `startWithString`
Ensures the string starts with a letter (not a number).
```javascript
reference: 'required|startWithString'
// ref123 ✓
// 123ref ✗
```

#### `endWithString`
Ensures the string ends with a letter (not a number).
```javascript
code: 'required|endWithString'
// 123ref ✓
// ref123 ✗
```

#### `containsLetter`
Ensures the string contains at least one letter.
```javascript
input: 'required|containsLetter'
// abc123 ✓
// 12345 ✗
```

## Advanced Usage

### Combining Multiple Rules

Rules can be combined to create complex validation requirements:

```javascript
const rules = {
  // Username: 3-20 chars, lowercase, no special chars
  username: 'required|stringBetween:3,20|lower|excludes:@,#,&,$',
  
  // Email: valid format, max 100 chars
  email: 'required|email|maxlength:100',
  
  // Password: complex requirements
  password: 'required|password|minlength:8',
  
  // Profile URL: valid URL starting with https
  profileUrl: 'required|url|startWith:https:'
};
```

### Common Validation Patterns

#### User Registration
```javascript
{
  username: 'required|stringBetween:3,20|lower',
  email: 'required|email',
  password: 'required|password',
  terms: 'required'
}
```

#### Profile Update
```javascript
{
  fullName: 'required|startWithUpper',
  bio: 'maxlength:500',
  website: 'url|startWith:https:',
  socialHandle: 'required|excludes:@,#,&'
}
```

#### Product Creation
```javascript
{
  sku: 'required|upper|length:8',
  name: 'required|stringBetween:3,100',
  description: 'required|maxlength:1000'
}
```

## Best Practices

1. Always combine `required` with other rules when the field is mandatory
2. Use `stringBetween` instead of separate `minlength` and `maxlength` for better readability
3. Consider user experience when combining multiple rules
4. Use consistent validation patterns across similar fields
5. Include clear error messages for each validation rule