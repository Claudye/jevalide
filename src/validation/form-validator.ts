import {
  FormConfig,
  FormHandler,
  InputParms,
  InputCallback,
  GroupHooks,
  MakeInput,
} from '../contracts';
import { data_get, transformToArray } from '../utils';
import { InputValidator } from './input-validator';
import { TrParameter } from './utils/parameter';
import { Bag } from './bag';

export class FormValidator<T = unknown> {
  private readonly _withCallbacks: ((form: FormValidator<T>) => boolean)[] = [];
  private _lifeCycleCallbacks: Record<string, FormHandler[]> = {};

  /***
   * Check that if passes event can be emitted
   */
  private _emitOnPasses = true;
  /***
   * Check that if passes event can be emitted
   */
  private _emitOnFails = true;

  /**
   * The inputs rules
   */
  private _inputs: InputValidator[] = [];

  /**
   * Tr Config object
   */
  protected config: FormConfig = {};

  parameter!: TrParameter;

  private _data = {} as T;

  private readonly wildcardPattern: { name: string; input: InputParms }[] = [];
  constructor(
    inputs: MakeInput,
    data: Partial<T>,
    private readonly _bag: Bag,
    config?: FormConfig,
  ) {
    this.parameter = new TrParameter();
    this.setConfig(config);
    this.make(inputs);
    this.mergeData(data);
  }

  setData(data: T) {
    this._data = data && typeof data === 'object' ? data : ({} as T);
    this.handleWildcards();
  }

  mergeData(data: Partial<T>) {
    this._data = { ...this._data, ...data };
    this.handleWildcards();
    return this;
  }

  getData(): T {
    return this._data;
  }
  /**
   * Retrieves the list of validated inputs.
   */
  validated(): InputValidator[] {
    return this._inputs.filter((t) => t.passes());
  }
  /**
   * Retrieves the list of failed inputs.
   */

  failed(): InputValidator[] {
    return this._inputs.filter((t) => t.fails());
  }

  /**
   * Validate each input and check if the form is valid.
   * @returns A boolean indicating whether the form is valid after validating each input.
   */
  isValid() {
    this.each((input) => {
      const value = data_get(this._data as object, input.getName());
      input.setValue(value);
      return input;
    });
    const valid = this.every((input) => {
      return input.valid();
    });

    const withCallbacksValid = this._withCallbacks.every((callback) =>
      callback(this),
    );

    if (valid && withCallbacksValid) {
      this._emitOnPassesEvent();
    } else {
      this._emitOnFailsEvent();
    }

    return valid && withCallbacksValid;
  }

  protected setConfig(config?: FormConfig) {
    let lang = 'en';
    if (config && typeof config === 'object') {
      this.config = { ...this.config, ...config };
      if (config.local) {
        const local = config.local;
        if (local.lang) {
          lang = local.lang;
        }
      }
    }

    if (this.config.local) {
      this.config.local.lang = lang;
    }

    this._addLifeCycleCallback('form.validated', () => {});
  }

  /**
   * Attach a callback that to be executed when the validation passes.
   *
   */
  on(e: GroupHooks, fn: FormHandler): void {
    this._addEvents(e, fn);
  }

  /**
   * Attaches a callback  that will be executed when the validation fails occurs.
   * Example:
   * ```typescript
   * formValidator.onFails((formValidator) => {
   *   console.log("Form validation failed", formValidator);
   * });
   * ```
   */
  onFails(fn: FormHandler): void {
    this.on('form.fails', fn);
  }

  /**
   * Attaches an event listener to the "tr.form.passes" event.
   * This event is triggered when the form passes validation.
   * @param fn - The callback function to execute when the event occurs.
   * Example:
   * ```typescript
   * formValidator.onPasses((formValidator) => {
   *   console.log("Form validation passed", formValidator);
   * });
   * ```
   */
  onPasses(fn: FormHandler): void {
    this.on('form.passes', fn);
  }

  /**
   * Attaches an event listener to the "tr.form.validate" event.
   * This event is triggered when the form is validated.
   * @param fn - The callback function to execute when the event occurs.
   * Example:
   * ```typescript
   * formValidator.onValidate((formValidator) => {
   *   console.log("Form validation executed", formValidator);
   * });
   * ```
   */
  onValidate(fn: FormHandler): void {
    this.on('form.validated', fn);
  }

