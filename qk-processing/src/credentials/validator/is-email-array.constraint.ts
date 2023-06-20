import { Injectable } from "@nestjs/common";
import {
  registerDecorator,
  ValidationError,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

/**
 * Constraint class for validating an array of emails
 */
@ValidatorConstraint({ name: "IsEmailArray", async: false })
@Injectable()
export class IsEmailArrayConstraint implements ValidatorConstraintInterface
{
  validate(array: string[]): boolean {
    try {
      this.validateEmails(array);
    } catch (e) {
      return false;
    }
    return true;
  }

  private validateEmails(array: string[]): void {
    // Regular expression to check if string is email
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    array.forEach((email: string) => {
      if (!regexp.test(email)) {
        throw new ValidationError();
      }
    });
  }
}

export function IsEmailArray(validationOptions?: ValidationOptions): any {
  return function (object: any, propertyName: string): any {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailArrayConstraint,
    });
  };
}