import {
  isFile,
  length,
  isNumber,
  maxRule,
  minRule,
  stringBetween,
  fileBetween,
} from '.';
import { RuleCallBack } from '../contracts';
import {
  calculateFileSize,
  convertFileSize,
  explodeFileParam,
  spliteParam,
  throwEmptyArgsException,
  toBoolean,
} from '../utils';
import { ArgumentParser } from '../validation/utils/argument-parser';
import { dateBetween } from './date';
/**
 * Validates if a value is present and not empty.
 *
 * @param input - The value to validate. Can be any type.
 * @returns Object containing validation result and processed value.
 */
export const required: RuleCallBack = (input) => {
  // Handle arrays
  if (Array.isArray(input)) {
    return {
      passes: input.length > 0,
      value: input,
    };
  }

  // Handle objects
  if (typeof input === 'object' && input !== null) {
    return {
      passes: Object.keys(input).length > 0,
      value: input,
    };
  }

  // Handle strings with whitespace
  if (typeof input === 'string') {
    return {
      passes: input.trim().length > 0,
      value: input,
    };
  }

  // Handle numbers including 0
  if (typeof input === 'number') {
    return {
      passes: true,
      value: input,
    };
  }

  // Handle boolean values
  if (typeof input === 'boolean') {
    return {
      passes: true,
      value: input,
    };
  }

  // Handle all other cases (null, undefined, etc.)
  return {
    passes: input != null && input !== undefined && input !== '',
    value: input,
  };
};

export const nullable: RuleCallBack = (input) => {
  return {
    passes: true,
    value: input,
  };
};

/**
 * Checks if the input is in the specified list.
 * @param input - The input to check.
 * @param params - The list of values to check against.
 */
export const inInput: RuleCallBack = (input, params) => {
  if (typeof params !== 'string') {
    throwEmptyArgsException('in');
  }
  if (params === '') {
    throwEmptyArgsException('in'), 'The in rule parameter must be a string';
  }
  const list = spliteParam(params as string);
  return {
    passes: list.includes(input as string | number),
    value: input,
  };
};
/**
 * Checks if the input is at most the specified size.
 * If the input value is not a file, then the number of characters must be exactly maxSize
 * @param input - The input to check.
 * @param maxSize - The maximum size.
 *  @example
 */
export const size: RuleCallBack = (input, maxSize) => {
  if (typeof maxSize !== 'number' && typeof maxSize !== 'string') {
    throwEmptyArgsException('size');
  }
  if (isFile(input).passes) {
    let numericValue, unit;
    // eslint-disable-next-line no-useless-catch
    try {
      [numericValue, unit] = explodeFileParam(maxSize as string);
    } catch (error) {
      throw error;
    }
    let fileSize = calculateFileSize(input);

    if (isNaN(fileSize)) {
      fileSize = 0;
    }
    numericValue = convertFileSize(numericValue as number, unit as string);
    return {
      passes: fileSize <= numericValue,
      value: input,
    };
  } else {
    return {
      passes: length(input, maxSize).passes,
      value: input,
      alias: 'length',
    }; // Apply length rule for non-file inputs
  }
};
/**
 * Checks if the input is a boolean value.
 */
export const isBoolean: RuleCallBack = (value) => {
  if (typeof value === 'boolean') {
    return { passes: true, value: Boolean(value) };
  }

  return {
    passes:
      value == 'true' ||
      value == '1' ||
      value == 'yes' ||
      value == 'no' ||
      value == 0 ||
      value == 'false' ||
      value == 1,
    value: toBoolean(value),
  };
};
/**
 * Checks if the input is between the specified minimum and maximum values.
 * This rule between validates data according to its type. It can be used to validate numbers, strings, dates, file size, etc.
 * @param input - The input to check.
 * @param min_max - The minimum and maximum values, separated by a comma.
 */
