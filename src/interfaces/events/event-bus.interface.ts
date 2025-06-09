import type { IEvent } from './event.interface';

export interface IEventBus<EventBase extends IEvent = IEvent> {
  publish<TEvent extends EventBase>(event: TEvent): any;
  publishAll<TEvent extends EventBase>(events: TEvent[]): any;
}
