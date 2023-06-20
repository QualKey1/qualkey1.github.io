import { NotFoundException } from "@nestjs/common";

export class InstitutionNotFoundException extends NotFoundException {
  constructor(uuid: string) {
    super(`Institution with uuid ${uuid} not found.`);
  }
}