  /**
   * Invokes the provided function with the given parameters if it is a valid function.
   * @param fn - The function to be called.
   * @param params - The parameters to be passed to the function.
   */
  private __call(fn?: CallableFunction, ...params: unknown[]) {
    if (typeof fn == 'function') {
      fn(...params);
    }
  }

  /**
   * Destroys the FormValidator instance and performs any necessary cleanup.
   * This method removes event handlers, destroys InputValidator instances,
   * and clears the internal array of InputValidator instances.
   *
   * Example:
   * ```typescript
   * const formValidator = new FormValidator({});
   *
   * formValidator.destroy();
   * ```
   */
  destroy(): void {
    this.destroyInputs();
    this._inputs = [];
  }

  /**
   * Emits the "tr.form.fails" event if the form fails validation.
   * This method is called when the form is considered invalid, meaning at least one input fails validation.
   */
  private _emitOnFailsEvent() {
    //If tr.form.fails
    if (this._emitOnFails) {
      this._executeLifeCycleCallbacks('form.fails');
      this._emitOnFails = false;
      //Open _emitOnPasses, for the next tr.form.passes event
      this._emitOnPasses = true;
    }
  }
  /**
   * Emits the "tr.form.passes" event if the form passes validation.
   * This method is called when the form is considered valid, meaning all inputs pass validation.
   */
  private _emitOnPassesEvent() {
    //If form.passes
    if (this._emitOnPasses) {
      this._executeLifeCycleCallbacks('form.passes');
      this._emitOnPasses = false;
      //Open _emitOnFails, for the next form.fails event
      this._emitOnFails = true;
    }
  }

  private destroyInputs() {
    this.each((inputInstance) => {
      inputInstance.destroy();
    });
  }
  /**
   * Iterate over each InputValidator in the form and execute a callback function.
   * @param call The callback function to be executed for each InputValidator.
   */
  each(call: InputCallback<InputValidator>) {
    this._inputs.forEach(call);
  }
  /**
   * Retrieve a InputValidator by name from the form.
   * @param name The name of the InputValidator to retrieve.
   * @returns The InputValidator corresponding to the name, or null if not found.
   */
  get(name: string): InputValidator | null {
    return this._inputs.find((i) => i.is(name)) ?? null;
  }
  /**
  
  /**
   * Adds a InputValidator to the form and performs necessary updates.
   * @param inputInstance The InputValidator instance to add to the form.
   * @remarks This method handles the addition of a InputValidator to the form, including setting feedback elements, updating form state based on input validation, and triggering callbacks.
   */
  addInput(inputInstance: InputValidator) {
    const oldInput = this.get(inputInstance.getName());
    if (oldInput) {
      oldInput.destroy();
    }
    this._inputs = this._inputs.filter(
      (input) => !input.is(inputInstance.getName()),
    );

    this._inputs.push(inputInstance);
    this.setValidity();
    return this;
  }
  /**
   * Validate an input with validation configurations.
   * @example
   * ```javascript
   *      const inputInstance = new InputValidator(formInstance.ageInput);
   *      formValidator.addInput(inputInstance);
   *      formValidator
   *        .make([
   *          {
   *            rules: 'required|between:18,40',
   *            selector: 'age', // The input name
   *          },
   *          {
   *            rules: 'required|date',
   *            selector: formInstance.birthDayInput,
   *          },
   *        ])
   *        .make({
   *          message: {
   *            rules: 'required|only:string',
   *          },
   *        });
   * ```
   * @param input An object containing InputParms or an array of InputParms.
   * @throws Error - If the provided input argument is not a valid object.
   * @returns This FormValidator instance to allow chaining method calls.
   */
  make(input: MakeInput) {
    if (typeof input != 'object' || input === null) {
      throw new Error('Invalid arguments passed to make method');
    }
    transformToArray(input, this._bootInputs.bind(this));
    return this;
  }
  /**
   * Set the validity state of the FormValidator.
   * @param boolean The boolean value indicating the validity state to set.
   * @remarks This method updates the internal validity state of the FormValidator based on the provided boolean value.
   * It increments the internal counter for the number of times this method is called.
   * If the validity state changes to true (passed), it triggers the '_emitOnPassesEvent' event.
   * If the validity state changes to false (failed), it triggers the '_emitOnFailsEvent' event.
   * Finally, it emits a 'tr.form.validate' event with the updated FormValidator instance.
   */
  private setValidity() {
    this.each((input) => {
      input.onValidate(() => {
        this._executeLifeCycleCallbacks('form.validated');
      });
    });
  }

