import { Rule, RuleParam, RulesMessages } from '../contracts';

import { spliteParam } from '../utils';

export class Messages {
  constructor(protected messages: RulesMessages) {}

  getRulesMessages(rules: Rule[]): string[] {
    const messages: string[] = [];

    for (const rule of rules) {
      if (this.messages[rule]) {
        messages.push(this.messages[rule]);
      } else {
        messages.push('The input value is not valid');
      }
    }

    return messages;
  }

  static parseMessage(
    attribute: string,
    rule: Rule,
    message: string,
    oParams: RuleParam,
  ): string {
    const args = Messages._createParamObject(
      spliteParam(oParams?.toString() ?? ''),
    );

    args['field'] = attribute;
    message = Messages._replace(message, args);

    return message;
  }
  /**
   *
   * @param messages
   * @returns
   */
  setMessages(messages: RulesMessages) {
    this.messages = { ...this.messages, ...messages };
    return this;
  }

  static _replace(message: string, replacements: Record<string, RuleParam>) {
    for (const positionalAgrName in replacements) {
      if (
        Object.prototype.hasOwnProperty.call(replacements, positionalAgrName)
      ) {
        const argValue = replacements[positionalAgrName];
        if (argValue) {
          message = message.replace(
            `:${positionalAgrName}`,
            argValue.toString(),
          );
        }
      }
    }
    // Remove the field from the replacements before inject them
    delete replacements['field'];
    return message.replace(/\.\.\.arg/, Object.values(replacements).join(', '));
  }

  static _createParamObject(params: RuleParam[]) {
    const args: Record<string, RuleParam> = {};
    for (let i = 0; i < params.length; i++) {
      const value = params[i];
      const argName = `arg${i}`;
      args[argName] = value;
    }
    return args;
  }
}
