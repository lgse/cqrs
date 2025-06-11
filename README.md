# CQRS

A collection of CQRS components for TypeScript:

- Command Bus
- Event Bus
- Query Bus

## Installation

```bash
npm install @lgse/cqrs class-transformer class-validator
```

## Usage

### Command Bus

```ts
import { AbstractCommand, CommandBus, CommandHandler } from '@lgse/cqrs';

class TestCommand extends AbstractCommand<TestCommand> {
    @IsString()
    public name: string;
}

@CommandHandler(TestCommand)
class TestCommandHandler extends AbstractCommandHandler<TestCommand> {
  public execute(_command: TestCommand): Promise<void> {
    return Promise.resolve();
  }
}

const bus = new CommandBus();
bus.register([TestCommandHandler]);

const command = new TestCommand({
    name: 'test',
});

await bus.execute(command);
```

### Event Bus

```ts
import { AbstractEvent, EventBus, EventsHandler } from '@lgse/cqrs';

class TestEvent extends AbstractEvent<TestEvent> {
    @IsUUID()
    public id: string;
}

@EventsHandler(TestEvent)
class TestEventHandler extends AbstractEventHandler<TestEvent> {
  public handle(_event: TestEvent): Promise<void> {
    return Promise.resolve();
  }
}

const bus = new EventBus();
bus.register([TestEventHandler]);

const event = new TestEvent({
    id: '123e4567-e89b-12d3-a456-426614174000',
});

await bus.publish(event);
```

### Query Bus

```ts
import { AbstractQuery, QueryBus, QueryHandler } from '@lgse/cqrs';

class TestQuery extends AbstractQuery<TestQuery, string> {
    @IsIn(['asc', 'desc'])
    public order: 'asc' | 'desc';

    @IsInt()
    public page: number;
}

@QueryHandler(TestQuery)
class TestQueryHandler extends AbstractQueryHandler<TestQuery, string> {
  public execute(_query: TestQuery): Promise<string> {
    return Promise.resolve('test-result');
  }
}

const bus = new QueryBus();
bus.register([TestQueryHandler]);

const query = new TestQuery({
    order: 'asc',
    page: 1,
});

const result = await bus.execute(query);
```