  /**
   * Get the current validity state of the FormValidator.
   * @returns The boolean value representing the current validity state of the FormValidator.
   * @remarks This method retrieves and returns the current validity state of the FormValidator.
   */
  get valid() {
    return this.isValid();
  }
  /**
   * Retrieve all inputs from the form.
   * @returns An array of all inputs in the form.
   */
  all() {
    return this._inputs;
  }

  /**
   * Add a InputValidator based on the provided parameters.
   * @param params The parameters for creating the InputValidator.
   * @returns The result of creating the InputValidator.
   */
  add(params: InputParms) {
    return this.make([params]);
  }

  private _addEvents(string: string, call: FormHandler): void {
    this._addLifeCycleCallback(string, call);
  }

  private _bootInputs(
    param: InputParms | string | string[],
    indexOrName?: string | number,
  ) {
    let inputParam: InputParms;

    if (typeof param === 'string' || Array.isArray(param)) {
      inputParam = {
        name: indexOrName as string,
        rules: param,
      };
    } else {
      inputParam = param;
      if (typeof indexOrName === 'string' && !inputParam.name) {
        inputParam.name = indexOrName;
      }
    }

    if (indexOrName?.toString().includes('*')) {
      this.wildcardPattern.push({
        name: indexOrName.toString(),
        input: inputParam,
      });
      this.handleWildcards();
    } else {
      this.addInput(new InputValidator(this._bag, inputParam, this.parameter));
    }

    return inputParam;
  }

  private handleWildcards() {
    for (const wildcard of this.wildcardPattern) {
      const [name] = wildcard.name.split('.*');
      const data = data_get(this._data as object, name);
      if (typeof data === 'object' && data) {
        const keys = Object.keys(data);
        for (const key of keys) {
          wildcard.input.name = `${name}.${key}`;
          this.addInput(
            new InputValidator(this._bag, wildcard.input, this.parameter),
          );
        }
      }
    }
  }

  /**
   * Adds a lifecycle callback to the specified lifecycle event.
   * @param name - The name of the lifecycle event.
   * @param call - The callback function to be added.
   * @private
   */
  private _addLifeCycleCallback(name: string, call: FormHandler) {
    if (!this._lifeCycleCallbacks[name]) {
      this._lifeCycleCallbacks[name] = [call];
    } else {
      this._lifeCycleCallbacks[name].push(call);
    }
  }

  /**
   * Executes all the callbacks associated with the specified lifecycle event.
   * @param name - The name of the lifecycle event.
   * @private
   */
  private _executeLifeCycleCallbacks(name: string): void {
    const callbacks = this._lifeCycleCallbacks[name];
    if (callbacks) {
      transformToArray(callbacks, (fn) => {
        this.__call(fn, this);
      });
    }
  }

  map<T>(fn: (input: InputValidator) => T): T[] {
    return this._inputs.map(fn);
  }
  every<T>(fn: (input: InputValidator) => T): boolean {
    return this._inputs.every(fn);
  }

  has(name: string): boolean {
    return this._inputs.some((input) => input.is(name));
  }
  remove(name: string): this {
    const input = this.get(name);
    if (input) {
      input.destroy();
      this._inputs = this._inputs.filter((i) => !i.is(name));
    }
    return this;
  }
  reset(): this {
    this.each((input) => {
      input.setValue(undefined);
    });
    return this;
  }
  clear(): this {
    this.destroy();
    return this;
  }
  copy(): FormValidator<T> {
    const form = new FormValidator<T>([], this._data, this._bag, this.config);
    this._inputs.forEach((input) => {
      form.addInput(input);
    });
    return form;
  }
  with(callback: (form: FormValidator<T>) => boolean): this {
    this._withCallbacks.push(callback as (form: FormValidator<T>) => boolean);
    return this;
  }

  get errors(): Record<string, string | null | undefined> {
    const errors = {} as Record<string, string>;
    for (const input of this.failed()) {
      errors[input.getName()] = transformToArray(input.errors, (err) => err)[0];
    }
    return errors;
  }

  value(name: string, defaultValue?: unknown) {
    return this.get(name)?.value ?? defaultValue;
  }
}
