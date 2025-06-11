import 'reflect-metadata';

import type {
  AbstractCommandHandler,
  Command,
  CommandHandlerType,
} from './classes';
import type {
  CommandMetadata,
  ICommand,
  ICommandBus,
  ICommandHandlerInstantiator,
  ILogger,
} from './interfaces';
import type { Type } from './types.ts';

import {
  COMMAND_HANDLER_METADATA,
  COMMAND_METADATA,
} from './decorators/constants';
import { CommandHandlerNotFoundException } from './exceptions';
import { defaultCommandHandlerInstantiator } from './helpers/default-command-handler-instantiator';
import { InvalidCommandHandlerException } from './index';

export class CommandBus<CommandBase extends ICommand = ICommand>
  implements ICommandBus
{
  private handlers = new Map<string, (command: CommandBase) => Promise<void>>();
  private instantiator: ICommandHandlerInstantiator;
  private readonly logger: ILogger;

  public constructor({
    instantiator,
    logger = console,
  }: {
    instantiator?: ICommandHandlerInstantiator;
    logger?: ILogger;
  } = {}) {
    this.instantiator = instantiator ?? defaultCommandHandlerInstantiator;
    this.logger = logger;
  }

  public bind<TCommand extends CommandBase>(
    handler: CommandHandlerType<TCommand>,
    id: string,
  ) {
    this.handlers.set(id, async (command: CommandBase) => {
      const instance = await this.instantiator.instantiate(handler);

      return instance.execute(command as Command<TCommand> & TCommand);
    });
  }

  public execute<TCommand extends CommandBase>(
    command: TCommand,
  ): Promise<void> {
    const commandId = this.getCommandId(command);

    const executeFn = this.handlers.get(commandId);
    if (!executeFn) {
      const commandName = this.getCommandName(command);
      throw new CommandHandlerNotFoundException(commandName);
    }

    return executeFn(command);
  }

  public register(
    handlers: (typeof AbstractCommandHandler<CommandBase>)[] = [],
  ) {
    handlers.forEach((handler) => this.registerHandler(handler));
  }

  private getCommandId(command: CommandBase): string {
    const { constructor: commandType } = Object.getPrototypeOf(command);
    const commandMetadata: CommandMetadata = Reflect.getMetadata(
      COMMAND_METADATA,
      commandType,
    );
    if (!commandMetadata) {
      throw new CommandHandlerNotFoundException(commandType.name);
    }

    return commandMetadata.id;
  }

  private getCommandName(command: CommandBase): string {
    const { constructor } = Object.getPrototypeOf(command);
    return constructor.name as string;
  }

  private reflectCommandId(
    handler: CommandHandlerType<CommandBase>,
  ): string | undefined {
    const command: Type<ICommand> = Reflect.getMetadata(
      COMMAND_HANDLER_METADATA,
      handler,
    );

    const commandMetadata: CommandMetadata = Reflect.getMetadata(
      COMMAND_METADATA,
      command,
    );

    return commandMetadata.id;
  }

  private registerHandler(handler: typeof AbstractCommandHandler<CommandBase>) {
    const target = this.reflectCommandId(handler);
    if (!target) {
      throw new InvalidCommandHandlerException();
    }

    if (this.handlers.has(target)) {
      this.logger.warn(
        `Command handler [${handler.constructor.name}] is already registered. Overriding previously registered handler.`,
      );
    }

    this.bind(handler, target);
  }
}
