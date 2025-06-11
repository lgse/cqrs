import type { Query, ValidatedQuery } from '../../classes';
import type { IQuery } from './query.interface.ts';

export interface IQueryBus<TQuery extends IQuery = any> {
  execute<TQuery extends object, TResult>(
    query: Query<TQuery, TResult>,
  ): Promise<TResult>;
  execute<TQuery extends object, TResult>(
    query: ValidatedQuery<TQuery, TResult>,
  ): Promise<TResult>;
  execute<TIncomingQuery extends TQuery, TResult = any>(
    query: TIncomingQuery,
  ): Promise<TResult>;
}
