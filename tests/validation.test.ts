import { Bag, Validation } from '../src/validation';
import { InputRule } from '../src/messages';
import { Local } from '../src/locale/local';
const bag = new Bag(new Local());
describe('Validation', () => {
  let validation: Validation;

  beforeEach(() => {
    const inputRule = new InputRule(bag, ['required', 'email'], {
      required: 'This field is required',
      email: 'Invalid email format',
    });
    validation = new Validation(bag.trLocal);
    validation.setRules(inputRule);
  });

  test('validate() should return false for an invalid value', () => {
    validation.value = '';
    const isValid = validation.passes();
    expect(isValid).toBe(false);
  });

  test('Validation failed messages', () => {
    validation.failsOnFirst = false;
    validation.value = '';
    const received = validation.getErrors();
    expect(received).toEqual({
      email: 'Invalid email format',
      required: 'This field is required',
    });
  });

  test('setRules() should update the rules', () => {
    validation.setRules(
      new InputRule(bag, ['minlength:8'], {
        minlength: 'The input must be at least 8 characters long',
      }),
    );
    const rules = validation.getRules().map((rule) => {
      return {
        name: rule.name,
        param: rule.params,
      };
    });

    expect(rules).toEqual([
      {
        name: 'minlength',
        param: '8',
      },
    ]);
  });
  test('getRuleExecuted', () => {
    validation.failsOnFirst = false;
    validation.value = '';
    const received = validation.getRuleExecuted().map((rule) => rule.ruleName);
    expect(received).toEqual(['required', 'email']);
  });
});

describe('Validation with nullable number', () => {
  let validation: Validation;

  beforeEach(() => {
    const inputRule = new InputRule(bag, ['nullable', 'number', 'min:3'], {
      number: 'The field must be a number',
      min: 'The value must be at least 3',
    });
    validation = new Validation(bag.trLocal);
    validation.setRules(inputRule);
  });

  test('should pass validation when value is null', () => {
    validation.value = null;
    expect(validation.passes()).toBe(true);
    expect(validation.getErrors()).toEqual({});
  });

  test('should pass validation when value is valid number >= 3', () => {
    validation.value = 5;
    expect(validation.passes()).toBe(true);
    expect(validation.getErrors()).toEqual({});
  });

  test('should fail validation when value is invalid number < 3', () => {
    validation.failsOnFirst = false;
    validation.value = 2;
    expect(validation.passes()).toBe(false);
    expect(validation.getErrors()).toHaveProperty('min');
  });

  test('should fail validation when value is not a number', () => {
    validation.failsOnFirst = false;
    validation.value = 'not a number';
    expect(validation.passes()).toBe(false);
    expect(validation.getErrors()).toHaveProperty('number');
  });

  test('should show all validation failures when failsOnFirst is false', () => {
    validation.failsOnFirst = false;
    validation.value = 'not a number';
    validation.validate();

    const executedRules = validation.getRuleExecuted().map((rule) => ({
      name: rule.ruleName,
      passed: rule.passed,
    }));

    expect(executedRules).toEqual([
      { name: 'nullable', passed: true },
      { name: 'number', passed: false },
      { name: 'min', passed: false },
    ]);
  });

  test('should skip number and min validations when value is null', () => {
    validation.failsOnFirst = false;
    validation.value = null;
    validation.validate();

    const executedRules = validation.getRuleExecuted().map((rule) => ({
      name: rule.ruleName,
      passed: rule.passed,
    }));

    expect(executedRules).toEqual([
      { name: 'nullable', passed: true },
      { name: 'number', passed: true }, // Should be automatically passed
      { name: 'min', passed: true }, // Should be automatically passed
    ]);
  });
});
