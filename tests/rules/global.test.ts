import {
  size,
  between,
  required,
  regex,
  inInput,
  only,
  minDigitRule,
  maxDigitRule,
  digitRule,
  same,
  equal,
  isObject,
  isJson,
  isArray,
} from '../../src/rules';

describe('required', () => {
  it('should return false for undefined input', () => {
    expect(required(undefined).passes).toBe(false);
  });

  it('should return false for null input', () => {
    expect(required(null).passes).toBe(false);
  });

  it('should return false for empty string input', () => {
    expect(required('').passes).toBe(false);
  });

  it('should return true for non-empty string input', () => {
    expect(required('hello').passes).toBe(true);
  });
});

describe('between rule', () => {
  it('should return true if the input is between min and max', () => {
    expect(
      between('2010-11-05 23:00', '2010-11-05 22:58,2010-11-06', 'date').passes,
    ).toBe(true); // date comparison
    expect(between('5', ' 5, 5', 'number').passes).toBe(true); // compare number
    expect(between('-5m', '0,4').passes).toBe(true); // compare string length
  });

  it('should return false if the input is not between min and max', () => {
    expect(between(5, '0,4', 'number').passes).toBe(false);
    expect(between(-5, '0,4', 'number').passes).toBe(false);
    expect(between('-5', '0,4', 'number').passes).toBe(false);
  });
});

describe('size', () => {
  it('should return true for a file with size less than or equal to the specified maxSize', () => {
    const file1 = new File(['test'], 'file1.txt', { type: 'text/plain' });

    // Test with maxSize in KB
    expect(size(file1, '1KB').passes).toBe(true);
  });

  it('should return true for a non-file input with length equal to the specified maxSize', () => {
    // Test with string input
    expect(size('test', '5').passes).toBe(false);
    expect(size('test', '4').passes).toBe(true);
  });

  it('should throw an error for an invalid maxSize format', () => {
    const file1 = new File(['test'], 'file1.txt', { type: 'text/plain' });

    // Test with invalid format
    expect(() => size(file1, '1XYZ').passes).toThrowError();
    expect(() => size(file1, '5').passes).toThrowError();
  });
});

describe('regex', () => {
  test('returns true if the input matches the regex pattern', () => {
    const pattern = '^[A-Z]+$';
    const input = 'ACB';
    expect(regex(input, pattern).passes).toBe(true);
  });

  test('returns true if the input matches the regex pattern with &pip;', () => {
    const pattern = '^(Js&pip;Ts)$'; // &pip; will be replaced with |
    const input = 'Js';
    expect(regex(input, pattern).passes).toBe(true);
  });

  test('returns false if the input does not match the regex pattern', () => {
    const pattern = '^[A-Za-z]$';
    const input = 'abc123';
    expect(regex(input, pattern).passes).toBe(false);
  });

  test('throws an error if an invalid regex string is provided', () => {
    const pattern = 'abc[';
    const input = 'abcdef';
    expect(() => {
      regex(input, pattern);
    }).toThrow();
  });
});

describe('inInput rule callback', () => {
  it('should return true if the input is in the list', () => {
    const input = 'active';
    const params = 'active, inactive, suspended';
    const result = inInput(input, params).passes;
    expect(result).toBe(true);
  });

  it('should return false if the input is not in the list', () => {
    const input = 'pending';
    const params = 'active, inactive, suspended';
    const result = inInput(input, params).passes;
    expect(result).toBe(false);
  });

  it('should throw an error if params argument is empty', () => {
    const input = 'active';
    const params = '';
    expect(() => inInput(input, params)).toThrow();
  });
});

describe('only', () => {
  test('should return true if input is a string without any number', () => {
    expect(only('Hello', 'string').passes).toBe(true);
    expect(only('*Tr-ivule#', 'string').passes).toBe(true);
  });

  test('should return false if input is a string with numbers', () => {
    expect(only('Hello123', 'string').passes).toBe(false);
    expect(only('  None123', 'string').passes).toBe(false);
  });

  test('should return false if input is not a string', () => {
    expect(only(123, 'string').passes).toBe(false);
    expect(only(null, 'string').passes).toBe(false);
    expect(only(undefined, 'string').passes).toBe(false);
    expect(only(true, 'string').passes).toBe(false);
  });

  test('should return true if input is a number', () => {
    expect(only(123, 'digit').passes).toBe(true);
    expect(only(0, 'digit').passes).toBe(true);
    expect(only('0098', 'digit').passes).toBe(true);
  });

  test('should return false if input is not a number', () => {
    expect(only('Hello', 'number').passes).toBe(false);
    expect(only(null, 'number').passes).toBe(false);
    expect(only(undefined, 'number').passes).toBe(false);
    expect(only(true, 'number').passes).toBe(false);
  });

  test('should return false for invalid parameter', () => {
    expect(only('Hello', 'invalid').passes).toBe(false);
    expect(only(123, 'invalid').passes).toBe(false);
  });
});

