# CQRS

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/lgse/cqrs/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@lgse/cqrs.svg)](https://www.npmjs.com/package/@lgse/cqrs)
[![Test](https://github.com/lgse/cqrs/actions/workflows/test.yaml/badge.svg)](https://github.com/lgse/cqrs/actions/workflows/test.yaml)
[![codecov](https://codecov.io/gh/lgse/cqrs/branch/main/graph/badge.svg)](https://codecov.io/gh/lgse/cqrs)

A collection of CQRS components for TypeScript:

- [Command Bus](#command-bus)
- [Event Bus](#event-bus)
- [Query Bus](#query-bus)

Inspired by the [NestJS CQRS module](https://github.com/nestjs/cqrs) without a dependency on RxJS.

## Installation

```bash
npm install @lgse/cqrs
```

### Validation Dependencies (optional)
This library provides validation for commands, events, and queries using `class-validator` and instantiation using `class-transformer`.

To use `ValidatedCommand`, `ValidatedEvent`, and `ValidatedQuery` you will need to install `class-validator` and `class-transformer` as peer dependencies.
```bash
npm install class-validator class-transformer
```

You will need to modify your `tsconfig.json`:

```json5
{
  "compilerOptions": {
    "emitDecoratorMetadata": true, // required by class-validator
    "experimentalDecorators": true, // required by class-validator
  }
}
```

## Usage

### Validation

This library provides two approaches for working with commands, events, and queries:

1. **Validated Classes** (`ValidatedCommand`, `ValidatedEvent`, `ValidatedQuery`):
    - Include built-in validation using `class-validator` and `class-transformer`
    - Automatically validate data upon instantiation
    - Throw descriptive errors when validation fails
    - Require additional dependencies (`class-validator` and `class-transformer`)

2. **Basic Classes** (`Command`, `Event`, `Query`):
    - Lightweight with no validation
    - Useful for simple scenarios or when you want to implement your own validation
    - No additional dependencies required

Choose the approach that best fits your application's needs. For most production applications, the validated classes are recommended for better data integrity and error handling.

### Handler Instantiation

By default, handlers are instantiated using the `instance` method on the handler class. This method is defined on the `AbstractCommandHandler`, `AbstractEventHandler`, and `AbstractQueryHandler` classes.

If you wanted to inject dependencies into your handlers, you can provide a custom `ICommandHandlerInstantiator`, `IEventHandlerInstantiator`, or `IQueryHandlerInstantiator` to the bus constructor.


### Example: TypeDI Instantiation
```ts
import { Container } from 'typedi';
import { CommandBus, CommandHandlerType, ICommand, ICommandHandler, ICommandHandlerInstantiator } from '@lgse/cqrs';

class TypeDICommandHandlerInstantiator implements ICommandHandlerInstantiator {
  instantiate<TCommand extends ICommand>(
    handler: CommandHandlerType<TCommand>,
  ): Promise<ICommandHandler<TCommand>> {
    return Container.get(handler);
  }
}

const bus = new CommandBus({
    instantiator: new TypeDICommandHandlerInstantiator(),
});
```

---

### Command Bus

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

---

### Event Bus

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

---

### Query Bus

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
