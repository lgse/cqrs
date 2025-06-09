import { AbstractEventHandler, Event, EventBus, EventsHandler } from '../src';

const handled = jest.fn();

class TestEvent extends Event {}
class TestEvent2 extends Event {}

@EventsHandler(TestEvent, TestEvent2)
class TestEventHandler extends AbstractEventHandler<TestEvent> {
  public handle(_event: TestEvent): Promise<void> {
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

    await bus.publish(event);

    expect(handled).toHaveBeenCalledTimes(1);
  });

  it('should publish multiple events', async () => {
    const bus = new EventBus();
    bus.register([TestEventHandler]);
    const events = [new TestEvent(), new TestEvent2()];

    await bus.publishAll(events);

    expect(handled).toHaveBeenCalledTimes(2);
  });

  it('should not throw when publishing an event with no handlers', async () => {
    const bus = new EventBus();
    const event = new TestEvent();

    await expect(bus.publish(event)).resolves.not.toThrow();
  });
});
