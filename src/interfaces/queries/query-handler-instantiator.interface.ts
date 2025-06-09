import type { QueryHandlerType } from '../../classes';
import type { IQueryHandler } from './query-handler.interface.ts';
import type { IQuery } from './query.interface.ts';

export interface IQueryHandlerInstantiator {
  instantiate<T extends IQuery = any>(
    handler: QueryHandlerType<T>,
  ): Promise<IQueryHandler<T>>;
}
