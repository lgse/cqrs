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
    if (!handler.instance) {
      throw new Error(
        `Could not instantiate command handler. Ensure the instance() method is defined.`,
      );
    }

    const instance = (
      handler as { instance: () => ICommandHandler<TCommand> }
    ).instance();

    return Promise.resolve(instance);
  }
}

export const defaultCommandHandlerInstantiator =
  new DefaultCommandHandlerInstantiator();
