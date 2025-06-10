/* eslint-disable perfectionist/sort-modules */
import {
  AbstractQuery,
  AbstractQueryHandler,
  QueryBus,
  QueryHandler,
  QueryHandlerNotFoundException,
} from '../src';

class TestResult {
  constructor(public readonly value: string) {}
}

class TestQuery extends AbstractQuery<TestResult> {}

@QueryHandler(TestQuery)
class TestQueryHandler extends AbstractQueryHandler<TestQuery, TestResult> {
  public execute(_query: TestQuery): Promise<TestResult> {
    return Promise.resolve(new TestResult('test-result'));
  }
}

describe('QueryBus', () => {
  it('should execute a query', async () => {
    const bus = new QueryBus();
    bus.register([TestQueryHandler]);
    const query = new TestQuery();

    // Act
    const result = await bus.execute(query);

    // Assert
    expect(result).toBeInstanceOf(TestResult);
    expect(result.value).toBe('test-result');
  });

  it('should throw when no handler is found', async () => {
    const bus = new QueryBus();
    const query = new TestQuery();

    // Act & Assert
    await expect(bus.execute(query)).rejects.toThrow(
      QueryHandlerNotFoundException,
    );
  });

  it('should register multiple handlers', async () => {
    class AnotherQuery extends AbstractQuery<string> {}

    @QueryHandler(AnotherQuery)
    class AnotherQueryHandler extends AbstractQueryHandler<
      AnotherQuery,
      string
    > {
      public execute(_query: AnotherQuery): Promise<string> {
        return Promise.resolve('another-result');
      }
    }

    const bus = new QueryBus();
    bus.register([TestQueryHandler, AnotherQueryHandler]);

    // Act & Assert
    const result1 = await bus.execute(new TestQuery());
    expect(result1.value).toBe('test-result');

    const result2 = await bus.execute(new AnotherQuery());
    expect(result2).toBe('another-result');
  });
});
