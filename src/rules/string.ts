import { isNumber } from '.';
import { RuleCallBack } from '../contracts';
import { spliteParam, throwEmptyArgsException } from '../utils';
import { ArgumentParser } from '../validation/utils/argument-parser';

/**
 * This is a callback function that validates email addresses.
 *
 * @param input The email address to validate
 * @description
 * ```md
 *  required|email
 * ```
 */
export const email: RuleCallBack = (input) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (typeof input !== 'string') {
    return {
      passes: false,
      value: input,
    };
  }
  return {
    passes: emailRegex.test(input),
    value: input,
  };
};

/**
 * This is a callback function that checks if a string's length meets a minimum requirement.
 *
 * @param input The input to validate
 * @param length The minimum length required
 * @description
 * ```md
 *  required|minlength:8
 * ```
 */
export const minlength: RuleCallBack = (input, length) => {
  return {
    passes: typeof input == 'string' ? input.length >= Number(length) : false,
    value: input,
  };
};

/**
 * This is a callback function that checks if a string's length does not exceed a maximum.
 *
 * @param input The input to validate
 * @param length The maximum length allowed
 * @description
 * ```md
 *  required|maxlength:8
 * ```
 */
export const maxlength: RuleCallBack = (input, length) => {
  return {
    passes: typeof input == 'string' ? input.length <= Number(length) : true,
    value: input,
  };
};

/**
 * This is a callback function that checks if a value is a string.
 *
 * @param val The input to check
 * @description
 * ```md
 *  required|string
 * ```
 */
export const is_string: RuleCallBack = (val) => {
  return {
    passes: typeof val === 'string',
    value: val,
  };
};

/**
 * This is a callback function that validates URLs.
 *
 * @param input The URL to validate
 * @description
 * ```md
 *  required|url
 * ```
 */
export const url: RuleCallBack = (input) => {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (typeof input !== 'string') {
    return {
      passes: false,
      value: input,
    };
  }
  return {
    passes: urlRegex.test(input),
    value: input,
  };
};

/**
 * This is a callback function that checks if a string starts with an uppercase letter.
 *
 * @param input The input to check
 * @description
 * ```md
 *  required|startWithUpper
 * ```
 */
export const startWithUpper: RuleCallBack = (input) => {
  if (typeof input !== 'string' || input.length === 0) {
    return {
      passes: false,
      value: input,
    };
  }
  const regex = /^[A-Z]/;
  return {
    passes: regex.test(input),
    value: input,
  };
};

/**
 * This is a callback function that checks if a string starts with a lowercase letter.
 *
 * @param input The input to check
 * @description
 * ```md
 *  required|startWithLower
 * ```
 */
export const startWithLower: RuleCallBack = (input) => {
  if (
    typeof input !== 'string' ||
    input.length === 0 ||
    input.charAt(0) === ' '
  ) {
    return {
      passes: false,
      value: input,
    };
  }
  return {
    passes: input[0] == input[0].toLocaleLowerCase(),
    value: input,
  };
};

/**
 * This is a callback function that checks if a string starts with specified prefixes.
 *
 * @param input The string to check
 * @param prefix The prefixes to check for, comma-separated
 * @description
 * ```md
 *  required|startWith:pre1,pre2
 * ```
 */
export const startWith: RuleCallBack = (input, prefix) => {
  if (!prefix) {
    throwEmptyArgsException('startWith');
  }
  const prefixes = spliteParam(prefix as string);
  if (typeof input !== 'string') {
    return {
      passes: false,
      value: input,
    };
  }
  return {
    passes: prefixes.some((p) => input.startsWith(p as string)),
    value: input,
  };
};

/**
 * This is a callback function that checks if a string ends with specified suffixes.
 *
 * @param input The string to check
 * @param suffix The suffixes to check for, comma-separated
 * @description
 * ```md
 *  required|endWith:suf1,suf2
 * ```
 */
export const endWith: RuleCallBack = (input, suffix) => {
  if (!suffix) {
    throwEmptyArgsException('endWith');
  }
  const suffixes = spliteParam(suffix as string);
  if (typeof input !== 'string') {
    return {
      passes: false,
      value: input,
    };
  }
  return {
    passes: suffixes.some((s) => input.endsWith(s as string)),
    value: input,
  };
};

/**
 * This is a callback function that checks if a string contains specified substrings.
 *
 * @param input The string to check
 * @param substrings The substrings to look for, comma-separated
 * @description
 * ```md
 *  required|contains:str1,str2
 * ```
 */
export const contains: RuleCallBack = (input, substring) => {
  if (!substring) {
    throwEmptyArgsException('contains');
  }
  const substrs = spliteParam(substring as string);
  if (typeof input !== 'string') {
    return {
      passes: false,
      value: input,
    };
  }
  const passes = substrs.every((substr) => {
    return input.includes(new ArgumentParser(substr as string).replaceSpaces());
  });
  return {
    passes: passes,
    value: input,
  };
};

