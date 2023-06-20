import { ConflictException } from "@nestjs/common";

export class CredentialsAlreadyAddedException extends ConflictException {
  constructor(id: number, smartContractId: string) {
    super(`Credentials with did ${id} already added to ${smartContractId} smart contract.`);
  }
}