import type { ICommand } from '../interfaces';
import type { PublicProperties } from '../types';

import { Validator } from '../helpers/validator';

export abstract class Command<TCommand extends object> implements ICommand {
  public constructor(props?: PublicProperties<TCommand>) {
    Object.assign(this, props);
  }
}

export abstract class ValidatedCommand<
  TCommand extends object,
> extends Validator<TCommand> {}
