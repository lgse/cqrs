# CQRS

A collection of CQRS components for TypeScript:

- Command Bus
- Event Bus
- Query Bus

## Installation

```bash
npm install @lgse/cqrs
```

## Usage

### Command Bus

```ts
import { Command, CommandBus, CommandHandler } from '@lgse/cqrs';

class TestCommand extends Command {}

@CommandHandler(TestCommand)
class TestCommandHandler extends AbstractCommandHandler<TestCommand> {
  public execute(_command: TestCommand): Promise<void> {
    return Promise.resolve();
  }
}

const bus = new CommandBus();
bus.register([TestCommandHandler]);

const command = new TestCommand();

await bus.execute(command);
```

### Event Bus

```ts
import { Event, EventBus, EventsHandler } from '@lgse/cqrs';

class TestEvent extends Event {}

@EventsHandler(TestEvent)
class TestEventHandler extends AbstractEventHandler<TestEvent> {
  public handle(_event: TestEvent): Promise<void> {
    return Promise.resolve();
  }
}

const bus = new EventBus();
bus.register([TestEventHandler]);

const event = new TestEvent();

await bus.publish(event);
```

### Query Bus

```ts
import { Query, QueryBus, QueryHandler } from '@lgse/cqrs';

class TestQuery extends Query<string> {}

@QueryHandler(TestQuery)
class TestQueryHandler extends AbstractQueryHandler<TestQuery, string> {
  public execute(_query: TestQuery): Promise<string> {
    return Promise.resolve('test-result');
  }
}

const bus = new QueryBus();
bus.register([TestQueryHandler]);

const query = new TestQuery();

const result = await bus.execute(query);
```

