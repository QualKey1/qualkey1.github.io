import { NotFoundException } from "@nestjs/common";

export class InstitutionStatsNotFoundException extends NotFoundException {
  constructor(uuid: string) {
    super(`Institution Stats for institution with uuid ${uuid} not found.`);
  }
}