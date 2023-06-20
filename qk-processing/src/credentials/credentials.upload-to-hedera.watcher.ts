import { InjectQueue } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Queue } from "bull";

import { CredentialsWithCredentialChange } from "../common/types/credentials/credentials-with-credential-change.type";
import { HederaService } from "../hedera/hedera.service";
import { PrismaService } from "../prisma/prisma.service";
import { CredentialsStatusUpdateService } from "./credentials.status-update.service";
import { CredentialsRepository } from "./repository/credentials.repository";

/**
 * Cron command to get new credentials and upload them to hedera
 */
@Injectable()
export class CredentialsUploadToHederaWatcher {
  constructor(
        @InjectQueue("credentials-upload") private credentialsUploadQueue: Queue,
        private readonly prisma: PrismaService,
        private readonly hedera: HederaService,
        private readonly credentialsRepository: CredentialsRepository,
        private readonly credentialsStatusUpdateService: CredentialsStatusUpdateService,
  ) {
  }

    @Cron(CronExpression.EVERY_MINUTE)
  async uploadCredentialsToSmartContract(): Promise<void> {
    const newCredentials: CredentialsWithCredentialChange = await this.credentialsRepository.getAllNewCredentials();
    if (0 === newCredentials.length) {
      return;
    }

    for (const credentials of newCredentials) {
      const credentialChange = credentials.credentialChanges[0];
      // change status to UPLOADING_TO_BLOCKCHAIN
      const credential = await this.credentialsStatusUpdateService.toUploadingToBlockchain(credentials);
      Logger.debug(`INITIAL UPLOAD: Dispatching credentialsUploadMessage ${credential.uuid}`);
      await this.credentialsUploadQueue.add("upload", { credential: credential, credentialChange: credentialChange });
    }
  }

    @Cron(CronExpression.EVERY_MINUTE)
    async uploadRetryCredentialsToSmartContract(): Promise<void> {
      const newCredentials: CredentialsWithCredentialChange = await this.credentialsRepository.getAllUploadingToBlockchainCredentials();
      if (0 === newCredentials.length) {
        return;
      }

      for (const credentials of newCredentials) {
        const credentialChange = credentials.credentialChanges[0];
        Logger.debug(`RETRY UPLOAD: Dispatching credentialsUploadMessage ${credentials.uuid}`);
        await this.credentialsUploadQueue.add("upload", { credential: credentials, credentialChange: credentialChange });
      }
    }
}
