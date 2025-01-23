import { FormValidator } from '../validation';
import { Rule } from './rule';
export type InputCallback<P> = (param: P) => void;

/**
 * Configuration interface
 */
export interface Config {
  invalidClass?: string;
  validClass?: string;
  local?: {
    lang: string;
  };
  realTime?: boolean;
}

export type RuleParam = string | number | undefined | boolean | null;

export interface IInputObject {
  value: InputValueType;
  name: string;
}
export type RuleType = {
  name: string;
  message?: string;
  params?: RuleParam;
  validate?: RuleCallBack;
};

export type InputType =
  | 'text'
  | 'date'
  | 'boolean'
  | 'number'
  | 'file'
  | 'date-local';
export type ValidationState = {
  passes: boolean;
  value: unknown;
  alias?: Rule;
  type?: InputType;
  message?: string[];
};
export interface InputInterface {
  getMessageAttributeName(): string;
  hasRule(rule: string): boolean;
  prependRule(ule: {
    rule: string;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack;
    local?: string;
  }): this;

  getRules(): RuleType[];
}

/**
 * tr.input.validated event details
 */
export type InputEventDetails = {
  rules: Rule[];
  element: HTMLInputElement | HTMLTextAreaElement;
  input: Record<string, string>;
};

/**
 * Input change event
 */
export interface InputChangeEvent {
  details: InputEventDetails;
}

/**
 * Rule callback
 */
export interface RuleCallBack {
  (input: unknown, param?: RuleParam, type?: InputType): ValidationState;
}

export type RulesBag = {
  [ruleName in Rule]: RuleCallBack;
} & {
  [key: string]: RuleCallBack;
};

export type RulesMessages = {
  [key: string]: string;
};

/**
 * Represents a CSS selector that can be either an HTMLElement or a string.
 * @typedef {HTMLElement | string} CssSelector
 */
export type CssSelector = HTMLElement | string;

/**
 * Represents a validatable HTML form input element.
 */
export type ValidatableInput =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLElement
  | HTMLSelectElement
  | 'select'
  | 'textarea'
  | 'input';

/**
 * The possible input types expected to be gotten
 */
export type InputValueType =
  | string
  | Blob
  | File
  | number
  | null
  | boolean
  | undefined
  | FileList
  | File[]
  | Blob[]
  | Record<string, unknown>;

/**
 * An Element or null type
 */
export type ElementOrNull = HTMLElement | null;

/**
 * Indicates whether the message should be displayed
 */
export type WayDisplayError = 'first' | 'last' | 'full';

/**
 * Input parameters
 */
export type InputParms = {
  /**
   * An array of rules that will be used to validate the input element.
   */
  rules?: string | string[];
  /**
   * An object that maps rule names to error messages.
   */
  messages?: string[] | string | Record<string, string>;
  /**
   * The name of the input element.
   */
  name?: string;

  /**
   * Check if input will be validated when user tape into input
   */
  autoValidate?: boolean;

  /**
   * The attribute that will be used to display the error message instead of using the input name directly
   */
  attribute?: string;

  /**
   *If this field is true, the validation will stop at the first error. And will display the error at the same time
   */
  failsOnfirst?: boolean;

  /**
   * Indicates input type
   */
  type?: string;
};

type InputParmsOrRules = InputParms | string | string[];
export type MakeInput = InputParmsOrRules[] | Record<string, InputParmsOrRules>;

/**
 * Callback function for handling events.
 *
 * @param event - The event object.
 */
export type EventCallback = (event: Event) => unknown;

/**
 * Callback function for handling events.
 *
 * @param details - The event object.
 */
export type EventCallbackWithDetails<T> = (details: T) => void;
export type FormConfig = {
  local?: {
    lang?: string;
  };
  name?: string;
};

export type Hooks =
  | 'before.init'
  | 'after.init'
  | 'destroy'
  | 'input.fails'
  | 'input.valid'
  | 'input.updated'
  | 'input.validated';

export type GroupHooks = 'form.fails' | 'form.passes' | 'form.validated';

export type FormHandler = (tr: FormValidator) => unknown;

export * from './rule';

export type RuleNamed = string | string[];
export type RuleOptions = Rule | Rule[] | RuleCallBack | RuleCallBack[];
export type RuleMessage = string | string[] | Record<string, string> | null;
