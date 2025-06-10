import {
  AbstractCommand,
  AbstractCommandHandler,
  CommandBus,
  CommandHandler,
} from '../src';

const executed = jest.fn();

class TestCommand extends AbstractCommand<TestCommand> {}

@CommandHandler(TestCommand)
class TestCommandHandler extends AbstractCommandHandler<TestCommand> {
  public execute(_command: TestCommand): Promise<void> {
    executed();
    return Promise.resolve();
  }
}

describe('CommandBus', () => {
  it('should execute a command', async () => {
    const bus = new CommandBus();
    bus.register([TestCommandHandler]);

    const command = new TestCommand();

    await bus.execute(command);

    expect(executed).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if no handler is found', async () => {
    const bus = new CommandBus();
    const command = new TestCommand();

    await expect(async () => bus.execute(command)).rejects.toThrow(
      'No handler found for the command: "TestCommand"',
    );
  });
});
