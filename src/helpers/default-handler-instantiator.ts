import type {
  CommandHandlerType,
  EventsHandlerType,
  QueryHandlerType,
} from '../classes';
import type {
  ICommand,
  ICommandHandler,
  ICommandHandlerInstantiator,
  IEvent,
  IEventHandler,
  IEventHandlerInstantiator,
  IQuery,
  IQueryHandler,
  IQueryHandlerInstantiator,
} from '../interfaces';

export class DefaultHandlerInstantiator
  implements
    ICommandHandlerInstantiator,
    IEventHandlerInstantiator,
    IQueryHandlerInstantiator
{
  instantiate<T extends ICommand>(
    handler: CommandHandlerType<T>,
  ): Promise<ICommandHandler<T>>;
  instantiate<T extends IEvent>(
    handler: EventsHandlerType<T>,
  ): Promise<IEventHandler<T>>;
  instantiate<T extends IQuery>(
    handler: QueryHandlerType<T>,
  ): Promise<IQueryHandler<T>>;
  instantiate<T extends ICommand | IEvent | IQuery>(
    handler: CommandHandlerType<T> | EventsHandlerType<T> | QueryHandlerType<T>,
  ): Promise<ICommandHandler<T> | IEventHandler<T> | IQueryHandler<T>> {
    const instance = (handler as { instance: () => any }).instance();

    return Promise.resolve(instance);
  }
}

export const defaultHandlerInstantiator = new DefaultHandlerInstantiator();