export const between: RuleCallBack = (input, min_max, type) => {
  if (typeof min_max !== 'number' && typeof min_max !== 'string') {
    throwEmptyArgsException('between');
  }
  let [min, max] = spliteParam(min_max as string);
  //for file
  if (type === 'file') {
    return {
      passes: fileBetween(input, min_max, type).passes,
      value: input,
      alias: 'fileBetween',
    };
  }
  // for date
  if (type == 'date' || type == 'date-local') {
    return {
      passes: dateBetween(input, min_max).passes,
      value: input,
      alias: 'dateBetween',
    };
  }

  if (type == 'number') {
    min = Number(min);
    max = Number(max);
    if (input !== undefined && input !== '') {
      if (isNumber(min).passes && isNumber(max).passes) {
        if (!isNumber(input).passes) {
          return {
            passes: false,
            value: input,
          };
        }
        return {
          passes: maxRule(input, max).passes && minRule(input, min).passes,
          value: Number(input),
          alias: 'numberBetween',
        };
      }
    }
  }

  return {
    passes: stringBetween(input, min_max).passes,
    value: input,
    alias: 'stringBetween',
  };
};
/**
 * Checks if the input matches the specified regular expression.
 *
 * @param input - The input to check.
 * @param pattern - The regular expression to match against.
 */
export const regex: RuleCallBack = (input, pattern) => {
  if (!pattern || typeof pattern !== 'string') {
    throw new Error('The regex rule argument must not be empty');
  }
  const parser = new ArgumentParser(pattern);
  const regex = new RegExp(parser.replacePipes());
  return {
    passes: regex.test(input as string),
    value: input,
  };
};

/**
 * Only accepts inputs of a specific type.
 *
 * @param input - The input to check.
 * @param param - The parameter specifying the expected type ("string" or "number").
 */
export const only: RuleCallBack = (input, param) => {
  let passes = false;
  if (param === 'string') {
    if (typeof input !== 'string' || input.length === 0) {
      passes = false;
    } else {
      passes = !/\d/.test(input);
    }
  } else {
    if (param === 'digit') {
      passes = isNumber(input).passes;
    }
  }

  return {
    passes: passes,
    value: input,
  }; // Invalid parameter, return false
};

/**
 * Checks if the input is a digit (numeric value) with the specified number of digits.
 *
 * @param input - The input to check.
 * @param digitCount - The number of digits.
 */
export const digitRule: RuleCallBack = (input, digitCount) => {
  if (!isNumber(digitCount).passes) {
    throw new Error('Digit rule parameter must be a number');
  }
  let passes = false;
  if (isNumber(input).passes) {
    const inputralue = String(input);
    passes =
      /^\d+$/.test(inputralue) && inputralue.length === Number(digitCount);
  }

  return {
    passes: passes,
    value: input,
  };
};

/**
 * Checks if the input is a digit (numeric value) with a number of digits less than or equal to the specified maximum.
 *
 * @param input - The input to check.
 * @param maxDigitCount - The maximum number of digits.
 */
export const maxDigitRule: RuleCallBack = (input, maxDigitCount) => {
  if (!isNumber(maxDigitCount).passes) {
    throw new Error('Max_digit rule parameter must be a number');
  }

  let passes = false;
  if (isNumber(input).passes) {
    const inputralue = String(input);
    passes =
      /^\d+$/.test(inputralue) && inputralue.length <= Number(maxDigitCount);
  }

  return {
    passes: passes,
    value: input,
  };
};

/**
 * Checks if the input is a digit (numeric value) with a number of digits greater than or equal to the specified minimum.
 *
 * @param input - The input to check.
 * @param minDigitCount - The minimum number of digits.
 */
export const minDigitRule: RuleCallBack = (input, minDigitCount) => {
  if (!isNumber(minDigitCount).passes) {
    throw new Error('Min_digit rule parameter must be a number');
  }

  let passes = false;
  if (isNumber(input).passes) {
    const inputralue = String(input);
    passes =
      /^\d+$/.test(inputralue) && inputralue.length >= Number(minDigitCount);
  }

  return {
    passes: passes,
    value: input,
  };
};