describe('min_digitRule', () => {
  it('should return true when input is a number with digits greater than or equal to minDigitCount', () => {
    expect(minDigitRule(12345, 5).passes).toBe(true);
    expect(minDigitRule(123, 3).passes).toBe(true);
    expect(minDigitRule(0, 1).passes).toBe(true);
  });

  it('should return false when input is not a number', () => {
    expect(minDigitRule('abc', 2).passes).toBe(false);
    expect(minDigitRule(true, 1).passes).toBe(false);
  });

  it('should return false when input is a number with digits less than minDigitCount', () => {
    expect(minDigitRule(123, 4).passes).toBe(false);
    expect(minDigitRule(5, 2).passes).toBe(false);
  });

  it('should throw an error if minDigitCount is not a number', () => {
    expect(() => minDigitRule(123, 'abc')).toThrowError(
      'Min_digit rule parameter must be a number',
    );
  });
});

describe('maxDigitRule', () => {
  it('should return true when input is a number with digits less than or equal to maxDigitCount', () => {
    expect(maxDigitRule(12345, 5).passes).toBe(true);
    expect(maxDigitRule(123, 3).passes).toBe(true);
    expect(maxDigitRule(0, 1).passes).toBe(true);
  });

  it('should return false when input is not a number', () => {
    expect(maxDigitRule('abc', 2).passes).toBe(false);
    expect(maxDigitRule(true, 1).passes).toBe(false);
  });

  it('should return false when input is a number with digits greater than maxDigitCount', () => {
    expect(maxDigitRule(123, 2).passes).toBe(false);
    expect(maxDigitRule(12345, 4).passes).toBe(false);
  });

  it('should throw an error if maxDigitCount is not a number', () => {
    expect(() => maxDigitRule(123, 'abc')).toThrowError(
      'Max_digit rule parameter must be a number',
    );
  });
});

describe('digitRule', () => {
  it('should return true when input is a number with digits equal to digitCount', () => {
    expect(digitRule(12345678, 8).passes).toBe(true);
    expect(digitRule(98765432, 8).passes).toBe(true);
    expect(digitRule(0, 1).passes).toBe(true);
  });

  it('should return false when input is not a number', () => {
    expect(digitRule('abc', 3).passes).toBe(false);
    expect(digitRule(true, 1).passes).toBe(false);
  });

  it('should return false when input is a number with digits not equal to digitCount', () => {
    expect(digitRule(123, 4).passes).toBe(false);
    expect(digitRule(12345, 6).passes).toBe(false);
  });

  it('should throw an error if digitCount is not a number', () => {
    expect(() => digitRule(123, 'abc')).toThrowError(
      'Digit rule parameter must be a number',
    );
  });
});

describe('equal rule', () => {
  it('should return true when values are strictly equal', () => {
    // Test with numbers
    expect(equal(5, 5).passes).toBe(true);
    expect(equal(0, 0).passes).toBe(true);
    expect(equal(-10, -10).passes).toBe(true);

    // Test with strings
    expect(equal('hello', 'hello').passes).toBe(true);
    expect(equal('', '').passes).toBe(true);

    // Test with booleans
    expect(equal(true, true).passes).toBe(true);
    expect(equal(false, false).passes).toBe(true);

    // Test with null and undefined
    expect(equal(null, null).passes).toBe(true);
    expect(equal(undefined, undefined).passes).toBe(true);
  });

  it('should return false when values are not strictly equal', () => {
    // Test with different types
    expect(equal(5, '5').passes).toBe(false);
    expect(equal(0, false).passes).toBe(false);
    expect(equal(1, true).passes).toBe(false);

    // Test with different values
    expect(equal('hello', 'world').passes).toBe(false);
    expect(equal(10, 20).passes).toBe(false);
    expect(equal(true, false).passes).toBe(false);

    // Test with null/undefined cases
    expect(equal(null, undefined).passes).toBe(false);
    expect(equal(0, null).passes).toBe(false);
  });

  it('should preserve the original input value', () => {
    // Test value preservation
    expect(equal(5, 5).value).toBe(5);
    expect(equal('test', 'different').value).toBe('test');
    expect(equal(null, null).value).toBe(null);
  });
});

