import type { EventsHandlerType } from '../../classes';
import type { IEventHandler } from './event-handler.interface.ts';
import type { IEvent } from './event.interface.ts';

export interface IEventHandlerInstantiator {
  instantiate<T extends IEvent = any>(
    handler: EventsHandlerType<T>,
  ): Promise<IEventHandler<T>>;
}
