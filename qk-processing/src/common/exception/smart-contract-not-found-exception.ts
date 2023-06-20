import { NotFoundException } from "@nestjs/common";

export class SmartContractNotFoundException extends NotFoundException {
  constructor() {
    super("Smart Contract with ACTIVE status was not found");
  }
}