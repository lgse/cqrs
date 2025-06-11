import { Validator } from '../helpers/validator';
import { RESULT_TYPE_SYMBOL } from './constants';

export class AbstractQuery<
  TQuery extends object,
  TResult = any,
> extends Validator<Omit<TQuery, typeof RESULT_TYPE_SYMBOL>> {
  readonly [RESULT_TYPE_SYMBOL]: TResult;
}
