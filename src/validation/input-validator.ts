import {
  InputType,
  InputInterface,
  InputCallback,
  RuleCallBack,
  RuleOptions,
  RuleParam,
  Hooks,
  InputParms,
  InputValueType,
} from '../contracts';
import { AbstractInputralidator } from './abstract-input';
import { Bag } from './bag';
import { TrParameter } from './utils/parameter';
import { RuleExecuted } from './utils/rule-executed';

export class InputValidator extends AbstractInputralidator {
  constructor(bag: Bag, param?: InputParms, parameter?: TrParameter) {
    super(bag, param, parameter);
  }

  rule(ruleName: string, call: RuleCallBack, message?: string) {
    this._bag.rule(ruleName, call, message);
  }

  with(param: InputParms) {
    this.setParams(param);
  }

  whereName(inputName: string): boolean {
    return this.name === inputName;
  }

  onFails(fn: InputCallback<InputInterface>) {
    this.addHook('input.fails', fn);
  }

  onPasses(fn: InputCallback<InputInterface>) {
    this.addHook('input.valid', fn);
  }

  onUpdate(fn: InputCallback<InputInterface>) {
    this.addHook('input.updated', fn);
  }

  onValidate(fn: InputCallback<InputInterface>) {
    this.addHook('input.validated', fn);
  }

  destroy() {
    this.rules.clear();
    this.param.rules = [];
    this.executeHooks('destroy');
  }

  is(name: string) {
    return name === this.name;
  }

  private hooks = {} as Record<Hooks, InputCallback<InputInterface>[]>;
  _validateCount = 0;

  validate() {
    return this.valid();
  }

  getRules() {
    return this.rules.all();
  }

  hasRules() {
    return this.rules.length > 0;
  }

  getMessages() {
    return this.messages;
  }

  valid() {
    this.validator.value = this.value;
    const passed = this.validator.passes();
    this.validator.getErrors();
    return passed;
  }

  getErrors(): Record<string, string> {
    return this.errors;
  }

  fails(): boolean {
    return !this.passes();
  }

  passes() {
    return this.valid();
  }

  protected __call(fn?: CallableFunction, ...params: unknown[]) {
    if (typeof fn == 'function') {
      fn(...params);
    }
  }

  getRuleExecuted(): RuleExecuted[] {
    return this.validator.getRuleExecuted();
  }

  removeRule(rule: string): this {
    this.rules.remove(rule);
    return this;
  }

  removeRules(rules: string[]): this {
    if (Array.isArray(rules)) {
      rules.forEach((rule) => this.removeRule(rule));
    }
    return this;
  }

  replaceRule(oldRule: string, newRule: string): this {
    this.$rules.replace(oldRule, newRule);
    return this;
  }

  setValue(value: InputValueType): this {
    this.value = value;
    return this;
  }

  setType(type: string): this {
    this._type = type as InputType;
    return this;
  }

  beforeRunRule(rule: string, callback: InputCallback<InputInterface>): this {
    this.rules.addHook(`before.${rule}.run`, callback);
    return this;
  }

  afterRunRule(rule: string, callback: InputCallback<InputInterface>): this {
    this.rules.addHook(`after.${rule}.run`, callback);
    return this;
  }

  onRuleFails(
    rule: RuleOptions,
    callback: InputCallback<InputInterface>,
  ): this {
    this.rules.addHook(`after.${rule}.fails`, callback);
    return this;
  }

  onRulePasses(
    rule: RuleOptions,
    callback: InputCallback<InputInterface>,
  ): this {
    this.rules.addHook(`after.${rule}.passes`, callback);
    return this;
  }

  failsOnfirst(boolean: boolean = true): this {
    this.validator.failsOnFirst = boolean;
    return this;
  }

  pushRule(rule: {
    rule: string;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack;
    local?: string;
  }): this {
    this.appendRule(rule);
    return this;
  }

  hasRule(rule: string): boolean {
    return this.rules.has(rule);
  }

  appendRule(rule: {
    rule: string;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack;
    local?: string;
  }): this {
    this.rules.append(
      rule.rule,
      rule.message,
      rule.param,
      rule.validate,
      rule.local,
    );
    return this;
  }

  prependRule(rule: {
    rule: string;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack;
    local?: string;
  }): this {
    this.$rules.prepend(
      rule.rule,
      rule.message,
      rule.param,
      rule.validate,
      rule.local,
    );
    return this;
  }

  private addHook(hook: Hooks, callback: InputCallback<InputInterface>): void {
    if (!this.hooks[hook]) {
      this.hooks[hook] = [];
    }
    this.hooks[hook].push(callback);
  }

  private executeHooks(hook: Hooks): void {
    const callbacks = this.hooks[hook];
    if (callbacks) {
      callbacks.forEach((callback) => callback(this));
    }
  }
}
