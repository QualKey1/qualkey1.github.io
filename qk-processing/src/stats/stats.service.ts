import { Injectable } from "@nestjs/common";
import { CredentialStatus, InstitutionStats, User } from "@prisma/client";

import { CredentialsWithCredentialChange } from "../common/types/credentials/credentials-with-credential-change.type";
import { CredentialsShareRepository } from "../credentials/repository/credentials-share.repository";
import { CredentialsRepository } from "../credentials/repository/credentials.repository";
import { InstitutionRepository } from "../institution/repository/institution.repository";
import { StatsInstitutionRepository } from "./repository/stats.institution.repository";

/**
 * Class for getting all the statistics for Qualkey
 */
@Injectable()
export class StatsService {
  constructor(
        private readonly statsInstitutionRepository: StatsInstitutionRepository,
        private readonly credentialsRepository: CredentialsRepository,
        private readonly institutionRepository: InstitutionRepository,
        private readonly credentialSharesRepository: CredentialsShareRepository,
  ) {}

  /**
  * Return stats for the institution
  */
  public async getStatsForUniversity(
    representative: User,
    filter?: string,
    dateCreatedFrom?: string,
    dateCreatedUntil?: string,
  ): Promise<InstitutionStats> {
    if (null === filter && null === dateCreatedFrom && null === dateCreatedUntil) {
      return await this.statsInstitutionRepository.getStatsForInstitution(representative.institutionUuid);
    }

    const stats: InstitutionStats = await this.statsInstitutionRepository.getStatsForInstitution(representative.institutionUuid);

    const [ total, allCredentialsWithChanges ]: [ number, CredentialsWithCredentialChange[] ] =
        await this.credentialsRepository.getAllForInstitutionStats(
          representative.institutionUuid,
          filter,
          dateCreatedFrom,
          dateCreatedUntil,
        );

    const totalQualifications: number = total;
    let withdrawnQualifications = 0;
    let editedQualifications = 0;
    let sharedQualifications = 0;
    let deletedQualifications = 0;
    let activatedQualifications = 0;
    const qualificationNames = [];

    for (const credential of allCredentialsWithChanges) {
      if (credential.status === CredentialStatus.WITHDRAWN) {
        withdrawnQualifications += 1;
      } else if (credential.status === CredentialStatus.DELETED) {
        deletedQualifications += 1;
      } else if (credential.status === CredentialStatus.ACTIVATED) {
        activatedQualifications += 1;
      }

      if (null !== credential.qualificationName && "" !== credential.qualificationName && !qualificationNames.includes(credential.qualificationName)) {
        qualificationNames.push(credential.qualificationName);
      }

      if (1 < credential.credentialChanges.length) {
        editedQualifications += 1;
      }

      const credentialShares = await this.credentialSharesRepository.findAllByCredentialUuid(credential.uuid);

      if (0 < credentialShares.length) {
        sharedQualifications += 1;
      }
    }

    stats.totalQualifications = totalQualifications;
    stats.withdrawnQualifications = withdrawnQualifications;
    stats.editedQualifications = editedQualifications;
    stats.sharedQualifications = sharedQualifications;
    stats.deletedQualifications = deletedQualifications;
    stats.activatedQualifications = activatedQualifications;

    return stats;
  }
}
