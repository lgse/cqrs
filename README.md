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
    "strictPropertyInitialization": false, // properties are initialized by the constructor in the abstract classes
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


### TypeDI Instantiator
To use the TypeDI instantiator, you will need to install `typedi` as a dependency.
```bash
npm install typedi
```

```ts
import {
   CommandBus,
   CommandHandlerType,
   ICommand,
   ICommandHandler,
   ICommandHandlerInstantiator,
   TypediHandlerInstantiator,
} from '@lgse/cqrs';
import { Container, Inject, Service, Token } from 'typedi';

const bus = new CommandBus({
  instantiator: new TypeDIHandlerInstantiator(),
});
```

---

### Command Bus

```ts
import {
  AbstractCommandHandler,
  CommandBus,
  ICommand,
  TypediHandlerInstantiator,
  ValidatedCommand,
} from '@lgse/cqrs';
import { IsString, IsUUID } from 'class-validator';
import { Inject, Service } from 'typedi';

class CreateUserCommand extends ValidatedCommand<CreateUserCommand> {
  @IsUUID()
  public id: string;

  @IsString()
  public name: string;
}

@Service()
class UsersRepository {
  public async create(name: string): Promise<void> {
    // create the user
  }
}

@Service()
@CommandHandler(CreateUserCommand)
class CreateUserCommandHandler extends AbstractCommandHandler<CreateUserCommand> {
  @Inject()
  private usersRepository: UsersRepository;

  public async execute(command: CreateUserCommand): Promise<void> {
    await this.usersRepository.create(command.name);
  }
}

const bus = new CommandBus({
  instantiator: new TypeDIInstantiator(),
});
bus.register([CreateUserCommandHandler]);

const command = new CreateUserCommand({
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'test',
});

await bus.execute(command);
```

---

### Event Bus

```ts
import { IsUUID } from 'class-validator';
import { AbstractEventsHandler, EventBus, EventsHandler, ValidatedEvent } from '@lgse/cqrs';

class UserCreatedEvent extends ValidatedEvent<UserCreatedEvent> {
  @IsUUID()
  public id: string;
  
  @IsString()
  public name: string;
}

class UserUpdatedEvent extends ValidatedEvent<UserUpdatedEvent> {
  @IsUUID()
  public id: string;

  @IsString()
  public name: string;
}

@EventsHandler(UserCreatedEvent, UserUpdatedEvent)
class UserEventsHandler extends AbstractEventsHandler<UserCreatedEvent | UserUpdatedEvent> {
  public handle(event: UserCreatedEvent | UserUpdatedEvent): Promise<void> {
    // handle the event
  }
}

const bus = new EventBus();
bus.register([UserEventsHandler]);

const event = new UserCreatedEvent({
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'test',
});

const event2 = new UserUpdatedEvent({
   id: '123e4567-e89b-12d3-a456-426614174000',
   name: 'test',
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

class GetItemsQuery extends ValidatedQuery<GetItemsQuery, string> {
  @IsIn(['asc', 'desc'])
  public order: 'asc' | 'desc';

  @IsInt()
  public page: number;
}

@QueryHandler(GetItemsQuery)
class GetItemsQueryHandler extends AbstractQueryHandler<GetItemsQuery, string[]> {
  public execute(query: GetItemsQuery): Promise<string[]> {
    return ['item1', 'item2'];
  }
}

const bus = new QueryBus();
bus.register([GetItemsQueryHandler]);

const query = new GetItemsQuery({
  order: 'asc',
  page: 1,
});

// result type is automatically inferred from the query
const result: string = await bus.execute(query);
```
