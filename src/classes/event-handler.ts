import type { IEvent, IEventHandler } from '../interfaces';

export type EventsHandlerType<T extends IEvent = IEvent> =
  typeof AbstractEventsHandler<T>;

export abstract class AbstractEventsHandler<TEvent extends IEvent>
  implements IEventHandler<TEvent>
{
  public static instance<T extends IEvent>(
    this: {
      new (): T;
    } & typeof AbstractEventsHandler<T>,
  ): T {
    return new (this as new () => T)();
  }

  public abstract handle(command: TEvent): Promise<void>;
}
