import { Jevalide } from '../src/validation/jevalide';
import { RuleCallBack } from '../src/contracts';

describe('Jevalide', () => {
  let validator: Jevalide;

  beforeEach(() => {
    // Reset the singleton instance before each test
    (Jevalide as any).instance = undefined;
    validator = Jevalide.init();
  });

  describe('Singleton Pattern', () => {
    it('should always return the same instance', () => {
      const instance1 = Jevalide.init();
      const instance2 = Jevalide.init();
      expect(instance1).toBe(instance2);
    });

    it('should maintain state between calls', () => {
      const instance1 = Jevalide.init();
      instance1.setLocale('fr');

      const instance2 = Jevalide.init();
      expect(instance2.getLocale()).toBe('en');
    });
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      expect(validator.getLocale()).toBe('en');
      expect(validator.hasRule('required')).toBe(true);
      expect(validator.hasRule('email')).toBe(true);
    });

    it('should initialize with custom rules', () => {
      const customRule: RuleCallBack = (value) => ({
        passes: true,
        value,
      });

      const instance = Jevalide.init({
        rules: {
          customRule,
        },
      });

      expect(instance.hasRule('customRule')).toBe(true);
      const rule = instance.getRule('customRule');
      expect(rule('test').passes).toBe(true);
    });

    it('should initialize with custom messages', () => {
      const instance = Jevalide.init({
        messages: {
          required: 'Custom required message',
        },
      });

      expect(instance.getMessage('required')).toBe('Custom required message');
    });

    it('should initialize with custom locale', () => {
      const instance = Jevalide.init({
        local: 'fr',
      });

      expect(instance.getLocale()).toBe('fr');
    });

    it('should initialize with combined params', () => {
      const customRule: RuleCallBack = (value) => ({
        passes: true,
        value,
      });

      const instance = Jevalide.init({
        rules: {
          customRule,
        },
        messages: {
          customRule: 'Custom message',
        },
        local: 'fr',
      });

      expect(instance.hasRule('customRule')).toBe(true);
      expect(instance.getMessage('customRule', 'fr')).toBe('Custom message');
      expect(instance.getLocale()).toBe('fr');
    });
  });

  describe('Rule Management', () => {
    it('should add and verify single rule', () => {
      const customRule: RuleCallBack = (value) => ({
        passes: true,
        value,
      });

      validator.rule('customRule', customRule);
      expect(validator.hasRule('customRule')).toBe(true);
    });

    it('should add multiple rules using setRules', () => {
      const rules = {
        rule1: (value: any) => ({ passes: true, value }),
        rule2: (value: any) => ({ passes: false, value }),
      };

      validator.setRules(rules);
      expect(validator.hasRule('rule1')).toBe(true);
      expect(validator.hasRule('rule2')).toBe(true);
    });

    it('should throw error for invalid rule callback', () => {
      expect(() => {
        validator.setRules({
          invalidRule: 'not a function' as any,
        });
      }).toThrow();
    });
  });

  describe('Message Management', () => {
    it('should add and retrieve single message', () => {
      validator.message('testRule', 'Test message');
      expect(validator.getMessage('testRule')).toBe('Test message');
    });

    it('should add and retrieve localized message', () => {
      validator.message('testRule', 'Message en français', 'fr');
      expect(validator.getMessage('testRule', 'fr')).toBe(
        'Message en français',
      );
    });

    it('should add multiple messages using setMessages', () => {
      const messages = {
        rule1: 'Message 1',
        rule2: 'Message 2',
      };

      validator.setMessages(messages);
      expect(validator.getMessage('rule1')).toBe('Message 1');
      expect(validator.getMessage('rule2')).toBe('Message 2');
    });

    it('should handle messages with locale', () => {
      validator.setMessages(
        {
          rule1: 'Message FR',
          rule2: 'Message2 FR',
        },
        'fr',
      );

      expect(validator.getMessage('rule1', 'fr')).toBe('Message FR');
      expect(validator.getMessage('rule2', 'fr')).toBe('Message2 FR');
    });
  });

  describe('Locale Management', () => {
    it('should set and get locale', () => {
      validator.setLocale('fr');
      expect(validator.getLocale()).toBe('fr');
    });

    it('should handle translations', () => {
      validator.translate('fr', {
        email: 'Email invalide',
      });

      validator.setLocale('fr');
      expect(validator.getMessage('required')).toBe('Ce champ est obligatoire');
      expect(validator.getMessage('email')).toBe('Email invalide');
    });
  });

  describe('Rule Execution', () => {
    it('should execute validation rule', () => {
      const result = validator.run('required', '');
      expect(result.passes).toBe(false);
    });

    it('should execute custom rule', () => {
      const customRule: RuleCallBack = (value) => ({
        passes: value === 'valid',
        value,
      });

      validator.rule('customRule', customRule);
      const result = validator.run('customRule', 'valid');
      expect(result.passes).toBe(true);
    });
  });
});

describe('Static Validate Method', () => {
  beforeEach(() => {
    (Jevalide as any).instance = undefined;
    Jevalide.init();
  });

  it('should create and return a form validator instance', () => {
    const data = {
      email: 'test@example.com',
      name: 'John Doe',
    };

    const inputs = {
      email: {
        rules: ['required', 'email'],
      },
      name: {
        rules: ['required'],
      },
    };

    const validator = Jevalide.validate(data, inputs);
    expect(validator).toBeDefined();
    expect(validator.valid).toBeDefined();
    expect(validator.isValid()).toBe(true);
  });

  it('should validate with config options', () => {
    const data = {
      email: 'test@example.com',
    };

    const inputs = {
      email: {
        rules: ['required', 'email'],
      },
    };

    const config = {
      name: 'testForm',
      bail: true,
    };

    const validator = Jevalide.validate(data, inputs, config);
    expect(validator).toBeDefined();
    expect(validator.isValid()).toBe(true);
  });

  it('should fail validation with invalid data', () => {
    const data = {
      email: 'invalid-email',
    };

    const inputs = {
      email: {
        rules: ['required', 'email'],
      },
    };

    const validator = Jevalide.validate(data, inputs);
    expect(validator.isValid()).toBe(false);
    expect(validator.has('email')).toBe(true);
  });

  it('should validate using custom rules', () => {
    // Add a custom rule first
    Jevalide.init({
      rules: {
        customRule: (value) => ({
          passes: value === 'valid',
          value,
        }),
      },
    });

    const data = {
      field: 'valid',
    };

    const inputs = {
      field: {
        rules: ['customRule'],
      },
    };

    const validator = Jevalide.validate(data, inputs);
    expect(validator.isValid()).toBe(true);
  });
});
