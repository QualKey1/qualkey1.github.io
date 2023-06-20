import { Module } from "@nestjs/common";

import { CredentialsShareRepository } from "../credentials/repository/credentials-share.repository";
import { CredentialsRepository } from "../credentials/repository/credentials.repository";
import { InstitutionRepository } from "../institution/repository/institution.repository";
import { StatsInstitutionRepository } from "./repository/stats.institution.repository";
import { StatsActualizeCommand } from "./stats.actualize.command";
import { StatsController } from "./stats.controller";
import { StatsIncrementerService } from "./stats.incrementer.service";
import { StatsService } from "./stats.service";

@Module({
  controllers: [StatsController],
  imports: [
    CredentialsRepository,
    InstitutionRepository,
    CredentialsShareRepository,
  ],
  providers: [
    StatsService,
    StatsInstitutionRepository,
    StatsIncrementerService,
    StatsActualizeCommand,
    CredentialsRepository,
    InstitutionRepository,
    CredentialsShareRepository,
  ],
  exports: [
    StatsIncrementerService,
    StatsInstitutionRepository,
  ],
})
export class StatsModule {}
