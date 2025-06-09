import type { IEvent, IEventHandler } from '../interfaces';

export type EventHandlerType<T extends IEvent = IEvent> =
  typeof AbstractEventHandler<T>;

export abstract class AbstractEventHandler<TEvent extends IEvent>
  implements IEventHandler<TEvent>
{
  public static instance<T extends IEvent>(
    this: {
      new (): T;
    } & typeof AbstractEventHandler<T>,
  ): T {
    return new (this as new () => T)();
  }

  public abstract handle(command: TEvent): Promise<void>;
}
