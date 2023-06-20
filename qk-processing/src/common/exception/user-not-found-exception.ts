import { NotFoundException } from "@nestjs/common";

export class UserNotFoundException extends NotFoundException {
  constructor(email: string) {
    super(`User with email ${email} not found.`);
  }
}