import { Bag, Validation } from '.';
import { InputValueType, InputType, InputParms, RuleNamed } from '../contracts';
import { InputRule } from './utils/input-rule';
import { TrParameter } from './utils/parameter';

export abstract class AbstractInputralidator {
  protected __wasInit = false;

  protected _passed = false;

  protected validator!: Validation;

  protected rules!: InputRule;

  protected _errors: string[] = [];

  protected param: InputParms = {
    autoValidate: true,
    type: 'text',
  };

  protected parameter: TrParameter;

  protected _value: InputValueType = undefined;

  protected _type: InputType = 'text';

  constructor(
    protected readonly _bag: Bag,
    params?: InputParms,
    parameter?: TrParameter,
  ) {
    this.validator = new Validation(this._bag.trLocal);
    this.rules = new InputRule(this._bag, []);
    this.parameter = parameter ?? new TrParameter();
    this._init(params);
  }

  setRules(rules: RuleNamed) {
    this.$rules.set(rules);
    return this;
  }

  abstract validate(): boolean;

  get name() {
    return this.param.name ?? '';
  }
  get value() {
    return this.getValue();
  }
  set value(value) {
    this._value = value;
    this.validate();
  }

  getName() {
    return this.name;
  }

  get errors() {
    return this.validator.getErrors();
  }

  getValue() {
    return this._value;
  }

  setParams(param?: InputParms) {
    if (typeof param === 'object' && typeof param !== 'undefined') {
      this.param = { ...this.param, ...param };
    }
    return this;
  }

  setMessageAttributeName(attrName?: string): this {
    this.validator.attribute = attrName ?? this.name;
    return this;
  }

  private _init(params?: InputParms) {
    this.setParams(params).setMessageAttributeName();

    const rules: RuleNamed | undefined = params?.rules;
    if (rules) {
      this.rules.set(rules, this.param.messages);
    }

    this.validator.rules = this.rules;
    this.validator.failsOnFirst = params?.failsOnfirst ?? true;
    this._type = (params?.type ?? 'text') as InputType;
  }

  getMessageAttributeName() {
    return this.validator.attribute;
  }

  get messages() {
    return this.rules.getMessages();
  }

  protected eventToArray(value?: string | string[]) {
    let values: string[] = [];
    if (typeof value !== 'string') {
      if (!Array.isArray(value)) {
        return [];
      }
      values = value;
    }
    if (typeof value === 'string') {
      values = value.split('|');
    }
    return values.map((t: string) => t.trim());
  }

  get $rules() {
    return this.rules;
  }
}
