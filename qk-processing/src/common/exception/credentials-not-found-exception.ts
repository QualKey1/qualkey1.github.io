import { NotFoundException } from "@nestjs/common";

export class CredentialsNotFoundException extends NotFoundException {
  constructor(uuid: string) {
    super(`Credentials - ${uuid} not found.`);
  }
}