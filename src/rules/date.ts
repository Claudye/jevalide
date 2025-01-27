import dayjs from 'dayjs';
import { RuleCallBack } from '../contracts';
import { now, spliteParam, throwEmptyArgsException } from '../utils';

/**
 * This is a callback function that checks if the input is a valid date.
 *
 * @param input The input string to be validated.
 * @description
 * ```md
 *  required|date
 * ```
 */
export const isDate: RuleCallBack = (input) => {
  if (!input) {
    return {
      passes: false,
      value: input,
    };
  }
  const djs = dayjs(new Date(input.toString()), undefined, true);

  if (djs.isValid()) {
    return {
      passes: true,
      value: djs.toISOString(),
      type: 'date',
    };
  }
  return {
    passes: false,
    value: input,
  };
};

/**
 * This is a callback function that checks if a given date is before another date.
 *
 * @param input The date to check, as a string in ISO 8601 format or a Date object.
 * @param date The date to compare against, as a string in ISO 8601 format or the string "now" to use the current date and time.
 * @description
 * ```md
 *  required|before:2020-11-11
 *  required|before:now
 * ```
 */
export const dateBefore: RuleCallBack = (input, date) => {
  if (date === 'now') {
    date = now();
  }
  if (!isDate(input).passes) {
    return {
      passes: false,
      value: input,
    };
  }

  if (!isDate(date).passes) {
    throw new Error('Pease provide a valid argument for dateBefore rule');
  }
  return {
    passes: dayjs(input as string).isBefore(date as string),
    value: input,
  };
};

/**
 * This is a callback function that checks if a given date is after another date.
 *
 * @param input The date to check, as a string in ISO 8601 format or a Date object.
 * @param date The date to compare against, as a string in ISO 8601 format or the string "now" to use the current date and time.
 * @description
 * ```md
 *  required|after:2020-11-11
 *  required|after:now
 * ```
 */
export const dateAfter: RuleCallBack = (input, date) => {
  if (date === 'now') {
    date = now();
  }

  if (!isDate(input).passes) {
    return {
      passes: false,
      value: input,
    };
  }

  if (!isDate(date).passes) {
    throw new Error('Pease provide a valid argument for dateAfter rule');
  }
  return {
    passes: dayjs(input as string).isAfter(date as string),
    value: isDate(input).value,
  };
};

/**
 * This is a callback function that checks if a given date is between two other dates.
 *
 * @param input The date to check, as a string in ISO 8601 format or a Date object.
 * @param date The range of dates to compare against, as a string in the format "startDate,endDate", where startDate and endDate are strings in ISO 8601 format or the string "now" to use the current date and time.
 * @description
 * ```md
 *  required|dateBetween:2020-11-11,now
 *  required|dateBetween:2020-11-11,2021-11-11
 * ```
 * @throws An exception with the message "Missing required argument: dateBetween" if the date parameter is falsy.
 */
export const dateBetween: RuleCallBack = (input, date) => {
  if (!date) {
    throwEmptyArgsException('dateBetween');
  }
  const [startDate, endDate] = spliteParam(date as string);
  return {
    passes:
      dateAfter(input, startDate).passes && dateBefore(input, endDate).passes,
    value: input,
  };
};

/**
 * This is a callback function that checks if a given string represents a valid time in 24-hour format.
 *
 * @param input The string to check in format HH:mm:ss.
 * @description
 * ```md
 *  required|time
 * ```
 */
export const isTime: RuleCallBack = (input) => {
  if (typeof input !== 'string') {
    return {
      passes: false,
      value: input,
    };
  }
  // If the input does not have three parts separated by colons (H:m:i)
  if (input.toString().split(':').length < 3) {
    // Complete the input with ":00" until it has the format H:m:i
    while (input.split(':').length < 3) {
      input += ':00';
    }
  }
  return {
    passes: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(input),
    value: input,
  };
};
