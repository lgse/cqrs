import 'reflect-metadata';

import type { ValidationError } from 'class-validator';

import { plainToClassFromExist } from 'class-transformer';
import { validateSync } from 'class-validator';

import type { PublicProperties } from '../types';

export abstract class Validator<TObject extends object> {
  public constructor(props?: PublicProperties<TObject>) {
    Object.assign(this, props);
    plainToClassFromExist(this, props, { excludeExtraneousValues: true });

    const errors = validateSync(this, { forbidUnknownValues: false });
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error: ValidationError) => {
          if (error.constraints) {
            return Object.values(error.constraints).join(', ');
          }
          return `Validation failed for property: ${error.property}`;
        })
        .join('\n');

      throw new Error(
        `Failed to instantiate ${this.constructor.name}:\n${errorMessages}`,
        {
          cause: errors,
        },
      );
    }
  }
}
