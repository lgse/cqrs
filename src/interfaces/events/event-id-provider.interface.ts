import type { Type } from '../../types.ts';
import type { IEvent } from './event.interface';

export interface EventIdProvider<EventBase extends IEvent = IEvent> {
  getEventId(event: Type<EventBase>): null | string;
}
