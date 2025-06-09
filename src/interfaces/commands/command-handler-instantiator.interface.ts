import type { CommandHandlerType } from '../../classes';
import type { ICommandHandler } from './command-handler.interface';
import type { ICommand } from './command.interface';

export interface ICommandHandlerInstantiator {
  instantiate<T extends ICommand = any>(
    handler: CommandHandlerType<T>,
  ): Promise<ICommandHandler<T>>;
}
