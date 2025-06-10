import { Validator } from '../helpers/validator';

export abstract class AbstractCommand<
  TCommand extends object,
> extends Validator<TCommand> {}
