import type { Command } from '../../classes';

export interface ICommandBus {
  execute(command: Command): Promise<void>;
}
