import type { QueryHandlerType } from '../classes';
import type {
  IQuery,
  IQueryHandler,
  IQueryHandlerInstantiator,
} from '../interfaces';

export class DefaultQueryHandlerInstantiator
  implements IQueryHandlerInstantiator
{
  instantiate<TQuery extends IQuery = any>(
    handler: QueryHandlerType<TQuery>,
  ): Promise<IQueryHandler<TQuery>> {
    const instance = (
      handler as { instance: () => IQueryHandler<TQuery> }
    ).instance();

    return Promise.resolve(instance);
  }
}

export const defaultQueryHandlerInstantiator =
  new DefaultQueryHandlerInstantiator();
