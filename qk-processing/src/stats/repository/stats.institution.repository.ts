import { Injectable } from "@nestjs/common";
import { InstitutionStats } from "@prisma/client";

import { InstitutionStatsNotFoundException } from "../../common/exception";
import { PrismaService } from "../../prisma/prisma.service";

/**
 * Class for getting stats from the database
 */
@Injectable()
export class StatsInstitutionRepository {
  constructor(
        private prisma: PrismaService,
  ) {}

  public async getStatsForInstitution(institutionUuid: string): Promise<InstitutionStats> {
    const institutionStats = await this.prisma.institutionStats.findUnique({ where: { institutionUuid: institutionUuid } });

    if (null === institutionStats) {
      throw new InstitutionStatsNotFoundException(institutionUuid);
    }

    return institutionStats;
  }
}