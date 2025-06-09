import type { IQuery, IQueryHandler } from '../interfaces';

export type QueryHandlerType<
  TQuery extends IQuery = IQuery,
  TResult = any,
> = typeof AbstractQueryHandler<TQuery, TResult>;

export abstract class AbstractQueryHandler<
  TQuery extends IQuery = any,
  TResult = any,
> implements IQueryHandler<TQuery>
{
  public static instance<T extends IQuery>(
    this: {
      new (): T;
    } & typeof AbstractQueryHandler<T>,
  ): T {
    return new (this as new () => T)();
  }

  public abstract execute(query: TQuery): Promise<TResult>;
}
