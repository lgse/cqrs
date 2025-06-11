import type { AbstractQuery } from '../../classes';
import type { IQuery } from './query.interface.ts';

export interface IQueryBus<TQuery extends IQuery = any> {
  execute<TQuery extends object, TResult>(
    query: AbstractQuery<TQuery, TResult>,
  ): Promise<TResult>;
  execute<TIncomingQuery extends TQuery, TResult = any>(
    query: TIncomingQuery,
  ): Promise<TResult>;
}
