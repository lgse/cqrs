import 'reflect-metadata';

import type { ValidationError } from 'class-validator';

import { validateSync } from 'class-validator';

import type { NonFunctionPropertyNames, PublicProperties } from '../types';

import { RESULT_TYPE_SYMBOL } from './constants';

export class Query<_TQuery extends object, TResult = any> {
  readonly [RESULT_TYPE_SYMBOL]: TResult;

  /**
   * @deprecated Use `create` method instead.
   */
  public constructor() {}

  public static create<TQuery extends Query<any, any>>(
    this: new () => TQuery,
    ...args: NonFunctionPropertyNames<Omit<TQuery, typeof RESULT_TYPE_SYMBOL>> extends never
      ? []
      : [props: Omit<PublicProperties<TQuery>, typeof RESULT_TYPE_SYMBOL>]
  ): TQuery {
    const query = new this();

    if (args.length > 0) {
      Object.assign(query, args[0]);
    }

    return query;
  }
}

export class ValidatedQuery<TQuery extends object, TResult = any> extends Query<
  TQuery,
  TResult
> {
  readonly [RESULT_TYPE_SYMBOL]: TResult;

  public static create<TQuery extends ValidatedQuery<any, any>>(
    this: new () => TQuery,
    ...args: NonFunctionPropertyNames<Omit<TQuery, typeof RESULT_TYPE_SYMBOL>> extends never
      ? []
      : [props: Omit<PublicProperties<TQuery>, typeof RESULT_TYPE_SYMBOL>]
  ): TQuery {
    const query = new this();

    if (args.length > 0) {
      Object.assign(query, args[0]);
    }

    const errors = validateSync(query, { forbidUnknownValues: false });
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error: ValidationError) => {
          if (error.constraints) {
            return Object.values(error.constraints).join(', ');
          }

          return `Validation failed for property: ${error.property}`;
        })
        .join('\n');

      throw new Error(
        `Failed to instantiate ${this.constructor.name}:\n${errorMessages}`,
        {
          cause: errors,
        },
      );
    }

    return query;
  }
}
