import {
  Injectable,
  Logger,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  Credential,
  CredentialStatus,
  User,
} from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { StatsIncrementerService } from "../stats/stats.incrementer.service";
import { CredentialsDeletedEvent } from "./event";

/**
 * Class for deleting credentials
 */
@Injectable()
export class CredentialsDeleteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly statsIncrementerService: StatsIncrementerService,
  ) {
  }

  /**
   * Delete credentials data function
   */
  public async deleteCredentials(user: User, credentials: Credential): Promise<void> {
    Logger.debug(`Processing deletion of the credentials ${credentials.did}`);
    await this.prisma.credential.update({
      data: {
        status: CredentialStatus.DELETED,
        certificateId: null,
        graduatedName: null,
        qualificationName: null,
        majors: null,
        minors: null,
        awardingInstitution: null,
        qualificationLevel: null,
        awardLevel: null,
        studyLanguage: null,
        info: null,
        gpaFinalGrade: null,
        studyStartedAt: null,
        studyEndedAt: null,
        graduatedAt: null,
        expiresAt: null,
        authenticatedAt: null,
        authenticatedBy: null,
        authenticatedTitle: null,
      },
      where: { did: credentials.did },
    });
    Logger.debug(`Credentials data deleted successfully ${credentials.did}`);

    const credentialsDeletedEvent = new CredentialsDeletedEvent();
    credentialsDeletedEvent.credentials = credentials;
    credentialsDeletedEvent.student = user;
    this.eventEmitter.emit("credentials.deleted", credentialsDeletedEvent);
    await this.statsIncrementerService.incrementDeletedQualifications(credentials.institutionUuid);
  }
}
