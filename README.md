# CQRS

A collection of CQRS components for TypeScript:

- Command Bus
- Event Bus
- Query Bus

Inspired by the [NestJS CQRS module](https://github.com/nestjs/cqrs) without a dependency on RxJS.

## Installation

```bash
npm install @lgse/cqrs
```

## Validation (optional)
This library provides validation for commands, events, and queries using `class-validator` and instantiation using `class-transformer`.

To use `ValidatedCommand`, `ValidatedEvent`, and `ValidatedQuery` you will need to install `class-validator` and `class-transformer` as peer dependencies.
```bash
npm install class-validator class-transformer
```

You will need to modify your `tsconfig.json`:

```
{
  "compilerOptions": {
    "emitDecoratorMetadata": true, // required by class-validator
    "experimentalDecorators": true, // required by class-validator
  }
}
```

## Usage

### Command Bus with Validation

```ts
import { IsString } from 'class-validator';
import { CommandBus, CommandHandler, ValidatedCommand } from '@lgse/cqrs';

class TestCommand extends ValidatedCommand<TestCommand> {
  @IsString()
  public name: string;
}

@CommandHandler(TestCommand)
class TestCommandHandler extends ValidatedCommandHandler<TestCommand> {
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

### Command Bus without Validation

```ts
import { Command, CommandBus, CommandHandler, ICommand } from '@lgse/cqrs';

class TestCommand extends Command<TestCommand> {
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

### Event Bus without Validation

```ts
import { EventBus, EventsHandler, IEvent } from '@lgse/cqrs';

class TestEvent extends IEvent {
  public id: string;
}

class TestEvent2 extends IEvent {
  public id: string;
}

@EventsHandler(TestEvent, TestEvent2)
class TestEventHandler extends AbstractEventHandler<TestEvent | TestEvent2> {
  public handle(_event: TestEvent | TestEvent2): Promise<void> {
    return Promise.resolve();
  }
}

const bus = new EventBus();

bus.register([TestEventHandler]);

const event = new TestEvent({
  id: '123e4567-e89b-12d3-a456-426614174000',
});

const event2 = new TestEvent2({
    id: '123e4567-e89b-12d3-a456-426614174000',
});

await bus.publish(event);
await bus.publish(event2);

// publish one event at a time
await bus.publish(event);
await bus.publish(event2);

// or publish multiple events at once
await bus.publishAll([event, event2]);
```

### Event Bus with Validation

```ts
import { IsUUID } from 'class-validator';
import { EventBus, EventsHandler, ValidatedEvent } from '@lgse/cqrs';

class TestEvent extends ValidatedEvent<TestEvent> {
  @IsUUID()
  public id: string;
}

class TestEvent2 extends ValidatedEvent<TestEvent2> {
  @IsUUID()
  public id: string;
}

@EventsHandler(TestEvent, TestEvent2)
class TestEventHandler extends AbstractEventHandler<TestEvent | TestEvent2> {
  public handle(_event: TestEvent | TestEvent2): Promise<void> {
    return Promise.resolve();
  }
}

const bus = new EventBus();
bus.register([TestEventHandler]);

const event = new TestEvent({
  id: '123e4567-e89b-12d3-a456-426614174000',
});

const event2 = new TestEvent2({
    id: '123e4567-e89b-12d3-a456-426614174000',
});

// publish one event at a time
await bus.publish(event);
await bus.publish(event2);

// or publish multiple events at once
await bus.publishAll([event, event2]);
```

### Query Bus with Validation

```ts
import { IsIn, IsInt } from 'class-validator';
import { QueryBus, QueryHandler, ValidatedQuery } from '@lgse/cqrs';

class TestQuery extends ValidatedQuery<TestQuery, string> {
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

// result type is automatically inferred from the query
const result: string = await bus.execute(query);
```

### Query Bus without Validation

```ts
import { QueryBus, QueryHandler, Query } from '@lgse/cqrs';

class TestQuery extends Query<TestQuery, string> {
  public order: 'asc' | 'desc';
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

// result type is automatically inferred from the query
const result: string = await bus.execute(query);
```

