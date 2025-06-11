import { IsIn, IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { AbstractCommand, AbstractEvent, AbstractQuery } from '../../src';

class TestCommand extends AbstractCommand<TestCommand> {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsInt()
  public phoneNumber: number;
}

class TestEvent extends AbstractEvent<TestEvent> {
  @IsUUID()
  public id: string;
}

class TestQuery extends AbstractQuery<TestQuery> {
  @IsIn(['asc', 'desc'])
  public order: 'asc' | 'desc';

  @IsInt()
  public page: number;
}

describe('Validator', () => {
  it('should validate a command', () => {
    expect(
      () => new TestCommand({ name: 'test', phoneNumber: 1234567890 }),
    ).not.toThrow();

    expect(
      // @ts-expect-error we're forcing an error
      () => new TestCommand({ name: 123, phoneNumber: '1234567890' }),
    ).toThrow('name must be a string');
  });

  it('should validate an event', () => {
    expect(
      () => new TestEvent({ id: '123e4567-e89b-12d3-a456-426614174000' }),
    ).not.toThrow();

    expect(() => new TestEvent({ id: 'test' })).toThrow('id must be a UUID');
  });

  it('should validate a query', () => {
    expect(() => new TestQuery({ order: 'asc', page: 1 })).not.toThrow();

    // @ts-expect-error we're forcing an error
    expect(() => new TestQuery({ order: 'test', page: 1 })).toThrow(
      'order must be one of the following values: asc, desc',
    );
  });
});
