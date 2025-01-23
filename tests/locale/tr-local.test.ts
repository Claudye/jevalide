import { isSubObject } from '../../src/utils';
import { Local } from '../../src/locale/local';

describe('  Local', () => {
  let trLocal: Local;

  beforeEach(() => {
    // Create a new instance before each test
    trLocal = new Local();
    // Reset the messages to the default state before each test
    trLocal.putMessages({
      required: 'This field is required.',
      email: 'Please enter a valid email address.',
      maxLength: 'The maximum length is {length} characters.',
      default: 'The field is invalid.',
    });
  });

  describe('getRuleMessage', () => {
    it('should return the message for the specified rule and language', () => {
      const message = trLocal.getRuleMessage('required', 'en');
      expect(message).toBe('This field is required.');
    });

    it('should return the default message if the rule message is not found', () => {
      const message = trLocal.getRuleMessage('unknownRule', 'en');
      expect(message).toBe('The field is invalid.');
    });

    it('should return the message for the default language if no language is specified', () => {
      const message = trLocal.getRuleMessage('required');
      expect(message).toBe('This field is required.');
    });
  });

  describe('addMessage', () => {
    it('should add a new message for the specified rule and language', () => {
      trLocal.addMessage(
        'minlength',
        'The minimum length is {length} characters.',
        'en',
      );
      const subsMessage = trLocal.getRuleMessage('minlength', 'en');
      expect(subsMessage).toEqual('The minimum length is {length} characters.');
    });
  });

  describe('putMessages', () => {
    it('should update the messages object for the specified language', () => {
      const newMessages = {
        required: 'Field is required.',
        email: 'Enter a valid email address.',
      };
      trLocal.putMessages(newMessages, 'en');
      const messages = trLocal.getMessages('en');
      expect(isSubObject(newMessages, messages)).toEqual(true);
    });

    it('should update the messages object for the default language if no language is specified', () => {
      const newMessages = {
        required: 'Field is required.',
        email: 'Enter a valid email address.',
      };
      trLocal.putMessages(newMessages);
      const messages = trLocal.getMessages('en');
      expect(isSubObject(newMessages, messages)).toEqual(true);
    });
  });

  describe('translate', () => {
    it('should translate the messages into the specified language', () => {
      const translatedMessages = {
        required: 'Champ requis.',
        email: 'Veuillez saisir une adresse e-mail valide.',
        maxLength: 'La longueur maximale est de {length} caractères.',
      };
      trLocal.translate('fr', translatedMessages);
      const messages = trLocal.getMessages('fr');
      expect(isSubObject(translatedMessages, messages)).toEqual(true);
    });
  });

  describe('rewrite', () => {
    it('should rewrite the message for the specified rule and language', () => {
      trLocal.rewrite('en', 'required', 'Please fill out this field.');
      const message = trLocal.getRuleMessage('required', 'en');
      expect(message).toBe('Please fill out this field.');
    });
  });

  describe('rewriteMany', () => {
    it('should rewrite multiple messages for the specified language', () => {
      const rules = ['required', 'email', 'maxlength'];
      const messages = [
        'Champ requis.',
        'Veuillez saisir une adresse e-mail valide.',
        'Longueur maximale : {length} caractères.',
      ];
      trLocal.rewriteMany('fr', rules, messages);
      const frMessages = trLocal.getMessages('fr');
      const messagesObject = {
        required: 'Champ requis.',
        email: 'Veuillez saisir une adresse e-mail valide.',
        maxlength: 'Longueur maximale : {length} caractères.',
      };
      expect(isSubObject(messagesObject, frMessages)).toBe(true);
    });

    it("should throw an error if the 'lang' argument is not a string", () => {
      expect(() => {
        trLocal.rewriteMany(null as any, ['required'], ['Champ requis.']);
      }).toThrow(
        "The 'lang' argument must be a string with one or more characters",
      );
    });

    it("should throw an error if the 'rules' argument is not an array", () => {
      expect(() => {
        trLocal.rewriteMany('fr', 'required' as any, ['Champ requis.']);
      }).toThrow("The 'rules' and 'messages' arguments must be arrays");
    });

    it("should throw an error if the 'messages' argument is not an array", () => {
      expect(() => {
        trLocal.rewriteMany('fr', ['required'], 'Champ requis.' as any);
      }).toThrow("The 'rules' and 'messages' arguments must be arrays");
    });

    it("should throw an error if the 'rules' and 'messages' arrays have different lengths", () => {
      expect(() => {
        trLocal.rewriteMany('fr', ['required', 'email'], ['Champ requis.']);
      }).toThrow("The 'rules' and 'messages' arrays must have the same length");
    });
  });

  describe('local', () => {
    it('should set the current translation language', () => {
      trLocal.local('fr');
      const currentLanguage = trLocal.getLocal();
      expect(currentLanguage).toBe('fr');
    });

    it('should throw an error if the language is not a valid string', () => {
      expect(() => {
        trLocal.local('');
      }).toThrow('The language must be a valid string');
    });
  });

  // Test isolement des instances
  describe('instance isolation', () => {
    it('should maintain separate message states for different instances', () => {
      const trLocal1 = new Local();
      const trLocal2 = new Local();

      // Modify first instance
      trLocal1.putMessages({
        required: 'Custom required message 1',
      });

      // Modify second instance
      trLocal2.putMessages({
        required: 'Custom required message 2',
      });

      // Check that messages are isolated
      expect(trLocal1.getRuleMessage('required')).toBe(
        'Custom required message 1',
      );
      expect(trLocal2.getRuleMessage('required')).toBe(
        'Custom required message 2',
      );
    });

    it('should maintain separate language settings for different instances', () => {
      const trLocal1 = new Local();
      const trLocal2 = new Local();

      trLocal1.local('fr');
      trLocal2.local('es');

      expect(trLocal1.getLocal()).toBe('fr');
      expect(trLocal2.getLocal()).toBe('es');
    });
  });
});
