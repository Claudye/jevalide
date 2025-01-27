import { InputRule } from './utils/input-rule';
import { InputValueType, InputType, Rule, RulesMessages } from '../contracts';

import { RuleExecuted } from '.';
import { Messages } from '../messages';
import { Local } from '../locale/local';

export class Validation {
  private _inputType = 'text';
  /**
   * The list of rules that should be executed on the value
   */
  private _rules!: InputRule;

  /**
   * The current value to validate
   */
  private _value: InputValueType = undefined;

  /**
   * A list of rules run
   */
  private readonly _ruleExecuted: RuleExecuted[] = [];
  /**
 
  /**
   * A boolean value indicating whether the validation rules should
   * fail on the first error or continue executing all rules
   */
  private _failOnfirst = true;

  /**
   * The attrabute name that should be used to display the validation errors
   */
  private _attr = '';

  /**
   * An object containing the original validation rules errors as key-value pairs (record) of rule names and error
   * messages
   */
  private _messages: Record<string, string> = {};

  locale!: Local;

  constructor(locale: Local) {
    this.locale = locale;
  }
  /**
   * This method performs the validation process. It iterates over the _rules array and executes each rule on the
   * _value. If _failOnfirst is set to true, the method stops executing rules after the first failure. The method
   * updates the _ruleExecuted array with the result of each rule execution.
   * It returns a boolean value indicating whether the validation passed (true) or not (false)
   * @example
   * const validation = new Validation(param)
   * validation.validate()
   */
  validate() {
    const rules = this._rules.all();

    if (!Array.isArray(rules)) {
      throw new Error('The rule provided must be an array of Rule');
    }

    let inputType = this._inputType as InputType;
    let isNullableAndNull = false;

    for (const rule of rules) {
      const ruleName = rule.name;
      const params = rule.params;
      const ruleCallback = rule.validate;
      const message = rule.message;

      let ruleToRun = ruleName;
      const ruleExec = this._makeRuleExcutedInstance(ruleToRun, ruleName);
      ruleExec.params = params;

      // Skip validation if value is null and we've already passed the nullable rule
      if (isNullableAndNull) {
        ruleExec.passed = true;
        ruleExec.valueTested = this._value;
        ruleExec.run = true;
        this._addRuleExecuted(ruleExec);
        continue;
      }

      if (!ruleCallback || typeof ruleCallback !== 'function') {
        throw new Error(`The rule ${ruleName} is not defined`);
      }

      const state = ruleCallback(this._value, params, inputType);

      // Check if this is a nullable rule that passed with null value
      if (
        ruleName === 'nullable' &&
        state.passes &&
        (this._value === null ||
          this._value === '' ||
          this._value === undefined)
      ) {
        isNullableAndNull = true;
      }

      ruleExec.passed = state.passes;
      this._value = state.value as InputValueType;
      inputType = state.type ?? inputType;
      ruleToRun = state.alias ?? ruleName;

      ruleExec.valueTested = this._value;
      ruleExec.run = true;
      this._addRuleExecuted(ruleExec);

      if (this._failOnfirst) {
        if (!ruleExec.passed) {
          this._parseRuleMessage(ruleExec, ruleToRun, message);
          break;
        }
      } else {
        if (!ruleExec.passed) {
          this._parseRuleMessage(ruleExec, ruleToRun, message);
        } else {
          ruleExec.message = null;
        }
      }
    }

    return !this.hasErrors();
  }
  /**
   * Get rule/message error
   * @returns
   */
  getErrors() {
    const r: Record<string, string> = {};
    for (const rx of this._ruleExecuted) {
      if (!rx.passed) {
        r[rx.orignalName] = rx.message ?? '';
      }
    }
    return r;
  }
  /**
   * Check if validation failed
   * @returns
   */
  hasErrors(): boolean {
    return this._ruleExecuted.some((rx) => !rx.passed);
  }

  /**
   * This method is an alias for hasErrors(). It returns true if there are no errors, false otherwise
   */
  passes() {
    return !this.hasErrors();
  }

  /**
   * Set rules to run
   * @param rules
   */
  setRules(rules: InputRule): void {
    this._rules = rules;
  }

  /**
   * Get rules to run
   * @returns
   */
  getRules() {
    return this._rules;
  }

  /**
   * Create an instance of RuleExcuted
   * @param r
   * @returns
   */
  private _makeRuleExcutedInstance(r: string, originalRuleName: string) {
    const re = this._ruleExecuted.find((rx) => {
      return rx.isNamed(r);
    });
    return re ?? new RuleExecuted(r, originalRuleName);
  }

  private _addRuleExecuted(ruleExecuted: RuleExecuted) {
    if (!this._ruleExecuted.includes(ruleExecuted)) {
      this._ruleExecuted.push(ruleExecuted);
    }
  }
  private _parseRuleMessage(
    ruleExec: RuleExecuted,
    aliasRule: string,
    message: string | undefined | null,
  ) {
    const orgMesage = this.locale.getRuleMessage(ruleExec.orignalName);

    if (message && message !== orgMesage) {
      this._messages[ruleExec.ruleName] = message;
    } else {
      this._messages[ruleExec.ruleName] = this.locale.getRuleMessage(
        aliasRule ?? ruleExec.ruleName,
      );
    }

    const messages = new Messages(this.locale.getMessages()).setMessages(
      this._messages as RulesMessages,
    );

    message = Messages.parseMessage(
      this._attr,
      ruleExec.ruleName as Rule,
      messages.getRulesMessages([ruleExec.ruleName as Rule])[0],
      ruleExec.params,
    );

    ruleExec.message = message;

    return ruleExec;
  }

  /**
   * Set the value and validate it automatically
   */
  set value(v: InputValueType) {
    this._value = v;
    this.validate();
  }

  set failsOnFirst(fails: boolean) {
    this._failOnfirst = fails;
  }

  get value(): InputValueType {
    return this._value;
  }

  set attribute(attr: string) {
    this._attr = attr;
  }

  get attribute() {
    return this._attr;
  }
  /**
   * Set validation parameters
   * @param param
   */

  set(rules: InputRule, failsOnfirst: boolean, type: string) {
    this._failOnfirst = failsOnfirst;

    this._rules = rules;
    this._inputType = type ?? this._inputType;
  }

  getRuleExecuted(): RuleExecuted[] {
    return this._ruleExecuted;
  }
  set rules(rules: InputRule) {
    this.setRules(rules);
  }
}
