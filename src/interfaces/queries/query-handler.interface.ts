import type { IQuery } from './query.interface';

export type IQueryHandler<T extends IQuery = any, TRes = any> = {
  execute(query: T): Promise<TRes>;
};