describe('same rule', () => {
  it('should return true when values are loosely equal', () => {
    // Test with numbers and string numbers
    expect(same(5, '5').passes).toBe(true);
    expect(same('10', 10).passes).toBe(true);
    expect(same(0, '0').passes).toBe(true);
    expect(same(-1, '-1').passes).toBe(true);

    // Test with empty values
    expect(same('', '').passes).toBe(true);
    expect(same(null, 'null').passes).toBe(true);

    // Test with boolean values
    expect(same(true, 'true').passes).toBe(true);
    expect(same('false', false).passes).toBe(true);
  });

  it('should return false when values are not loosely equal', () => {
    // Test with different values
    expect(same('hello', 'world').passes).toBe(false);
    expect(same(10, 20).passes).toBe(false);
    expect(same('true', 0).passes).toBe(false);

    // Test with special cases
    expect(same(null, undefined).passes).toBe(false);
    expect(same('', null).passes).toBe(false);
    expect(same(' ', '').passes).toBe(false);
  });

  it('should preserve the original input value', () => {
    // Test value preservation with different types
    const numInput = 42;
    const sinput = 'test';
    const boolInput = true;

    expect(same(numInput, '42').value).toBe(numInput);
    expect(same(sinput, 'other').value).toBe(sinput);
    expect(same(boolInput, 1).value).toBe(boolInput);
  });

  it('should handle edge cases correctly', () => {
    // Test with special characters and whitespace
    expect(same(' 42', 42).passes).toBe(false);
    expect(same('42 ', 42).passes).toBe(false);
  });
});

describe('isObject rule', () => {
  it('should return true for valid objects', () => {
    expect(isObject({}).passes).toBe(true);
    expect(isObject({ name: 'test' }).passes).toBe(true);
    expect(isObject({ id: 1, active: true }).passes).toBe(true);
  });

  it('should return false for non-object values', () => {
    expect(isObject(null).passes).toBe(false);
    expect(isObject(undefined).passes).toBe(false);
    expect(isObject('string').passes).toBe(false);
    expect(isObject(123).passes).toBe(false);
    expect(isObject(true).passes).toBe(false);
    expect(isObject([]).passes).toBe(false);
    expect(isObject(['test']).passes).toBe(false);
  });

  it('should validate required keys when specified', () => {
    const obj = { name: 'test', age: 25, email: 'test@example.com' };

    expect(isObject(obj, 'name').passes).toBe(true);
    expect(isObject(obj, 'name,age').passes).toBe(true);
    expect(isObject(obj, 'name,age,email').passes).toBe(true);
    expect(isObject(obj, 'name,missing').passes).toBe(false);
    expect(isObject(obj, 'missing').passes).toBe(false);
  });

  it('should preserve the original input value', () => {
    const testObj = { id: 1, name: 'test' };

    expect(isObject(testObj).value).toBe(testObj);
    expect(isObject(null).value).toBe(null);
    expect(isObject([]).value).toEqual([]);
  });

  it('should handle edge cases with required keys', () => {
    const obj = { prop: null, empty: '', zero: 0, false: false };

    expect(isObject(obj, 'prop').passes).toBe(true);
    expect(isObject(obj, 'empty').passes).toBe(true);
    expect(isObject(obj, 'zero').passes).toBe(true);
    expect(isObject(obj, 'false').passes).toBe(true);
    expect(isObject(obj, 'prop,empty,zero,false').passes).toBe(true);
  });
});

