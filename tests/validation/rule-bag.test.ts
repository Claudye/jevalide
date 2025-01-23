import { RuleCallBack } from '../../src/contracts';
import { Local } from '../../src/locale/local';
import { RuleBag } from '../../src/validation/bag';

describe('  RuleBag', () => {
  let trRule: RuleBag;
  let trLocal: Local;

  beforeEach(() => {
    trLocal = new Local();
    trRule = new RuleBag(trLocal);
  });

  describe('Initialization', () => {
    it('should inherit default rules from   Bag', () => {
      const rules = trRule.all();
      expect(rules.required).toBeDefined();
      expect(rules.email).toBeDefined();
      expect(rules.maxlength).toBeDefined();
      expect(rules.minlength).toBeDefined();
      expect(rules.min).toBeDefined();
      expect(rules.max).toBeDefined();
    });
  });

  describe('add', () => {
    const customRule: RuleCallBack = (value) => ({
      passes: true,
      value,
    });

    it('should add a new rule', () => {
      trRule.add('myRule', customRule);
      expect(trRule.has('myRule')).toBe(true);
      expect(trRule.get('myRule')).toBe(customRule);
    });

    it('should override existing rule', () => {
      const initialRule: RuleCallBack = (value) => ({
        passes: false,
        value,
      });

      const newRule: RuleCallBack = (value) => ({
        passes: true,
        value,
      });

      // Add initial rule
      trRule.add('myRule', initialRule);
      expect(trRule.get('myRule')).toBe(initialRule);

      // Override with new rule
      trRule.add('myRule', newRule);
      expect(trRule.get('myRule')).toBe(newRule);
    });
  });

  describe('has', () => {
    it('should return true for existing rules', () => {
      const customRule: RuleCallBack = (value) => ({
        passes: true,
        value,
      });

      trRule.add('myRule', customRule);
      expect(trRule.has('myRule')).toBe(true);
      expect(trRule.has('required')).toBe(true); // default rule
    });

    it('should return false for non-existent rules', () => {
      expect(trRule.has('nonExistentRule')).toBe(false);
    });
  });

  describe('get', () => {
    const customRule: RuleCallBack = (value) => ({
      passes: true,
      value,
    });

    it('should retrieve existing rule', () => {
      trRule.add('myRule', customRule);
      const rule = trRule.get('myRule');
      expect(rule).toBe(customRule);
    });

    it('should return a rule that works correctly', () => {
      trRule.add('myRule', customRule);
      const rule = trRule.get('myRule');
      const result = rule('test');
      expect(result).toEqual({ passes: true, value: 'test' });
    });

    it('should return the default required rule', () => {
      const requiredRule = trRule.get('required');
      expect(requiredRule).toBeDefined();
      expect(requiredRule('')).toEqual({ passes: false, value: '' });
      expect(requiredRule('test')).toEqual({ passes: true, value: 'test' });
    });
  });

  describe('all', () => {
    it('should return all rules, including custom rules', () => {
      const customRule: RuleCallBack = (value) => ({
        passes: true,
        value,
      });

      trRule.add('myRule', customRule);
      const rules = trRule.all();

      // Check default rules
      expect(rules.required).toBeDefined();
      expect(rules.email).toBeDefined();

      // Check custom rule
      expect(rules.myRule).toBeDefined();
      expect(rules.myRule).toBe(customRule);
    });

    it('should return an object containing all rules', () => {
      const rules = trRule.all();
      const ruleNames = Object.keys(rules);

      expect(ruleNames).toContain('required');
      expect(ruleNames).toContain('email');
      expect(ruleNames).toContain('maxlength');
      expect(ruleNames).toContain('minlength');
      expect(typeof rules.required).toBe('function');
    });
  });

  describe('Instance Isolation', () => {
    it('should maintain separate rule sets between instances', () => {
      const trRule2 = new RuleBag(trLocal);

      const rule1: RuleCallBack = (value) => ({
        passes: true,
        value,
      });

      const rule2: RuleCallBack = (value) => ({
        passes: false,
        value,
      });

      trRule.add('myRule', rule1);
      trRule2.add('myRule', rule2);

      expect(trRule.get('myRule')).toBe(rule1);
      expect(trRule2.get('myRule')).toBe(rule2);
    });
  });
});
