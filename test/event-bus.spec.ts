import { IsUUID } from 'class-validator';

import {
  AbstractEventHandler,
  Event,
  EventBus,
  EventsHandler,
  ValidatedEvent,
} from '../src';

const handled = jest.fn();

class InvalidEventsHandler extends AbstractEventHandler<TestEvent> {
  public handle(_event: TestEvent): Promise<void> {
    return Promise.resolve();
  }
}

class TestEvent extends Event<TestEvent> {
  public id: string;
}

class TestEvent2 extends ValidatedEvent<TestEvent2> {
  @IsUUID()
  public id: string;
}

@EventsHandler(TestEvent, TestEvent2)
class TestEventHandler extends AbstractEventHandler<TestEvent | TestEvent2> {
  public handle(_event: TestEvent | TestEvent2): Promise<void> {
    handled();
    return Promise.resolve();
  }
}

describe('EventBus', () => {
  beforeEach(() => {
    handled.mockClear();
  });

  it('should publish an event', async () => {
    const bus = new EventBus();
    bus.register([TestEventHandler]);

    const event = new TestEvent();
    const event2 = new TestEvent2({
      id: '123e4567-e89b-12d3-a456-426614174000',
    });

    await bus.publish(event);
    await bus.publish(event2);

    expect(handled).toHaveBeenCalledTimes(2);
  });

  it('should publish multiple events', async () => {
    const bus = new EventBus();
    bus.register([TestEventHandler]);

    const events = [
      new TestEvent(),
      new TestEvent2({ id: '123e4567-e89b-12d3-a456-426614174000' }),
    ];

    await bus.publishAll(events);

    expect(handled).toHaveBeenCalledTimes(2);
  });

  it('should not throw when publishing an event with no handlers', async () => {
    const bus = new EventBus();
    const event = new TestEvent();

    await expect(bus.publish(event)).resolves.not.toThrow();
  });

  it('should return false when publishing an event with no constructor', async () => {
    const bus = new EventBus();
    const event = {};

    await expect(bus.publish(event)).resolves.toBe(false);
  });

  it('should throw when registering an invalid handler', () => {
    const bus = new EventBus();
    expect(() => bus.register([InvalidEventsHandler])).toThrow(
      "An invalid events handler has been provided. Please ensure that the provided handler is a class annotated with @EventsHandler and contains a 'handle' method.",
    );
  });
});