describe('isJson rule', () => {
  it('should return true for valid JSON strings', () => {
    expect(isJson('{"name": "test"}').passes).toBe(true);
    expect(isJson('{"id": 1, "active": true}').passes).toBe(true);
    expect(isJson('[1, 2, 3]').passes).toBe(true);
    expect(isJson('["a", "b", "c"]').passes).toBe(true);
    expect(isJson('{"nested": {"key": "value"}}').passes).toBe(true);
  });

  it('should return false for invalid JSON strings', () => {
    expect(isJson('{name: test}').passes).toBe(false);
    expect(isJson('{"unclosed": "string}').passes).toBe(false);
    expect(isJson('[1, 2,]').passes).toBe(false);
    expect(isJson('not json at all').passes).toBe(false);
  });

  it('should return false for non-string inputs', () => {
    expect(isJson(123).passes).toBe(false);
    expect(isJson(null).passes).toBe(false);
    expect(isJson(undefined).passes).toBe(false);
    expect(isJson({}).passes).toBe(false);
    expect(isJson([]).passes).toBe(false);
  });

  it('should return false for JSON primitive values', () => {
    expect(isJson('null').passes).toBe(false);
    expect(isJson('123').passes).toBe(false);
    expect(isJson('"string"').passes).toBe(false);
    expect(isJson('true').passes).toBe(false);
  });

  it('should validate required keys in objects', () => {
    const jsonObject =
      '{"name": "test", "age": 25, "email": "test@example.com"}';

    expect(isJson(jsonObject, 'name').passes).toBe(true);
    expect(isJson(jsonObject, 'name,age').passes).toBe(true);
    expect(isJson(jsonObject, 'name,age,email').passes).toBe(true);
    expect(isJson(jsonObject, 'name,missing').passes).toBe(false);
    expect(isJson(jsonObject, 'missing').passes).toBe(false);
  });

  it('should validate required indexes in arrays', () => {
    const jsonArray = '[10, 20, 30, 40, 50]';

    expect(isJson(jsonArray, '0').passes).toBe(true);
    expect(isJson(jsonArray, '0,1,2').passes).toBe(true);
    expect(isJson(jsonArray, '4').passes).toBe(true);
    expect(isJson(jsonArray, '5').passes).toBe(false);
    expect(isJson(jsonArray, '-1').passes).toBe(false);
  });

  it('should preserve the original input value', () => {
    const jsonString = '{"test": "value"}';
    expect(isJson(jsonString).value).toBe(jsonString);

    const invalidJson = 'invalid json';
    expect(isJson(invalidJson).value).toBe(invalidJson);
  });
});

describe('isArray rule', () => {
  it('should return true for valid arrays', () => {
    expect(isArray([]).passes).toBe(true);
    expect(isArray([1, 2, 3]).passes).toBe(true);
    expect(isArray(['test']).passes).toBe(true);
    expect(isArray([{ id: 1 }]).passes).toBe(true);
  });

  it('should return false for non-array values', () => {
    expect(isArray(null).passes).toBe(false);
    expect(isArray(undefined).passes).toBe(false);
    expect(isArray('string').passes).toBe(false);
    expect(isArray(123).passes).toBe(false);
    expect(isArray(true).passes).toBe(false);
    expect(isArray({}).passes).toBe(false);
    expect(isArray({ length: 1 }).passes).toBe(false);
  });

  it('should validate required indexes when specified', () => {
    const arr = [10, 20, 30, 40, 50];

    expect(isArray(arr, '0').passes).toBe(true);
    expect(isArray(arr, '0,1').passes).toBe(true);
    expect(isArray(arr, '0,2,4').passes).toBe(true);
    expect(isArray(arr, '0,5').passes).toBe(false);
    expect(isArray(arr, '5').passes).toBe(false);
  });

  it('should preserve the original input value', () => {
    const testArr = [1, 2, 3];

    expect(isArray(testArr).value).toBe(testArr);
    expect(isArray(null).value).toBe(null);
    expect(isArray({}).value).toEqual({});
  });

  it('should handle edge cases with required indexes', () => {
    const arr = [null, '', 0, false];

    expect(isArray(arr, '0').passes).toBe(true);
    expect(isArray(arr, '1').passes).toBe(true);
    expect(isArray(arr, '2').passes).toBe(true);
    expect(isArray(arr, '3').passes).toBe(true);
    expect(isArray(arr, '0,1,2,3').passes).toBe(true);
  });

  it('should handle invalid index values correctly', () => {
    const arr = [1, 2, 3];

    expect(isArray(arr, 'invalid').passes).toBe(true); // pas d'index valides spécifiés
    expect(isArray(arr, '-1').passes).toBe(false);
    expect(isArray(arr, 'a,b,c').passes).toBe(true); // pas d'index valides spécifiés
    expect(isArray(arr, '0,invalid,2').passes).toBe(true); // seuls les index valides sont vérifiés
  });
});
