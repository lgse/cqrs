import type { EventHandlerType } from '../classes';
import type {
  IEvent,
  IEventHandler,
  IEventHandlerInstantiator,
} from '../interfaces';

export class DefaultEventHandlerInstantiator
  implements IEventHandlerInstantiator
{
  instantiate<TEvent extends IEvent = any>(
    handler: EventHandlerType<TEvent>,
  ): Promise<IEventHandler<TEvent>> {
    const instance = (
      handler as { instance: () => IEventHandler<TEvent> }
    ).instance();

    return Promise.resolve(instance);
  }
}

export const defaultEventHandlerInstantiator =
  new DefaultEventHandlerInstantiator();
