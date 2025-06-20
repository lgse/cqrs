import type { EventsHandlerType } from './classes';
import type {
  EventIdProvider,
  IEvent,
  IEventBus,
  IEventHandlerInstantiator,
} from './interfaces';
import type { Type } from './types';

import { EVENTS_HANDLER_METADATA } from './decorators/constants';
import { InvalidEventsHandlerException } from './exceptions';
import { defaultEventIdProvider, defaultHandlerInstantiator } from './helpers';

export class EventBus<EventBase extends IEvent = IEvent>
  implements IEventBus<EventBase>
{
  protected eventIdProvider: EventIdProvider<EventBase>;
  protected instantiator: IEventHandlerInstantiator;
  private subscriptions: Map<string, ((event: EventBase) => Promise<void>)[]> =
    new Map();

  public constructor({
    eventIdProvider,
    instantiator,
  }: {
    eventIdProvider?: EventIdProvider<EventBase>;
    instantiator?: IEventHandlerInstantiator;
  } = {}) {
    this.eventIdProvider = eventIdProvider ?? defaultEventIdProvider;
    this.instantiator = instantiator ?? defaultHandlerInstantiator;
  }

  public bind(handler: EventsHandlerType<EventBase>, eventId: string) {
    this.subscriptions.set(eventId, [
      ...(this.subscriptions.get(eventId) ?? []),
      async (event: EventBase) => {
        const instance = await this.instantiator.instantiate(handler);
        return instance.handle(event);
      },
    ]);
  }

  public async publish<TEvent extends EventBase>(event: TEvent) {
    const { constructor } = Object.getPrototypeOf(event);

    const eventId = this.eventIdProvider.getEventId(constructor);
    if (!eventId) {
      return false;
    }

    const handlers = this.subscriptions.get(eventId);
    if (!handlers) {
      return;
    }

    return Promise.all(handlers.map((handler) => handler(event)));
  }

  public publishAll<TEvent extends EventBase>(events: TEvent[]) {
    return Promise.all(events.map((event) => this.publish(event)));
  }

  public register(handlers: EventsHandlerType<EventBase>[]) {
    handlers.forEach((handler) => this.registerHandler(handler));
  }

  private reflectEvents(
    handler: EventsHandlerType<EventBase>,
  ): Type<EventBase>[] {
    const events = Reflect.getMetadata(EVENTS_HANDLER_METADATA, handler);

    if (!events) {
      throw new InvalidEventsHandlerException();
    }

    return events;
  }

  private registerHandler(handler: EventsHandlerType<EventBase>) {
    const events = this.reflectEvents(handler);
    events.forEach((event) => {
      const eventId = this.eventIdProvider.getEventId(event);
      this.bind(handler, eventId!);
    });
  }
}
