import type { PublicProperties } from '../types';

import { Validator } from '../helpers/validator';
import { RESULT_TYPE_SYMBOL } from './constants';

export class Query<TQuery extends object, TResult = any> {
  readonly [RESULT_TYPE_SYMBOL]: TResult;

  public constructor(props?: PublicProperties<TQuery>) {
    Object.assign(this, props);
  }
}

export class ValidatedQuery<
  TQuery extends object,
  TResult = any,
> extends Validator<Omit<TQuery, typeof RESULT_TYPE_SYMBOL>> {
  readonly [RESULT_TYPE_SYMBOL]: TResult;
}
