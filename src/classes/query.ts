import type { IQuery } from '../interfaces';

import { RESULT_TYPE_SYMBOL } from './constants';

export class Query<TResult = any> implements IQuery {
  // @ts-expect-error this property has no initializer, and it is used so we can infer the result type
  readonly [RESULT_TYPE_SYMBOL]: TResult;
}
