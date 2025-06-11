/* eslint-disable perfectionist/sort-modules */
import { IsNotEmpty, IsString } from 'class-validator';

import {
  AbstractCommandHandler,
  Command,
  CommandBus,
  CommandHandler,
  ValidatedCommand,
} from '../src';

const executed = jest.fn();

class TestCommand extends Command<TestCommand> {
  public name: string;
}

class TestCommand2 extends ValidatedCommand<TestCommand2> {
  @IsString()
  @IsNotEmpty()
  public name: string;
}

@CommandHandler(TestCommand)
class TestCommandHandler extends AbstractCommandHandler<TestCommand> {
  public execute(command: TestCommand): Promise<void> {
    executed(command.name);
    return Promise.resolve();
  }
}

@CommandHandler(TestCommand2)
class TestCommand2Handler extends AbstractCommandHandler<TestCommand2> {
  public execute(command: TestCommand2): Promise<void> {
    executed(command.name);
    return Promise.resolve();
  }
}

describe('CommandBus', () => {
  it('should execute a command', async () => {
    const bus = new CommandBus();
    bus.register([TestCommandHandler, TestCommand2Handler]);

    const command = new TestCommand({ name: 'test' });
    const command2 = new TestCommand2({ name: 'test2' });

    await bus.execute(command);
    await bus.execute(command2);

    expect(executed).toHaveBeenCalledWith('test');
    expect(executed).toHaveBeenCalledWith('test2');
    expect(executed).toHaveBeenCalledTimes(2);
  });

  it('should throw an error if no handler is found', async () => {
    const bus = new CommandBus();
    const command = new TestCommand();

    await expect(async () => bus.execute(command)).rejects.toThrow(
      'No handler found for the command: "TestCommand"',
    );
  });
});
