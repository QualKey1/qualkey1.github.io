import { InjectQueue } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { CredentialShare, Credential, User } from "@prisma/client";
import { Queue } from "bull";

import { StatsIncrementerService } from "../stats/stats.incrementer.service";
import { CredentialsShareRequestDto } from "./dto";
import { CredentialsShareFactory } from "./factory/credentials-share.factory";
import { CredentialsShareRepository } from "./repository/credentials-share.repository";

@Injectable()
export class CredentialsShareService {
  constructor(
      @InjectQueue("credentials-notify") private credentialsNotifyQueue: Queue,
      private readonly credentialsShareFactory: CredentialsShareFactory,
      private readonly credentialsShareRepository: CredentialsShareRepository,
      private readonly statsIncrementerService: StatsIncrementerService,
  ) {
  }

  /**
   * Process credentials share
   */
  public async processCredentialsShare(dto: CredentialsShareRequestDto, credentialsList: Credential[], user: User): Promise<CredentialShare> {
    const credentialsShare = await this.credentialsShareFactory.create(dto, credentialsList);

    // Increment the amount of shares for the institution if qualification has not been shared before
    for (const credential of credentialsList) {
      const totalSharesForCredentials = await this.credentialsShareRepository.findAllByCredentialUuid(credential.uuid);
      if (0 === totalSharesForCredentials.length || null === totalSharesForCredentials.length) {
        await this.statsIncrementerService.incrementSharedQualifications(credential.institutionUuid);
      }
    }

    if (0 !== dto.recipientEmails.length) {
      // Send email with credentials share to recipients
      dto.recipientEmails.forEach((recipientEmail: string) => {
        Logger.debug(`Dispatching credential share email to: ${recipientEmail}`);
        this.credentialsNotifyQueue.add("credentials-share", {
          recipientEmail: recipientEmail,
          recipientName: dto.recipientName,
          temporaryPassword: credentialsShare.temporaryPassword,
          studentName: user.fullName,
          expiresAt: credentialsShare.expiresAt,
          shareUuid: credentialsShare.uuid,
          isPublic: dto.isPublic,
          did: 1 === credentialsList.length ? credentialsList[0].did : null,
        });
      });
    }

    return credentialsShare;
  }
}