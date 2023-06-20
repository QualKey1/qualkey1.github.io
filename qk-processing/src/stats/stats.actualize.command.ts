import { Injectable, Logger } from "@nestjs/common";
import { CredentialStatus, Institution } from "@prisma/client";
import { Command } from "nestjs-command";

import { InstitutionStatsNotFoundException } from "../common/exception";
import { CredentialsWithCredentialChange } from "../common/types/credentials/credentials-with-credential-change.type";
import { CredentialsShareRepository } from "../credentials/repository/credentials-share.repository";
import { CredentialsRepository } from "../credentials/repository/credentials.repository";
import { InstitutionRepository } from "../institution/repository/institution.repository";
import { PrismaService } from "../prisma/prisma.service";
import { StatsInstitutionRepository } from "./repository/stats.institution.repository";

/**
 * Command to actualize statistics for all institutions
 */
@Injectable()
export class StatsActualizeCommand {
  constructor(
        private readonly credentialsRepository: CredentialsRepository,
        private readonly institutionRepository: InstitutionRepository,
        private readonly statsInstitutionRepository: StatsInstitutionRepository,
        private readonly credentialSharesRepository: CredentialsShareRepository,
        private readonly prisma: PrismaService,
  ) {}

    @Command({
      command: "stats:actualize",
      describe: "Actualize statistics for institutions",
    })
  async actualize(): Promise<void> {
    Logger.debug(`Actualizing statistics for all institutions...`);
    const institutions: Institution[] = await this.institutionRepository.getAll();

    for (const institution of institutions) {
      Logger.debug(`Actualizing stats for ${institution.uuid} university...`);
      try {
        const institutionStats = await this.statsInstitutionRepository.getStatsForInstitution(institution.uuid);
        await this.prisma.institutionStats.update({
          data: {
            totalQualifications: 0,
            withdrawnQualifications: 0,
            editedQualifications: 0,
            sharedQualifications: 0,
            deletedQualifications: 0,
            activatedQualifications: 0,
          },
          where: { id: institutionStats.id },
        });
      } catch (e) {
        if (e instanceof InstitutionStatsNotFoundException) {
          await this.prisma.institutionStats.create({ data: { institutionUuid: institution.uuid } });
        }
        Logger.error(e);
      }

      const [ total, allCredentialsWithChanges ]: [ number, CredentialsWithCredentialChange[] ] = await this.credentialsRepository.getAllForInstitutionStats(institution.uuid);

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

      await this.prisma.institutionStats.update({
        data: {
          totalQualifications: totalQualifications,
          withdrawnQualifications: withdrawnQualifications,
          editedQualifications: editedQualifications,
          sharedQualifications: sharedQualifications,
          deletedQualifications: deletedQualifications,
          activatedQualifications: activatedQualifications,
          qualificationNames: qualificationNames,
        },
        where: { institutionUuid: institution.uuid },
      });

      Logger.debug(`Final stats for institution ${institution.uuid}, qualification total: ${totalQualifications}, activated: ${activatedQualifications}, withdrawn: ${withdrawnQualifications}, edited: ${editedQualifications}, shared: ${sharedQualifications}, deleted: ${deletedQualifications}.`);
    }
  }
}
