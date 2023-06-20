import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { CredentialsStatusUpdateService } from "./credentials.status-update.service";
import { CredentialsRepository } from "./repository/credentials.repository";

/**
 * Cron command to change credentials' status to EXPIRED when needed
 */
@Injectable()
export class CredentialsToExpiredWatcher {
  constructor(
        private readonly credentialsRepository: CredentialsRepository,
        private readonly credentialsStatusUpdateService: CredentialsStatusUpdateService,
  ) {
  }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async changeCredentialStatusToExpired(): Promise<void> {
    const credentials = await this.credentialsRepository.getAllNotExpired();
    if (0 === credentials.length) {
      return;
    }

    const date = new Date();

    for (const credential of credentials) {
      if (credential.expiresAt < date) {
        // change status to EXPIRED
        await this.credentialsStatusUpdateService.toExpired(credential);
        Logger.debug(`Changing ${credential.uuid} credentials status to EXPIRED, expiry date ${credential.expiresAt.toISOString()}`);
      }
      //TODO: add notification
    }
  }
}
