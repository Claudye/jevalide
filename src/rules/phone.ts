import { RuleCallBack } from '../contracts';
import { CountryPhoneValidator } from './phone/country-phone-validator';

/**
 * This is a callback function that validates phone number formats for different countries.
 *
 * @param input The phone number to validate
 * @param params Optional country codes to validate against
 * @description
 * ```md
 *  required|phone:US,FR,BJ
 *  required|phone
 * ```
 */
export const phone: RuleCallBack = (input, params) => {
  if (typeof input !== 'string') {
    return {
      passes: false,
      value: input,
    };
  }
  return {
    passes: new CountryPhoneValidator(
      input,
      params?.toString(),
    ).validPhoneNumber(),
    value: input,
  };
};
