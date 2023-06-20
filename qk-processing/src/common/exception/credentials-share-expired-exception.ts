import { NotFoundException } from "@nestjs/common";

export class CredentialsShareExpiredException extends NotFoundException {
  constructor() {
    super(`Credentials share has expired.`);
  }
}