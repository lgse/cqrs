/* eslint-disable perfectionist/sort-modules */
import {
  AbstractQueryHandler,
  Query,
  QueryBus,
  QueryHandler,
  QueryHandlerNotFoundException,
  ValidatedQuery,
} from '../src';

class TestResult {
  constructor(public readonly value: string) {}
}

class TestResult2 {
  constructor(public readonly value: string) {}
}

class TestQuery extends ValidatedQuery<TestQuery, TestResult> {}

class TestQuery2 extends Query<TestQuery2, TestResult2> {}

class UnknownQuery extends Query<UnknownQuery> {
  public page: number;
}

@QueryHandler(TestQuery)
class TestQueryHandler extends AbstractQueryHandler<TestQuery, TestResult> {
  public execute(_query: TestQuery): Promise<TestResult> {
    return Promise.resolve(new TestResult('test-result'));
  }
}

@QueryHandler(TestQuery2)
class TestQuery2Handler extends AbstractQueryHandler<TestQuery2, TestResult> {
  public execute(_query: TestQuery2): Promise<TestResult> {
    return Promise.resolve(new TestResult2('test-result-2'));
  }
}

class InvalidQueryHandler extends AbstractQueryHandler<TestQuery, TestResult> {
  public execute(_query: TestQuery): Promise<TestResult> {
    return Promise.resolve(new TestResult('test-result'));
  }
}

describe('QueryBus', () => {
  it('should execute a query', async () => {
    const bus = new QueryBus();
    bus.register([TestQueryHandler, TestQuery2Handler]);
    const query = new TestQuery();
    const query2 = new TestQuery2();

    const result = await bus.execute(query);
    expect(result).toBeInstanceOf(TestResult);
    expect(result.value).toBe('test-result');

    const result2 = await bus.execute(query2);
    expect(result2).toBeInstanceOf(TestResult2);
    expect(result.value).toBe('test-result');
  });

  it('should throw when no handler is found', async () => {
    const bus = new QueryBus();
    const query = new TestQuery();

    await expect(bus.execute(query)).rejects.toThrow(
      QueryHandlerNotFoundException,
    );
  });

  it('should register multiple handlers', async () => {
    class AnotherQuery extends ValidatedQuery<AnotherQuery, string> {}

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

    const result1 = await bus.execute(new TestQuery());
    expect(result1.value).toBe('test-result');

    const result2 = await bus.execute(new AnotherQuery());
    expect(result2).toBe('another-result');
  });

  it('should throw when registering an invalid handler', () => {
    const bus = new QueryBus();
    expect(() => bus.register([InvalidQueryHandler])).toThrow(
      "An invalid query handler has been provided. Please ensure that the provided handler is a class annotated with @QueryHandler and contains an 'execute' method.",
    );
  });

  it('should log a warning if a handler is already registered', () => {
    const logger = {
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
    };
    const bus = new QueryBus({ logger });

    bus.register([TestQueryHandler, TestQueryHandler]);

    expect(logger.warn).toHaveBeenCalledWith(
      'Query handler TestQueryHandler is already registered. Overriding previously registered handler.',
    );
  });

  it('should throw an error if the query has not been registered with any handlers', async () => {
    const bus = new QueryBus();
    const query = new UnknownQuery();

    await expect(async () => bus.execute(query)).rejects.toThrow(
      'No handler found for the query: "UnknownQuery"',
    );
  });
});
