import { NotFoundException } from "@nestjs/common";

export class CredentialShareNotFoundException extends NotFoundException {
  constructor(uuid: string) {
    super(`Credential Share with uuid ${uuid} not found.`);
  }
}