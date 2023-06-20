import { ConflictException } from "@nestjs/common";

export class CredentialsChangeRequestAlreadyCreatedException extends ConflictException {
  constructor(uuid: string) {
    super(`CredentialsChangeRequest for credentials ${uuid} already created`);
  }
}