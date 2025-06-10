import { IsInt, IsNotEmpty, IsString } from 'class-validator';

import { AbstractCommand } from '../../src';

class TestCommand extends AbstractCommand<TestCommand> {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsInt()
  public phoneNumber: number;
}

describe('Validator', () => {
  it('should validate the command', () => {
    expect(
      () => new TestCommand({ name: 'test', phoneNumber: 1234567890 }),
    ).not.toThrow();

    expect(
      // @ts-expect-error we're forcing an error
      () => new TestCommand({ name: 123, phoneNumber: '1234567890' }),
    ).toThrow('name must be a string');
  });
});
