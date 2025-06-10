import { Validator } from '../helpers/validator';

export class AbstractEvent<TEvent extends object> extends Validator<TEvent> {}
