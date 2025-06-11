import type { IEvent } from '../interfaces';
import type { PublicProperties } from '../types';

import { Validator } from '../helpers/validator';

export abstract class Event<TEvent extends object> implements IEvent {
  public constructor(props?: PublicProperties<TEvent>) {
    Object.assign(this, props);
  }
}

export class ValidatedEvent<TEvent extends object> extends Validator<TEvent> {}
