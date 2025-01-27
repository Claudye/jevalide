import { maxlength, minlength } from './string';
import { isFile, maxFileSize, minFileSize } from './file';
import { spliteParam } from '../utils';
import { RuleCallBack } from '../contracts';

/**
 * This is a callback function that checks input values or character lengths against a minimum.
 *
 * @param input The input to check
 * @param min The minimum length
 * @description
 * ```md
 *  required|min:2
 * ```
 */
export const minRule: RuleCallBack = (input, min, type) => {
  if (!isNumber(min).passes) {
    throw new Error('Min rule parameter must be an integer');
  }
  if (isFile(input).passes || type == 'file') {
    return {
      passes: minFileSize(input, min, type).passes,
      value: input,
    };
  }
  if (input === undefined || input === null) {
    input = 0;
  }

  if (isNumber(input).passes) {
    return {
      passes: Number(input) >= Number(min),
      value: Number(input),
    };
  } else {
    return {
      passes: minlength(input, min).passes,
      value: input,
      alias: 'minlength',
    };
  }
};

/**
 * This is a callback function that checks input values or character lengths against a maximum.
 *
 * @param input The input to check
 * @param max The maximum length
 * @description
 * ```md
 *  required|max:20
 * ```
 */
export const maxRule: RuleCallBack = (input, max, type) => {
  if (!isNumber(max).passes) {
    throw new Error('Min rule parameter must be an integer');
  }
  if (isFile(input).passes || type == 'file') {
    return {
      passes: maxFileSize(input, max).passes,
      value: input,
      alias: 'maxFileSize',
    };
  }

  if (input === undefined || input === null) {
    input = 0;
  }
  if (isNumber(input).passes) {
    return {
      passes: Number(input) <= Number(max),
      value: Number(input),
    };
  } else {
    return {
      passes: maxlength(input, max).passes,
      value: input,
      alias: 'maxlength',
    };
  }
};

/**
 * This is a callback function that checks if the input is an integer.
 *
 * @param input The input to check
 * @description
 * ```md
 *  required|integer
 *  required|int
 * ```
 */
export const integer: RuleCallBack = (input) => {
  const numberRule = isNumber(input);
  if (numberRule.passes) {
    const passes = Number.isInteger(numberRule.value);
    return {
      passes: passes,
      value: passes ? parseInt(numberRule.value as string) : input,
      type: numberRule.type,
    };
  }
  return {
    passes: false,
    value: input,
  };
};

/**
 * This is a callback function that checks if the input is a number.
 *
 * @param input The input to check
 * @description
 * ```md
 *  required|number
 * ```
 */
export const isNumber: RuleCallBack = (input) => {
  if (input === '' || input === null || input === undefined) {
    return {
      passes: false,
      value: input,
    };
  }

  if (input === '0' || input === 0) {
    return {
      passes: true,
      value: 0,
      type: 'number',
    };
  }

  if (input === '1' || input === 1) {
    return {
      passes: true,
      value: 1,
      type: 'number',
    };
  }
  return {
    passes:
      !isNaN(Number(input)) &&
      typeof input !== 'boolean' &&
      typeof input !== 'object',
    value: Number(input),
    type: 'number',
  };
};

/**
 * This is a callback function that checks if a number is divisible by another number.
 *
 * @param input The input to check
 * @description
 * ```md
 *  required|modulo:2
 *  required|mod:2
 * ```
 */
export const modulo: RuleCallBack = (input, mod) => {
  if (!isNumber(mod).passes) {
    throw new Error('Modulo rule parameter must be an integer');
  }

  if (isNumber(input).passes) {
    return {
      passes: Number(input) % Number(mod) === 0,
      value: Number(input),
    };
  }

  return {
    passes: false,
    value: input,
  };
};

/**
 * This is a callback function that checks if the input is less than a threshold.
 *
 * @param input The input to check
 * @param threshold The threshold value
 * @description
 * ```md
 *  required|lessThan:10
 * ```
 */
export const lessthan: RuleCallBack = (input, threshold) => {
  if (!isNumber(threshold).passes) {
    throw new Error('Lessthan rule parameter must be a number');
  }

  if (isNumber(input).passes) {
    return {
      passes: Number(input) < Number(threshold),
      value: input,
    };
  }

  return {
    passes: false,
    value: input,
  };
};

/**
 * This is a callback function that checks if the input is greater than a threshold.
 *
 * @param input The input to check
 * @param threshold The threshold value
 * @description
 * ```md
 *  required|greaterThan:5
 * ```
 */
export const greaterthan: RuleCallBack = (input, threshold) => {
  if (!isNumber(threshold).passes) {
    throw new Error('Greaterthan rule parameter must be a number');
  }

  if (isNumber(input).passes) {
    return {
      passes: Number(input) > Number(threshold),
      value: input,
    };
  }

  return {
    passes: false,
    value: input,
  };
};

/**
 * This is a callback function that checks if the input is between two values.
 *
 * @param input The input to check
 * @param params String containing min and max values separated by comma
 * @description
 * ```md
 *  required|numberBetween:1,10
 * ```
 */
export const numberBetween: RuleCallBack = (input, params) => {
  if (!isNumber(input).passes) {
    return {
      passes: false,
      value: input,
    };
  }

  const [min, max] = spliteParam(params as string);
  const inputValue = Number(input);

  const passes = minRule(input, min).passes && maxRule(input, max).passes;
  return {
    passes: passes,
    value: inputValue,
  };
};
