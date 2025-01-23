import { FormValidator } from '../../src/validation';
import { Jevalide } from '../../src/validation/jevalide';
interface FormData {
  name: string;
  email: string;
  profile: {
    google: string;
  };
}

describe('FormValidator', () => {
  let formValidator: FormValidator<FormData>;
  const { form, input: inputValidator } = Jevalide.init();
  const data = {
    name: '',
    email: 'test@example.com',
    profile: {
      google: 'https://www.google.com',
    },
  };
  beforeEach(() => {
    formValidator = form(
      {
        name: 'required',
        'profile.google': 'required',
      },
      data,
    );
  });

  describe('Input Management', () => {
    describe('addInput', () => {
      it('should add a new input validator', () => {
        formValidator.addInput(
          inputValidator({
            name: 'email',
            rules: 'required|email',
          }),
        );
        expect(formValidator.has('email')).toBe(true);
      });

      it('should replace existing input with same name', () => {
        formValidator.addInput(
          inputValidator({
            name: 'name',
            rules: 'required|min:3',
          }),
        );
        const input = formValidator.get('name');
        expect(input?.$rules.has('min')).toBe(true);
      });
    });

    describe('has', () => {
      it('should return true for existing input', () => {
        expect(formValidator.has('name')).toBe(true);
      });

      it('should return false for non-existing input', () => {
        expect(formValidator.has('nonexistent')).toBe(false);
      });
    });
  });

  describe('Data Management', () => {
    describe('getData/setData', () => {
      it('should return initial data object', () => {
        expect(formValidator.getData()).toEqual(data);
      });

      it('should update data object', () => {
        const newData: FormData = {
          name: 'John Doe',
          email: 'john@example.com',
          profile: { google: 'https://www.google.com' },
        };
        formValidator.setData(newData);
        expect(formValidator.getData()).toEqual(newData);
      });
    });
  });

  describe('Validation', () => {
    describe('isValid', () => {
      it('should return true for valid data', () => {
        formValidator.mergeData({
          name: 'John Doe',
          email: 'test@example.com',
        });
        expect(formValidator.isValid()).toBe(true);
      });

      it('should return false for invalid data', () => {
        formValidator.mergeData({
          name: '',
          email: 'test@example.com',
        });
        expect(formValidator.isValid()).toBe(false);
      });

      it('should validate nested object paths', () => {
        const nestedValidator = form(
          {
            'user.name': { rules: 'required' },
            'user.profile.age': { rules: 'required|number|min:18' },
          },
          {
            user: {
              name: 'John',
              profile: { age: 25 },
            },
          },
        );
        expect(nestedValidator.isValid()).toBe(true);
      });
    });

    describe('validation events', () => {
      let passesCallback: jest.Mock;
      let failsCallback: jest.Mock;

      beforeEach(() => {
        passesCallback = jest.fn();
        failsCallback = jest.fn();
        formValidator.onPasses(passesCallback);
        formValidator.onFails(failsCallback);
      });

      it('should trigger onPasses callback when validation passes', () => {
        formValidator.mergeData({ name: 'John Doe' });
        formValidator.isValid();

        expect(passesCallback).toHaveBeenCalledTimes(1);
        expect(failsCallback).not.toHaveBeenCalled();
      });

      it('should trigger onFails callback when validation fails', () => {
        formValidator.mergeData({ name: '' });
        formValidator.isValid();

        expect(failsCallback).toHaveBeenCalledTimes(1);
        expect(passesCallback).not.toHaveBeenCalled();
      });
    });
    describe('with', () => {
      it('should apply external validation rule', () => {
        formValidator.with((form) => {
          return form.getData().email === 'test@example.com';
        });
        expect(formValidator.isValid()).toBe(false); //

        formValidator.mergeData({ name: 'John' });
        expect(formValidator.isValid()).toBe(true);
      });

      it('should support multiple external validation rules', () => {
        formValidator.mergeData({ name: 'Jo' });
        formValidator
          .with((form) => {
            return form.getData().email.includes('@');
          })
          .with((form) => {
            return form.getData().name != 'Jo';
          });

        expect(formValidator.isValid()).toBe(false); // name trop court

        formValidator.mergeData({ name: 'John' });
        expect(formValidator.isValid()).toBe(true);
      });

      it('should pass when no external rules are added', () => {
        formValidator.mergeData({ name: 'John' });
        expect(formValidator.isValid()).toBe(true);
      });
    });
  });
});
