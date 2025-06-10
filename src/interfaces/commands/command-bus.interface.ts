import type { AbstractCommand } from '../../classes';

export interface ICommandBus {
  execute(command: AbstractCommand<any>): Promise<void>;
}
