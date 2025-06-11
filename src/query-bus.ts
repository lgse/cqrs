import 'reflect-metadata';

import type { AbstractQuery } from './classes';
import type { QueryHandlerType } from './classes';
import type {
  ILogger,
  IQuery,
  IQueryBus,
  IQueryHandlerInstantiator,
  IQueryResult,
  QueryMetadata,
} from './interfaces';
import type { Type } from './types.ts';

import { QUERY_HANDLER_METADATA, QUERY_METADATA } from './decorators/constants';
import {
  InvalidQueryHandlerException,
  QueryHandlerNotFoundException,
} from './exceptions';
import { defaultQueryHandlerInstantiator } from './helpers/default-query-handler-instantiator';

export class QueryBus<QueryBase extends IQuery = IQuery>
  implements IQueryBus<QueryBase>
{
  private handlers = new Map<string, (query: QueryBase) => Promise<any>>();
  private instantiator: IQueryHandlerInstantiator;
  private readonly logger: ILogger;

  public constructor({
    instantiator,
    logger = console,
  }: {
    instantiator?: IQueryHandlerInstantiator;
    logger?: ILogger;
  } = {}) {
    this.logger = logger;
    this.instantiator = instantiator ?? defaultQueryHandlerInstantiator;
  }

  bind<TQuery extends QueryBase, TResult extends IQueryResult = any>(
    handler: QueryHandlerType<TQuery, TResult>,
    queryId: string,
  ) {
    this.handlers.set(queryId, async (query: QueryBase) => {
      const instance = await this.instantiator.instantiate(handler);
      return instance.execute(query as TQuery);
    });
  }

  async execute<TQuery extends object, TResult>(
    query: AbstractQuery<TQuery, TResult>,
  ): Promise<TResult> {
    const queryId = this.getQueryId(query as unknown as QueryBase);

    const handler = this.handlers.get(queryId);
    if (!handler) {
      const queryName = this.getQueryName(query as unknown as QueryBase);
      throw new QueryHandlerNotFoundException(queryName);
    }

    return (await handler(query as unknown as QueryBase)) as TResult;
  }

  public register(handlers: QueryHandlerType<QueryBase>[] = []) {
    handlers.forEach((handler) => this.registerHandler(handler));
  }

  protected registerHandler(handler: QueryHandlerType<QueryBase>) {
    const target = this.reflectQueryId(handler);
    if (!target) {
      throw new InvalidQueryHandlerException();
    }
    if (this.handlers.has(target)) {
      this.logger.warn(
        `Query handler [${handler.constructor.name}] is already registered. Overriding previously registered handler.`,
      );
    }
    this.bind(handler, target);
  }

  private getQueryId(query: QueryBase): string {
    const { constructor: queryType } = Object.getPrototypeOf(query);
    const queryMetadata: QueryMetadata = Reflect.getMetadata(
      QUERY_METADATA,
      queryType,
    );
    if (!queryMetadata) {
      throw new QueryHandlerNotFoundException(queryType.name);
    }

    return queryMetadata.id;
  }

  private getQueryName(query: QueryBase): string {
    const { constructor } = Object.getPrototypeOf(query);
    return constructor.name as string;
  }

  private reflectQueryId(
    handler: QueryHandlerType<QueryBase>,
  ): string | undefined {
    const query: Type<QueryBase> = Reflect.getMetadata(
      QUERY_HANDLER_METADATA,
      handler,
    );
    const queryMetadata: QueryMetadata = Reflect.getMetadata(
      QUERY_METADATA,
      query,
    );
    return queryMetadata.id;
  }
}
