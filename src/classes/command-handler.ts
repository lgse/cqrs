import type { ICommand, ICommandHandler } from '../interfaces';

export type CommandHandlerType<TCommand extends ICommand = ICommand> =
  typeof AbstractCommandHandler<TCommand>;

export abstract class AbstractCommandHandler<TCommand extends ICommand>
  implements ICommandHandler<TCommand>
{
  public static instance<TCommand extends ICommand>(
    this: {
      new (): TCommand;
    } & typeof AbstractCommandHandler<TCommand>,
  ): TCommand {
    return new (this as new () => TCommand)();
  }

  public abstract execute(command: TCommand): Promise<void>;
}
