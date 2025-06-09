import type { ICommand } from './command.interface';

export interface ICommandHandler<TCommand extends ICommand = any> {
  execute(command: TCommand): Promise<void>;
}
