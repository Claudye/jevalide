import {
  MakeInput,
  FormConfig,
  InputParms,
  InputType,
  RuleParam,
  RuleCallBack,
  RulesMessages,
} from '../contracts';
import { FormValidator } from './form-validator';
import { InputValidator } from './input-validator';
import { Local } from '../locale/local';
import { Message, Bag } from './bag';

export class Jevalide {
  private static instance: Jevalide;
  private readonly forms: Map<string, FormValidator>;
  private readonly inputs: Map<string, InputValidator>;
  private readonly trLocal: Local;
  private readonly _bag: Bag;
  private readonly Message: Message;

  private constructor() {
    this.forms = new Map();
    this.inputs = new Map();
    this.trLocal = new Local();
    this._bag = new Bag(this.trLocal);
    this.Message = new Message(this.trLocal);
  }

  /**
   * Initializes or returns the Jevalide singleton instance
   * @param params - Optional initialization parameters
   * @param params.rules - Custom validation rules to add
   * @param params.messages - Custom error messages to add
   * @param params.local - Locale to set
   * @returns The Jevalide instance
   */
  public static init(params?: {
    rules?: Record<string, RuleCallBack>;
    messages?: Record<string, string>;
    local?: string;
  }): Jevalide {
    if (!Jevalide.instance) {
      Jevalide.instance = new Jevalide();
    }

    if (params) {
      const instance = Jevalide.instance;

      // Set locale if provided
      if (params.local) {
        instance.setLocale(params.local);
      }

      // Add custom rules if provided
      if (params.rules) {
        instance.setRules(params.rules);
      }

      // Add custom messages if provided
      if (params.messages) {
        instance.setMessages(params.messages, params.local);
      }
      Jevalide.instance = instance;
    }

    return Jevalide.instance;
  }
  /**
   * Creates a form validator instance
   * @param inputs - Form input definitions
   * @param data - Form data to validate
   * @param config - Optional form configuration
   */
  form<T>(inputs: MakeInput, data: Partial<T>, config?: FormConfig) {
    const instance = Jevalide.instance;
    const validator = new FormValidator<T>(inputs, data, instance._bag, config);
    if (config?.name) {
      instance.forms.set(config.name, validator as FormValidator);
    }
    return validator;
  }

  /**
   * Creates an input validator instance
   * @param params - Input validator parameters
   */
  input(params: InputParms) {
    const instance = Jevalide.instance;
    const validator = new InputValidator(instance._bag, params);
    if (params.name) {
      instance.inputs.set(params.name, validator);
    }
    return validator;
  }

  /**
   * Runs a validation rule on a specific input
   * @param ruleName - Name of the validation rule
   * @param input - Input value to validate
   * @param param - Optional rule parameters
   * @param type - Optional input type
   */
  run(ruleName: string, input: unknown, param?: RuleParam, type?: InputType) {
    if (!this._bag.hasRule(ruleName)) {
      throw new Error(`Rule ${ruleName} not found`);
    }

    const rule = this._bag.getRule(ruleName);
    return rule(input, param, type);
  }

  /**
   * Adds a custom validation rule
   * @param ruleName - Name of the rule
   * @param callback - Rule validation function
   * @param message - Optional error message
   * @param locale - Optional locale for the message
   */
  rule(
    ruleName: string,
    callback: RuleCallBack,
    message?: string,
    locale?: string,
  ) {
    this._bag.addRule(ruleName, callback);
    if (message) {
      this.Message.add(ruleName, message, locale);
    }
  }

  /**
   * Checks if a rule exists
   * @param ruleName - Name of the rule to check
   */
  hasRule(ruleName: string): boolean {
    return this._bag.hasRule(ruleName);
  }

  /**
   * Gets a validation rule
   * @param ruleName - Name of the rule to retrieve
   */
  getRule(ruleName: string): RuleCallBack {
    return this._bag.getRule(ruleName);
  }

  /**
   * Adds a custom error message
   * @param ruleName - Name of the rule
   * @param message - Error message
   * @param locale - Optional locale for the message
   */
  message(ruleName: string, message: string, locale?: string) {
    this.Message.add(ruleName, message, locale);
  }

  /**
   * Gets an error message
   * @param ruleName - Name of the rule
   * @param locale - Optional locale
   */
  getMessage(ruleName: string, locale?: string): string {
    return this.Message.get(ruleName, locale ?? this.trLocal.getLocal());
  }

  /**
   * Sets the current locale
   * @param locale - Locale to set
   */
  setLocale(locale: string): void {
    this.trLocal.local(locale);
  }

  /**
   * Gets the current locale
   */
  getLocale(): string {
    return this.trLocal.getLocal();
  }

  /**
   * Adds translations for a specific locale
   * @param locale - Target locale
   * @param messages - Messages to translate
   */
  translate(locale: string, messages: RulesMessages): void {
    this.trLocal.translate(locale, messages);
  }

  /**
   * Updates a specific message for a locale
   * @param locale - Target locale
   * @param ruleName - Name of the rule
   * @param message - New message
   */
  rewrite(locale: string, ruleName: string, message: string): void {
    this.trLocal.rewrite(locale, ruleName, message);
  }

  /**
   * Updates multiple messages for a locale
   * @param locale - Target locale
   * @param rules - Array of rule names
   * @param messages - Array of messages
   */
  rewriteMany(locale: string, rules: string[], messages: string[]): void {
    this.trLocal.rewriteMany(locale, rules, messages);
  }

  get messages() {
    return this.Message;
  }

  get local() {
    return this.trLocal;
  }

  get bag() {
    return this._bag;
  }

  /**
   * Sets multiple messages at once
   * @param messages - Object containing rule names as keys and messages as values
   * @param locale - Optional locale for the messages
   */
  setMessages(messages: Record<string, string>, locale?: string): void {
    if (!messages || typeof messages !== 'object') {
      throw new Error(
        'Messages must be a valid object with rule names as keys and messages as values',
      );
    }

    Object.entries(messages).forEach(([ruleName, message]) => {
      this.Message.add(ruleName, message, locale);
    });
  }
  /**
   * Sets multiple validation rules at once
   * @param rules - Object containing rule names as keys and rule callbacks as values
   */
  setRules(rules: Record<string, RuleCallBack>): void {
    if (!rules || typeof rules !== 'object') {
      throw new Error(
        'Rules must be a valid object with rule names as keys and callbacks as values',
      );
    }

    Object.entries(rules).forEach(([ruleName, callback]) => {
      if (typeof callback !== 'function') {
        throw new Error(`Rule callback for "${ruleName}" must be a function`);
      }
      this._bag.addRule(ruleName, callback);
    });
  }
}
