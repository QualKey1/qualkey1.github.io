import { NotFoundException } from "@nestjs/common";

export class CredentialsChangeNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Credentials Change with id ${id} not found.`);
  }
}