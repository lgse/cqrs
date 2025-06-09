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
    if (!handler.instance) {
      throw new Error(
        `Could not instantiate event handler. Ensure the instance() method is defined.`,
      );
    }

    const instance = (
      handler as { instance: () => IEventHandler<TEvent> }
    ).instance();

    return Promise.resolve(instance);
  }
}

export const defaultEventHandlerInstantiator =
  new DefaultEventHandlerInstantiator();
