import { Validator } from '../helpers/validator';
import { RESULT_TYPE_SYMBOL } from './constants';

export class AbstractQuery<TResult = any> extends Validator<
  AbstractQuery<TResult>
> {
  readonly [RESULT_TYPE_SYMBOL]: TResult;
}
