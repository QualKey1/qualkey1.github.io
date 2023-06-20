import { Module } from "@nestjs/common";

import { InstitutionHelper } from "./helper/institution.helper";
import { InstitutionRepository } from "./repository/institution.repository";

@Module({
  exports: [InstitutionRepository, InstitutionHelper],
  providers: [InstitutionRepository, InstitutionHelper],
})
export class InstitutionModule {}
