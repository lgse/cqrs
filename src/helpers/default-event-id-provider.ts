import type { EventIdProvider, IEvent } from '../interfaces';
import type { Type } from '../types.ts';

import { EVENT_METADATA } from '../decorators/constants';

class DefaultEventIdProvider<EventBase extends IEvent = IEvent>
  implements EventIdProvider<EventBase>
{
  getEventId(event: Type<EventBase>): null | string {
    return Reflect.getMetadata(EVENT_METADATA, event)?.id ?? null;
  }
}

export const defaultEventIdProvider = new DefaultEventIdProvider();
