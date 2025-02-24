import { Local } from '../../src/locale/local';
import { Messages } from '../../src/messages';

describe('  Messages', () => {
  const locale = new Local();
  it('should get messages for valid rules', () => {
    const messages = new Messages(locale.getMessages()).getRulesMessages([
      'required',
      'email',
    ]);
    expect(messages).toEqual([
      'This field is required',
      'Please enter a valid email address',
    ]);
  });

  it('should get default message for invalid rules', () => {
    const messages = new Messages(locale.getMessages()).getRulesMessages([
      'unknown' as any,
    ]);
    expect(messages).toEqual(['The input value is not valid']);
  });

  it('should parse message correctly', () => {
    const message = 'The :field field must be less than or equal to :arg0';
    const parsedMessage = Messages.parseMessage('age', 'max', message, '18');
    expect(parsedMessage).toEqual(
      'The age field must be less than or equal to 18',
    );
  });

  it('should parse message correctly', () => {
    const message = 'The :field field must be between in :arg0 and :arg1';
    const parsedMessage = Messages.parseMessage(
      'age',
      'between',
      message,
      '18,30',
    );
    expect(parsedMessage).toEqual('The age field must be between in 18 and 30');
  });

  it('should parse...args message correctly', () => {
    const message = 'The :field field must be one of ...arg';
    const parsedMessage = Messages.parseMessage(
      'age',
      'between',
      message,
      '18,30',
    );
    expect(parsedMessage).toEqual('The age field must be one of 18, 30');
  });
});