/**
 * Checks if the input is equal to a specific value, using strict comparison (===).
 *
 * @param input - The input to check.
 * @param compareValue - The value to compare against.
 */
export const equal: RuleCallBack = (input, compareValue) => {
  return {
    passes: input === compareValue,
    value: input,
  };
};

/**
 * Checks if the input is the same as another field's value, using loose comparison (==).
 * Useful for password confirmation and similar scenarios.
 *
 * @param input - The input to check.
 * @param fieldValue - The value of the field to compare against.
 */
export const same: RuleCallBack = (input, fieldValue) => {
  // Convert both values to strings for loose comparison
  const inputStr = String(input);
  const fieldStr = String(fieldValue);

  return {
    passes: inputStr == fieldStr,
    value: input,
  };
};

/**
 * Validates if the input is a valid object (not null, not an array).
 * Can optionally validate if the object has specific required keys.
 *
 * @param input - The value to validate as an object
 * @param requiredKeys - Optional comma-separated string of keys that must exist in the object
 * @returns Object containing validation result and processed value
 *
 */
export const isObject: RuleCallBack = (input, requiredKeys?) => {
  // Check if input is a valid object
  if (typeof input !== 'object' || !input || Array.isArray(input)) {
    return {
      passes: false,
      value: input,
    };
  }

  // If required keys are specified, verify their existence
  if (requiredKeys) {
    const keys = spliteParam(requiredKeys as string);
    const hasAllKeys = keys.every((key) =>
      Object.prototype.hasOwnProperty.call(input, key as string),
    );

    return {
      passes: hasAllKeys,
      value: input,
    };
  }

  // If no keys are specified, just validate that it's a valid object
  return {
    passes: true,
    value: input,
  };
};

export const isJson: RuleCallBack = (input, requiredKeys?) => {
  // If input is not a string, it can't be JSON
  if (typeof input !== 'string') {
    return {
      passes: false,
      value: input,
    };
  }

  try {
    const parsed = JSON.parse(input);

    // Parsed value must be an object or array, not null
    if (parsed === null || typeof parsed !== 'object') {
      return {
        passes: false,
        value: input,
      };
    }

    // If required keys are specified, verify their existence
    if (requiredKeys) {
      const keys = spliteParam(requiredKeys as string);

      if (Array.isArray(parsed)) {
        // For arrays, check if the required indexes exist
        const hasAllIndexes = keys.every((key) => {
          const index = Number(key);
          return !isNaN(index) && index >= 0 && index < parsed.length;
        });

        return {
          passes: hasAllIndexes,
          value: input,
        };
      } else {
        // For objects, check if the required keys exist
        const hasAllKeys = keys.every((key) =>
          Object.prototype.hasOwnProperty.call(parsed, key as string),
        );

        return {
          passes: hasAllKeys,
          value: input,
        };
      }
    }

    return {
      passes: true,
      value: input,
    };
  } catch (e) {
    return {
      passes: false,
      value: input,
    };
  }
};

/**
 * Validates if the input is a valid array.
 * Can optionally validate if the array has specific required indexes.
 *
 * @param input - The value to validate as an array
 * @param requiredIndexes - Optional comma-separated string of indexes that must exist in the array
 * @returns Object containing validation result and processed value
 */
export const isArray: RuleCallBack = (input, requiredIndexes?) => {
  // Vérifier si l'entrée est un tableau valide
  if (!Array.isArray(input)) {
    return {
      passes: false,
      value: input,
    };
  }

  if (requiredIndexes) {
    const indexes = spliteParam(requiredIndexes as string)
      .map((index) => Number(index))
      .filter((index) => !isNaN(index));

    const hasAllIndexes = indexes.every(
      (index) => index >= 0 && index < input.length,
    );

    return {
      passes: hasAllIndexes,
      value: input,
    };
  }

  return {
    passes: true,
    value: input,
  };
};
