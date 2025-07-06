import 'reflect-metadata';

import type { ValidationError } from 'class-validator';

import { validateSync } from 'class-validator';

import type { IEvent } from '../interfaces';
import type { NonFunctionPropertyNames, PublicProperties } from '../types';

export abstract class Event<_TEvent extends object> implements IEvent {
  /**
   * @deprecated Use `create` method instead.
   */
  public constructor() {}

  public static create<TEvent extends Event<any>>(
    this: new () => TEvent,
    props?: PublicProperties<TEvent>,
  ): TEvent {
    const event = new this();

    Object.assign(event, props);

    return event;
  }
}

export abstract class ValidatedEvent<
  TEvent extends object,
> extends Event<TEvent> {
  public static create<T extends ValidatedEvent<any>>(
    this: new () => T,
    ...args: NonFunctionPropertyNames<T> extends never
      ? []
      : [props: PublicProperties<T>]
  ): T {
    const event = new this();

    if (args.length > 0) {
      Object.assign(event, args[0]);
    }

    const errors = validateSync(event, { forbidUnknownValues: false });
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error: ValidationError) => {
          if (error.constraints) {
            return Object.values(error.constraints).join(', ');
          }

          return `Validation failed for property: ${error.property}`;
        })
        .join('\n');

      throw new Error(
        `Failed to instantiate ${this.constructor.name}:\n${errorMessages}`,
        {
          cause: errors,
        },
      );
    }

    return event;
  }
}
