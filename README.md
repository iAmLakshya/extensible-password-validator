
# Extensible Password Validation

This library provides functions for validating password or any given string.


## Installation
Not applicable
## Usage

This library provides a `CreateValidator` class for creating password validators. You can define multiple validation rules and combine them into a single validator.

Here's a basic example of how to use the library:

```typescript
import { CreateValidator, predefine_plugins } from 'validator.js';

const validator = new CreateValidator({
  plugins: [
    predefine_plugins.numberOfChars('<=', 32),
    predefine_plugins.numberOfChars('>=', 8),
    predefine_plugins.numberOfUpperCaseCharacters('>=', 1),
    predefine_plugins.numberOfLowerCaseCharacters('>=', 1),
    predefine_plugins.numberOfDigits('>=', 2),
    predefine_plugins.consecutiveCharSubStringMaxLength('<', 3),
    predefine_plugins.repetitiveCharSubStringMaxLength('<', 3),
  ]
});

const validationResult = validator.validate('yourPasswordHere');

if (validationResult.pass) {
  console.log('Password is strong!');
} else {
  console.error('Password is weak. Errors:', validationResult.errors);
}
```

This example creates a validator with several predefined rules:
- Maximum password length of 32 characters
- Minimum password length of 8 characters
- At least 1 uppercase character
- At least 1 lowercase character
- At least 2 digits
- Maximum consecutive character repetition of less than 3
- Maximum repetitive character repetition of less than 3

The `validate` function is then called with the password string. It returns an object containing details about the validation:

- `errors`: An array of any errors encountered during validation. Each error object contains information about the specific rule that failed and the error message.
- `pass`: A boolean indicating whether the password passed all validations.
- `config`: The current validator configuration.





## Predefined Plugins
The library provides a set of predefined validation plugins that you can use directly:

- `numberOfChars`: Checks the length of the string.
- `numberOfUpperCaseCharacters`: Counts the number of uppercase characters in the string.
- `numberOfLowerCaseCharacters`: Counts the number of lowercase characters in the string.
- `numberOfDigits`: Counts the number of digits in the string.
- `consecutiveCharSubStringMaxLength`: Checks the maximum length of any consecutive character substring.
- `repetitiveCharSubStringMaxLength`: Checks the maximum length of any repetitive character substring (case-sensitive).
- `stringChars`: Checks if the string contains any of the specified characters.
## Creating Custom Plugins
You can also create custom validation plugins using the createPlugin function. This function allows you to define a validation logic that is not covered by the predefined plugins.

```typescript
const myCustomValidationPlugin = createPlugin(({ str }) => {
	return !['qwerty', 'abeccc12!'].includes(str.toLowerCase())
}, {
	id: 'myCustomValidationPlugin',
	message: `Please enter a strong password`
});

const validator = new CreateValidator({
	plugins: [
		myCustomValidationPlugin(),
		predefine_plugins.consecutiveCharSubStringMaxLength('<', 5),

	]
});
```
## Additional Notes
- This library uses ASCII character codes for most validations.
- The documentation for some functions (like `ValidationFunctionConfig`) and constants (like `SPECIAL_CHARS`) is missing from this code snippet. You'll need to refer to the complete codebase for details on these.