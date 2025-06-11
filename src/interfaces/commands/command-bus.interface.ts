import type { ValidatedCommand } from '../../classes';
import type { ICommand } from './command.interface';

export interface ICommandBus {
  execute(command: ICommand): Promise<void>;
  execute(command: ValidatedCommand<any>): Promise<void>;
}
