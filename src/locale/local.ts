import { Rule, RulesMessages } from '../contracts';
import { en_messages } from './lang/en';
import { is_string } from '../rules';
import { fr_messages } from './lang/fr';

export class Local {
  private _useLang: string | null = null;
  private _message: Record<string, RulesMessages>;
  private readonly DEFAULT_LANG = 'en';
  public LANG: string;

  constructor() {
    this.LANG = this.DEFAULT_LANG;
    this._message = {
      en: en_messages,
      fr: fr_messages,
    };
  }

  getMessages(local?: string) {
    local = local ?? this._useLang ?? this.LANG;
    let messages = this._message[local];
    if (!messages) {
      messages = this._message[this.DEFAULT_LANG];
    }
    return messages;
  }

  getRuleMessage(rule: string, local?: string) {
    const messages: Record<string, string> = this.getMessages(local);
    return messages[rule] ?? messages['default'];
  }

  addMessage(rule: string, message?: string, local?: string) {
    if (message) {
      const messages = this.getMessages(local);
      messages[rule] = message;
      this.putMessages(messages, local);
    }
  }

  putMessages(messages: RulesMessages, local?: string) {
    if (!messages || Object.keys(messages).length === 0) {
      throw new Error("The 'messages' argument must be a non-empty object");
    }

    local = local ?? this.DEFAULT_LANG;
    const existingMessages = this._message[local] || {};
    const mergedMessages = { ...existingMessages, ...messages };
    this._message[local] = mergedMessages;
  }

  translate(lang: string, messages: RulesMessages) {
    if (typeof lang !== 'string' || !lang.length) {
      throw new Error(
        'The first argument must be a string with one or more characters',
      );
    }

    if (typeof messages !== 'object' || messages === undefined) {
      throw new Error(
        'The second argument must be a valid key/value pair object',
      );
    }

    this._message[lang] = { ...this.getMessages(lang), ...messages };
  }

  rewrite(lang: string, rule: string, message: string) {
    this.addMessage(rule, message, lang);
  }

  rewriteMany(lang: string, rules: string[] | Rule[], messages: string[]) {
    if (typeof lang !== 'string' || !lang.length) {
      throw new Error(
        "The 'lang' argument must be a string with one or more characters",
      );
    }

    if (!Array.isArray(rules) || !Array.isArray(messages)) {
      throw new Error("The 'rules' and 'messages' arguments must be arrays");
    }

    if (rules.length !== messages.length) {
      throw new Error(
        "The 'rules' and 'messages' arrays must have the same length",
      );
    }

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const message = messages[i];
      this.rewrite(lang, rule, message);
    }
  }

  local(lang: string) {
    if (!is_string(lang) || !lang.length) {
      throw new Error('The language must be a valid string');
    }
    this._useLang = lang;
  }

  getLocal() {
    return this._useLang ?? this.LANG;
  }
}