/**
 * This is a callback function that checks if a string has a specific length.
 *
 * @param input The string to check
 * @param size The required length
 * @description
 * ```md
 *  required|length:9
 *  required|len:9
 * ```
 */
export const length: RuleCallBack = (input, size) => {
  let inputs: string[] = [];
  if (!isNumber(size).passes) {
    throw new Error('The length rule argument must be an integer');
  }
  size = parseInt(size as string);
  if (typeof input == 'string' || typeof input == 'number') {
    inputs = input.toString().split('');
  } else {
    return {
      passes: false,
      value: input,
    };
  }

  return {
    passes: inputs.length === size,
    value: input,
  };
};

/**
 * This is a callback function that validates password complexity.
 *
 * @param input The password to validate
 * @description
 * ```md
 *  required|password
 * ```
 */
export const passwordRule: RuleCallBack = (input) => {
  if (typeof input !== 'string') {
    return {
      passes: false,
      value: input,
    };
  }
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(input);
  const hasLowercase = /[a-z]/.test(input);
  const hasNumber = /\d/.test(input);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(input);

  if (
    input.length < minLength ||
    !hasUppercase ||
    !hasLowercase ||
    !hasNumber ||
    !hasSpecialChar
  ) {
    return {
      passes: false,
      value: input,
    };
  }

  return {
    passes: true,
    value: input,
  };
};

/**
 * This is a callback function that checks if a string starts with a letter.
 *
 * @param input The string to check
 * @description
 * ```md
 *  required|startWithString
 * ```
 */
export const startWithString: RuleCallBack = (input) => {
  if (
    typeof input !== 'string' ||
    input.length === 0 ||
    input.charAt(0) === ' '
  ) {
    return {
      passes: false,
      value: input,
    };
  }
  const regex = /^[0-9]/;
  return {
    passes: !regex.test(input),
    value: input,
  };
};

/**
 * This is a callback function that checks if a string ends with a letter.
 *
 * @param input The string to check
 * @description
 * ```md
 *  required|endWithString
 * ```
 */
export const endWithString: RuleCallBack = (input) => {
  if (typeof input !== 'string' || input.length === 0) {
    return {
      passes: false,
      value: input,
    };
  }
  const regex = /[0-9]$/;
  return {
    passes: !regex.test(input),
    value: input,
  };
};

/**
 * This is a callback function that checks if a string contains any letters.
 *
 * @param input The string to check
 * @description
 * ```md
 *  required|containsLetter
 * ```
 */
export const containsLetter: RuleCallBack = (input) => {
  if (typeof input !== 'string') {
    return {
      passes: false,
      value: input,
    };
  }
  const letterRegex = /^[0-9]$/;
  return {
    passes: !letterRegex.test(input),
    value: input,
  };
};

/**
 * This is a callback function that checks if a string excludes certain characters.
 *
 * @param input The string to check
 * @param excludedChars The characters to exclude, comma-separated
 * @description
 * ```md
 *  required|excludes:-,@,&esp;
 * ```
 */
export const excludes: RuleCallBack = (input, excludedChars) => {
  if (typeof excludedChars !== 'string' && typeof excludedChars !== 'number') {
    throwEmptyArgsException('excludes');
  }
  const chars = spliteParam(excludedChars as string);
  if (!chars.length) {
    throwEmptyArgsException('excludes');
  }
  if (typeof input !== 'string') {
    return {
      passes: true,
      value: input,
    };
  }

  return {
    passes: !chars.some((char) => {
      return input.includes(new ArgumentParser(char as string).replaceSpaces());
    }),
    value: input,
  };
};

/**
 * This is a callback function that checks if a string is all uppercase.
 *
 * @param input The string to check
 * @description
 * ```md
 *  required|upper
 * ```
 */
export const upper: RuleCallBack = (input) => {
  if (typeof input !== 'string') {
    return {
      passes: false,
      value: input,
    };
  }
  return {
    passes: input === input.toLocaleUpperCase(),
    value: input,
  };
};

/**
 * This is a callback function that checks if a string is all lowercase.
 *
 * @param input The string to check
 * @description
 * ```md
 *  required|lower
 * ```
 */
export const lower: RuleCallBack = (input) => {
  if (typeof input !== 'string') {
    return {
      passes: false,
      value: input,
    };
  }
  return {
    passes: input === input.toLocaleLowerCase(),
    value: input,
  };
};

/**
 * This is a callback function that checks if a string's length is between given values.
 *
 * @param input The string to check
 * @param min_max The minimum and maximum lengths, comma-separated
 * @description
 * ```md
 *  required|stringBetween:2,5
 * ```
 */
export const stringBetween: RuleCallBack = (input, min_max) => {
  if (typeof min_max !== 'string') {
    throwEmptyArgsException('between');
  }
  const [min, max] = spliteParam(min_max as string);
  return {
    passes: minlength(input, min).passes && maxlength(input, max).passes,
    value: input,
  };
};
