import type { CommandHandlerType } from '../classes';
import type {
  ICommand,
  ICommandHandler,
  ICommandHandlerInstantiator,
} from '../interfaces';

export class DefaultCommandHandlerInstantiator
  implements ICommandHandlerInstantiator
{
  instantiate<TCommand extends ICommand = any>(
    handler: CommandHandlerType<TCommand>,
  ): Promise<ICommandHandler<TCommand>> {
    const instance = (
      handler as { instance: () => ICommandHandler<TCommand> }
    ).instance();

    return Promise.resolve(instance);
  }
}

export const defaultCommandHandlerInstantiator =
  new DefaultCommandHandlerInstantiator();
