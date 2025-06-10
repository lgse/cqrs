import type { AbstractQuery } from '../../classes';
import type { IQuery } from './query.interface.ts';

export interface IQueryBus<TQuery extends IQuery = any> {
  execute<TResult>(query: AbstractQuery<TResult>): Promise<TResult>;
  execute<TIncomingQuery extends TQuery, TResult = any>(
    query: TIncomingQuery,
  ): Promise<TResult>;
}
