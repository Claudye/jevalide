import { RuleCallBack } from '../contracts';
import {
  convertFileSize,
  explodeFileParam,
  fileToArray,
  spliteParam,
  throwEmptyArgsException,
} from '../utils';

/**
 * This is a callback function that checks if a given value is a File or Blob object.
 *
 * @param value The value to check.
 * @description
 * ```md
 *  required|file
 * ```
 */
export const isFile: RuleCallBack = (value) => {
  const _isFile = (f: unknown) => {
    return (
      f instanceof File ||
      f instanceof Blob ||
      (typeof window !== 'undefined' &&
        typeof f !== 'undefined' &&
        f instanceof FileList)
    );
  };
  let passes = false;
  if (
    Array.isArray(value) &&
    !!value.length &&
    value.every((f) => _isFile(f))
  ) {
    passes = true;
  }
  passes = _isFile(value) || passes;

  return {
    passes: passes,
    value: value,
  };
};

/**
 * This is a callback function that checks if a file's size is less than or equal to a given maximum size.
 *
 * @param input The File or Blob object to check.
 * @param maxSize The maximum size in bytes, with an optional unit (B, KB, MB, or GB).
 * @description
 * ```md
 *  required|maxFileSize:1MB
 * ```
 * @throws If the maxSize parameter is not in a valid format
 */
export const maxFileSize: RuleCallBack = (input, maxSize) => {
  const files = fileToArray(input);

  if (!files.length) {
    return {
      value: input,
      passes: false,
    };
  }
  const passes = files.every((input) => {
    if (isFile(input).passes) {
      let numericValue, unit;
      // eslint-disable-next-line no-useless-catch
      try {
        [numericValue, unit] = explodeFileParam(maxSize as string);
      } catch (error) {
        throw error;
      }
      return (
        input.size <= convertFileSize(numericValue as number, unit as string)
      );
    } else {
      return true;
    }
  });

  return {
    passes: passes,
    value: files,
  };
};

/**
 * This is a callback function that checks if a file's size is greater than or equal to a given minimum size.
 *
 * @param input The File or Blob object to check.
 * @param minSize The minimum size in bytes, with an optional unit (B, KB, MB, or GB).
 * @description
 * ```md
 *  required|minFileSize:1MB
 * ```
 * @throws If the minSize parameter is not in a valid format
 */
export const minFileSize: RuleCallBack = (input, minSize) => {
  const files = fileToArray(input);
  if (!files.length) {
    return {
      value: input,
      passes: false,
    };
  }
  if (typeof minSize !== 'number' && typeof minSize !== 'string') {
    throwEmptyArgsException(
      'minFileSize',
      'The minimum size rule argument is required',
    );
  }
  const passses = files.every((input) => {
    if (isFile(input).passes) {
      let numericValue, unit;
      // eslint-disable-next-line no-useless-catch
      try {
        [numericValue, unit] = explodeFileParam(minSize as string);
      } catch (error) {
        throw error;
      }
      return (
        input.size >= convertFileSize(numericValue as number, unit as string)
      );
    } else {
      return false;
    }
  });
  return {
    passes: passses,
    value: files,
  };
};

/**
 * This is a callback function that checks if a file's size is between given minimum and maximum sizes.
 *
 * @param input The File or Blob object to check.
 * @param min_max A string containing minimum and maximum sizes, separated by a delimiter.
 * @description
 * ```md
 *  required|fileBetween:1MB,5MB
 * ```
 */
export const fileBetween: RuleCallBack = (input, min_max) => {
  if (typeof min_max !== 'string') {
    throwEmptyArgsException('between');
  }
  const [min, max] = spliteParam(min_max as string);
  const files = fileToArray(input);
  if (!files.length) {
    return {
      value: input,
      passes: false,
    };
  }
  const passes = files.every((input) => {
    return maxFileSize(input, max).passes && minFileSize(input, min).passes;
  });
  return {
    passes: passes,
    value: input,
  };
};

/**
 * This is a callback function that checks if a file's MIME type matches specified types.
 *
 * @param input The File, Blob, FileList or File[] object to check.
 * @param param The MIME types to match (wildcard *, specific type .pdf, or type group images/*).
 * @description
 * ```md
 *  required|mimes:.pdf
 * ```
 */
export const isMimes: RuleCallBack = (input, param) => {
  if (typeof param !== 'string') {
    throwEmptyArgsException('mimes');
  }
  if (param === '') {
    throwEmptyArgsException('mimes');
  }

  const files = fileToArray(input);
  if (!files.length) {
    return {
      value: input,
      passes: false,
    };
  }

  const passes = files.every((input) => {
    if (isFile(input).passes) {
      const file = input as File;

      const allowedMimes =
        (param as string).split(',').map((m: string) => m.trim()) ?? [];

      const passes = allowedMimes.some((allowedMime) => {
        allowedMime = allowedMime.replace(/\s/g, '');
        if (
          allowedMime === '*' ||
          file.name.endsWith(allowedMime) ||
          allowedMime == '' ||
          file.type == ''
        ) {
          return true; // Wildcard (*) matches any MIME type
        } else if (allowedMime.endsWith('/*')) {
          const group = allowedMime.slice(0, -2); // Remove the trailing /*
          return file.type.startsWith(group);
        } else if (allowedMime.startsWith('*.')) {
          const ext = allowedMime.substring(2); // get extension without the "*."
          return file.name.endsWith(ext);
        } else {
          return file.type === allowedMime;
        }
      });
      return passes;
    } else {
      return false;
    }
  });
  return {
    passes: passes,
    value: input,
  };
};
