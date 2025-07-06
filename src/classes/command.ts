import 'reflect-metadata';

import type { ValidationError } from 'class-validator';

import { validateSync } from 'class-validator';

import type { ICommand } from '../interfaces';
import type { NonFunctionPropertyNames, PublicProperties } from '../types';

export abstract class Command<_TCommand extends object> implements ICommand {
  /**
   * @deprecated Use `create` method instead.
   */
  public constructor() {}

  public static create<TCommand extends Command<any>>(
    this: new () => TCommand,
    ...args: NonFunctionPropertyNames<TCommand> extends never
      ? []
      : [props: PublicProperties<TCommand>]
  ): TCommand {
    const command = new this();

    if (args.length > 0) {
      Object.assign(command, args[0]);
    }

    return command;
  }
}

export abstract class ValidatedCommand<
  _TCommand extends object,
> extends Command<_TCommand> {
  public static create<TCommand extends ValidatedCommand<any>>(
    this: new () => TCommand,
    ...args: NonFunctionPropertyNames<TCommand> extends never
      ? []
      : [props: PublicProperties<TCommand>]
  ): TCommand {
    const command = new this();

    if (args.length > 0) {
      Object.assign(command, args[0]);
    }

    const errors = validateSync(command, { forbidUnknownValues: false });
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

    return command;
  }
}
