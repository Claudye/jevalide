import { dateBetween } from './../rules/date';
import { endWithString, stringBetween } from '../rules/string';
import { fileBetween, isMimes, minFileSize } from '../rules/file';
import { Rule, RuleCallBack, RulesBag, RulesMessages } from '../contracts';
import {
  between,
  contains,
  email,
  endWith,
  inInput,
  integer,
  isNumber,
  is_string,
  maxRule,
  maxlength,
  minRule,
  minlength,
  required,
  startWith,
  length,
  url,
  isFile,
  maxFileSize,
  size,
  isBoolean,
  startWithUpper,
  nullable,
  startWithLower,
  passwordRule,
  startWithString,
  excludes,
  containsLetter,
  regex,
  lower,
  upper,
  modulo,
  only,
  digitRule,
  minDigitRule,
  lessthan,
  maxDigitRule,
  greaterthan,
  numberBetween,
  same,
  equal,
  isObject,
  isJson,
  isArray,
} from '../rules';
import { dateAfter, dateBefore, isDate, isTime } from '../rules/date';
import { Local } from '../locale/local';
import { phone } from '../rules/phone';

export class Bag {
  protected rules: RulesBag & {
    [key: string]: RuleCallBack;
  };
  trLocal: Local;

  constructor(trLocal: Local) {
    this.trLocal = trLocal;
    this.rules = {
      required: required,
      email: email,
      maxlength: maxlength,
      minlength: minlength,
      min: minRule,
      max: maxRule,
      string: is_string,
      between: between,
      startWith: startWith,
      endWith: endWith,
      contains: contains,
      in: inInput,
      integer: integer,
      int: integer,
      modulo: modulo,
      number: isNumber,
      numeric: isNumber,
      url: url,
      length: length,
      len: length,
      file: isFile,
      maxFileSize: maxFileSize,
      minFileSize: minFileSize,
      size: size,
      boolean: isBoolean,
      startWithUpper: startWithUpper,
      nullable: nullable,
      startWithLower: startWithLower,
      password: passwordRule,
      date: isDate,
      before: dateBefore,
      after: dateAfter,
      phone: phone,
      time: isTime,
      startWithString: startWithString,
      endWithString: endWithString,
      excludes: excludes,
      hasLetter: containsLetter,
      regex: regex,
      lower: lower,
      upper: upper,
      stringBetween: stringBetween,
      mod: modulo,
      only: only,
      mimes: isMimes,
      digit: digitRule,
      minDigit: minDigitRule,
      lessThan: lessthan,
      lthan: lessthan,
      maxDigit: maxDigitRule,
      greaterThan: greaterthan,
      gthan: greaterthan,
      fileBetween: fileBetween,
      dateBetween: dateBetween,
      numberBetween: numberBetween,
      same: same,
      equal: equal,
      object: isObject,
      json: isJson,
      array: isArray,
    };
  }

  /**
   * Add a custom validation rule to the rules bag
   * @param rule - The name of the custom rule
   * @param callback - The callback function for the custom rule
   * @param message - The error message for the custom rule
   */
  rule(rule: string, callback: RuleCallBack, message?: string, local?: string) {
    this.addRule(rule, callback);
    this.addMessage(rule, message, local);
  }

  /**
   * Add a custom validation rule to the rules bag
   * @param rule - The name of the custom rule
   * @param callback - The callback function for the custom rule
   */
  addRule(rule: string, callback: RuleCallBack) {
    this.rules[rule as keyof RulesBag] = callback;
  }

  /**
   * Add a custom error message for a validation rule to the messages bag
   * @param rule - The name of the validation rule
   * @param message - The error message for the validation rule
   */
  addMessage(rule: string, message?: string, local?: string) {
    this.trLocal.addMessage(rule, message, local);
  }

  /**
   * Check if a validation rule exists in the rules bag
   * @param rule - The name of the validation rule
   * @returns True if the rule exists, false otherwise
   */
  hasRule(rule: string): boolean {
    return rule in this.rules;
  }

  getRule(name: string) {
    return this.rules[name as Rule];
  }

  getMessage(name: string, local?: string): string {
    return this.trLocal.getRuleMessage(name, local);
  }

  allRules() {
    return this.rules;
  }

  allMessages(local?: string) {
    return this.trLocal.getMessages(local);
  }
}

/**
 * Class representing custom validation rule management.
 * @extends   Bag
 */
export class RuleBag extends Bag {
  /**
   * Adds a custom validation rule to the rule bag.
   * @param rule - The name of the custom rule.
   * @param callback - The callback function for the custom rule.
   * @example
   * ```typescript
   * const trRule = new   RuleBag(trLocal);
   * trRule.add("customRule", (input) => {
   *   // Custom validation logic here
   *   return {
   *     passes: true,
   *     value: input
   *   };
   * });
   * ```
   */
  add(rule: string, callback: RuleCallBack): void {
    this.addRule(rule, callback);
  }

  /**
   * Checks if a validation rule exists in the rule bag.
   * @param rule - The name of the validation rule.
   * @returns True if the rule exists, otherwise false.
   * @example
   * ```typescript
   * const trRule = new   RuleBag(trLocal);
   * const exists = trRule.has("required");
   * ```
   */
  has(rule: string): boolean {
    return this.hasRule(rule);
  }

  /**
   * Retrieves all validation rules from the rule bag.
   * @returns An object containing all validation rules.
   * @example
   * ```typescript
   * const trRule = new   RuleBag(trLocal);
   * const allRules = trRule.all();
   * ```
   */
  all(): RulesBag {
    return this.allRules();
  }

  /**
   * Retrieves a specific validation rule from the rule bag.
   * @param name - The name of the validation rule to retrieve.
   * @returns The callback function associated with the validation rule.
   * @example
   * ```typescript
   * const trRule = new   RuleBag(trLocal);
   * const ruleFunction = trRule.get("required");
   * ```
   */
  get(name: string): RuleCallBack {
    return this.getRule(name);
  }
}

/**
 * Class representing error message management for validation rules.
 * @extends   Bag
 */
export class Message extends Bag {
  /**
   * Retrieves the error message for a validation rule.
   * @param rule - The name of the validation rule.
   * @param local - The locale for the error message (optional).
   * @returns The error message for the validation rule.
   * @example
   * ```typescript
   * const   Message = new   Message(trLocal);
   * const errorMessage =   Message.get("required", "en");
   * ```
   */
  get(rule: string, local?: string): string {
    return this.getMessage(rule, local);
  }

  /**
   * Retrieves all error messages for validation rules.
   * @param local - The locale for the error messages (optional).
   * @returns An object containing all error messages for validation rules.
   * @example
   * ```typescript
   * const   Message = new   Message(trLocal);
   * const allMessages =   Message.all("en");
   * ```
   */
  all(local?: string): RulesMessages {
    return this.allMessages(local);
  }

  /**
   * Adds a custom error message for a validation rule.
   * @param rule - The name of the validation rule.
   * @param message - The custom error message (optional).
   * @param local - The locale for the error message (optional).
   * @example
   * ```typescript
   * const   Message = new   Message(trLocal);
   *   Message.add("customRule", "Custom error message", "en");
   * ```
   */
  add(rule: string, message?: string, local?: string): void {
    this.addMessage(rule, message, local);
  }
}
