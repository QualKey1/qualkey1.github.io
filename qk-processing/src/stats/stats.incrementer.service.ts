import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { StatsInstitutionRepository } from "./repository/stats.institution.repository";

@Injectable()
export class StatsIncrementerService {
  constructor(
        private readonly prisma: PrismaService,
        private readonly statsInstitutionRepository: StatsInstitutionRepository,
  ) {}

  public async incrementTotalQualifications(institutionUuid: string, number = 1): Promise<void> {
    const institutionStats = await this.statsInstitutionRepository.getStatsForInstitution(institutionUuid);
    await this.prisma.institutionStats.update({
      data: { totalQualifications: institutionStats.totalQualifications + number },
      where: { institutionUuid: institutionUuid },
    });
  }

  public async incrementWithdrawnQualifications(institutionUuid: string, number = 1): Promise<void> {
    const institutionStats = await this.statsInstitutionRepository.getStatsForInstitution(institutionUuid);
    await this.prisma.institutionStats.update({
      data: { withdrawnQualifications: institutionStats.withdrawnQualifications + number },
      where: { institutionUuid: institutionUuid },
    });
  }

  public async incrementEditedQualifications(institutionUuid: string, number = 1): Promise<void> {
    const institutionStats = await this.statsInstitutionRepository.getStatsForInstitution(institutionUuid);
    await this.prisma.institutionStats.update({
      data: { editedQualifications: institutionStats.editedQualifications + number },
      where: { institutionUuid: institutionUuid },
    });
  }

  public async incrementSharedQualifications(institutionUuid: string, number = 1): Promise<void> {
    const institutionStats = await this.statsInstitutionRepository.getStatsForInstitution(institutionUuid);
    await this.prisma.institutionStats.update({
      data: { sharedQualifications: institutionStats.sharedQualifications + number },
      where: { institutionUuid: institutionUuid },
    });
  }

  public async incrementDeletedQualifications(institutionUuid: string, number = 1): Promise<void> {
    const institutionStats = await this.statsInstitutionRepository.getStatsForInstitution(institutionUuid);
    await this.prisma.institutionStats.update({
      data: { deletedQualifications: institutionStats.deletedQualifications + number },
      where: { institutionUuid: institutionUuid },
    });
  }

  public async incrementActivatedQualifications(institutionUuid: string, number = 1): Promise<void> {
    const institutionStats = await this.statsInstitutionRepository.getStatsForInstitution(institutionUuid);
    await this.prisma.institutionStats.update({
      data: { activatedQualifications: institutionStats.activatedQualifications + number },
      where: { institutionUuid: institutionUuid },
    });
  }
}