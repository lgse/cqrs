import { randomUUID } from 'node:crypto';
import 'reflect-metadata';

import type { IEvent } from '../index';

import { EVENT_METADATA, EVENTS_HANDLER_METADATA } from './constants';

/**
 * Decorator that marks a class as an event handler. An event handler
 * handles events executed by your application code.
 *
 * The decorated class must implement the `IEventHandler` interface.
 *
 * @param events one or more event *types* to be handled by this handler.
 */
export const EventsHandler = (
  ...events: (IEvent | (new (...args: any[]) => IEvent))[]
): ClassDecorator => {
  return (target: Function) => {
    events.forEach((event) => {
      if (!Reflect.hasOwnMetadata(EVENT_METADATA, event)) {
        Reflect.defineMetadata(EVENT_METADATA, { id: randomUUID() }, event);
      }
    });

    Reflect.defineMetadata(EVENTS_HANDLER_METADATA, events, target);
  };
};
