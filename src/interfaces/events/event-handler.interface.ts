import type { IEvent } from './event.interface';

export interface IEventHandler<TEvent extends IEvent = any> {
  handle(event: TEvent): any;
}
