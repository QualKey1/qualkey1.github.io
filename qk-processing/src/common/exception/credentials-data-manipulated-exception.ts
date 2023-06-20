import { NotFoundException } from "@nestjs/common";

export class CredentialsDataManipulatedException extends NotFoundException {
  constructor(id: string) {
    super(`Credentials data was manipulated, credentials id: ${id}.`);
  }
}