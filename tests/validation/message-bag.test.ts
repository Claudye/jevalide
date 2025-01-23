import { RuleCallBack } from '../../src/contracts';
import { Local } from '../../src/locale/local';
import { Message } from '../../src/validation/bag';

describe('  Message', () => {
  let messageInstance: Message;
  let trLocal: Local;

  beforeEach(() => {
    trLocal = new Local();
    messageInstance = new Message(trLocal);
  });

  describe('Initialization', () => {
    it('should inherit default messages from   Bag', () => {
      const messages = messageInstance.all();
      expect(messages.required).toBeDefined();
      expect(messages.email).toBeDefined();
      expect(messages.maxlength).toBeDefined();
      expect(messages.minlength).toBeDefined();
    });
  });

  describe('add', () => {
    it('should add a new message without locale', () => {
      messageInstance.add('customRule', 'Custom error message');
      expect(messageInstance.get('customRule')).toBe('Custom error message');
    });

    it('should add a new message with locale', () => {
      messageInstance.add('customRule', 'Custom error message', 'en');
      expect(messageInstance.get('customRule', 'en')).toBe(
        'Custom error message',
      );
    });

    it('should override existing message', () => {
      messageInstance.add('customRule', 'Initial message');
      expect(messageInstance.get('customRule')).toBe('Initial message');

      messageInstance.add('customRule', 'Updated message');
      expect(messageInstance.get('customRule')).toBe('Updated message');
    });

    it('should handle messages for different locales', () => {
      messageInstance.add('customRule', 'English message', 'en');

      expect(messageInstance.get('customRule', 'en')).toBe('English message');
      messageInstance.add('customRule', 'French message', 'fr');

      expect(messageInstance.get('customRule', 'fr')).toBe('French message');
    });
  });

  describe('get', () => {
    it('should retrieve existing message without locale', () => {
      messageInstance.add('customRule', 'Test message');
      expect(messageInstance.get('customRule')).toBe('Test message');
    });

    it('should retrieve existing message with locale', () => {
      messageInstance.add('customRule', 'Test message', 'en');
      expect(messageInstance.get('customRule', 'en')).toBe('Test message');
    });

    it('should return default message if locale-specific not found', () => {
      messageInstance.add('customRule', 'Default message');
      expect(messageInstance.get('customRule', 'nl')).toBe('Default message');
    });

    it('should retrieve default validation messages', () => {
      expect(messageInstance.get('required')).toBeDefined();
      expect(messageInstance.get('email')).toBeDefined();
    });
  });

  describe('all', () => {
    it('should return all messages without locale', () => {
      messageInstance.add('customRule1', 'Message 1');
      messageInstance.add('customRule2', 'Message 2');

      const messages = messageInstance.all();
      expect(messages.customRule1).toBe('Message 1');
      expect(messages.customRule2).toBe('Message 2');
    });

    it('should return all messages for specific locale', () => {
      messageInstance.add('customRule1', 'Message 1 EN', 'en');
      messageInstance.add('customRule2', 'Message 2 EN', 'en');

      const messages = messageInstance.all('en');
      expect(messages.customRule1).toBe('Message 1 EN');
      expect(messages.customRule2).toBe('Message 2 EN');
    });

    it('should include both default and custom messages', () => {
      messageInstance.add('customRule', 'Custom message');

      const messages = messageInstance.all();
      expect(messages.required).toBeDefined();
      expect(messages.email).toBeDefined();
      expect(messages.customRule).toBe('Custom message');
    });
  });

  describe('Integration with Rules', () => {
    it('should work with custom validation rules', () => {
      const customRule: RuleCallBack = (value) => ({
        passes: value === 'valid',
        value,
      });

      // Add both rule and message
      messageInstance.addRule('customRule', customRule);
      messageInstance.add('customRule', 'Invalid input');

      // Verify rule exists and message is set
      expect(messageInstance.hasRule('customRule')).toBe(true);
      expect(messageInstance.get('customRule')).toBe('Invalid input');
    });
  });
});
