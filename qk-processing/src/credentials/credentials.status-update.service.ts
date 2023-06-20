import { Injectable, Logger, PreconditionFailedException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Credential, CredentialStatus } from "@prisma/client";

import { CredentialsNotFoundException } from "../common/exception";
import { PrismaService } from "../prisma/prisma.service";
import { CredentialsActivatedEvent } from "./event";

/**
 * Class for updating credentials statuses
 */
@Injectable()
export class CredentialsStatusUpdateService {
  constructor(
        private readonly prisma: PrismaService,
        private eventEmitter: EventEmitter2,
  ) {
  }

  public async toActivated(uuid: string): Promise<void> {
    const credentials = await this.prisma.credential.findUnique({
      where: { uuid: uuid },
      include: { student: true },
    });

    if (null === credentials) {
      throw new CredentialsNotFoundException(uuid);
    }

    if (credentials.status !== CredentialStatus.UPLOADED_TO_BLOCKCHAIN) {
      Logger.warn("Wrong credentials status");
      return;
    }

    await this.prisma.credential.update({
      data: { status: CredentialStatus.ACTIVATED },
      where: { uuid: uuid },
    });

    Logger.debug(`Credentials ${uuid} status changed to ACTIVATED`);

    const credentialsActivatedEvent = new CredentialsActivatedEvent();
    credentialsActivatedEvent.credentials = credentials;
    credentialsActivatedEvent.student = credentials.student;
    this.eventEmitter.emit("credentials.activated", credentialsActivatedEvent);
  }

  public async toUploadingToBlockchain(credentials: Credential): Promise<Credential> {
    if (credentials.status !== CredentialStatus.NEW) {
      throw new PreconditionFailedException("Wrong status, unable to change status to UPLOADING_TO_BLOCKCHAIN");
    }
    return await this.prisma.credential.update({
      data: { status: CredentialStatus.UPLOADING_TO_BLOCKCHAIN },
      where: { uuid: credentials.uuid },
    });
  }

  public async toFailedUploadingToBlockchain(credentials: Credential): Promise<Credential> {
    if (credentials.status !== CredentialStatus.UPLOADING_TO_BLOCKCHAIN) {
      throw new PreconditionFailedException("Wrong status, unable to change status to FAILED_UPLOADING_TO_BLOCKCHAIN");
    }
    return await this.prisma.credential.update({
      data: { status: CredentialStatus.FAILED_UPLOADING_TO_BLOCKCHAIN },
      where: { uuid: credentials.uuid },
    });
  }

  public async toUploadedToBlockchain(credentials: Credential): Promise<Credential> {
    if (credentials.status === CredentialStatus.UPLOADING_TO_BLOCKCHAIN || credentials.status === CredentialStatus.FAILED_UPLOADING_TO_BLOCKCHAIN) {
      return await this.prisma.credential.update({
        data: { status: CredentialStatus.UPLOADED_TO_BLOCKCHAIN },
        where: { uuid: credentials.uuid },
      });
    }

    throw new PreconditionFailedException(`Wrong status ${credentials.status}, unable to change status to UPLOADED_TO_BLOCKCHAIN`);
  }

  public async toWithdrawn(credentials: Credential): Promise<Credential> {
    return await this.prisma.credential.update({
      data: { status: CredentialStatus.WITHDRAWN },
      where: { uuid: credentials.uuid },
    });
  }

  public async toExpired(credentials: Credential): Promise<Credential> {
    return await this.prisma.credential.update({
      data: { status: CredentialStatus.EXPIRED },
      where: { uuid: credentials.uuid },
    });
  }
}