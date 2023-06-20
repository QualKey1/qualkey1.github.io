import { InjectQueue } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { UploadStatus, User } from "@prisma/client";
import { Queue } from "bull";

import { AwsS3Service } from "../../aws/aws.s3.service";
import { CredentialsDataDto } from "../../credentials/dto";
import { PrismaService } from "../../prisma/prisma.service";
import { UserRepository } from "../../user/user.repository";
import { UploadSucceededEvent, UploadFailedEvent, UploadApprovedEvent, UploadRejectedEvent } from "../event";
import { FileParser } from "../parser/file-parser";

/**
 * Handles all events regarding Mass-uploads functionality
 */
@Injectable()
export class UploadEventListener {
  constructor(
      @InjectQueue("upload-notify") private uploadNotifyQueue: Queue,
      @InjectQueue("credentials-create") private credentialsCreateQueue: Queue,
      private eventEmitter: EventEmitter2,
      private awsS3Service: AwsS3Service,
      private prisma: PrismaService,
      private fileParser: FileParser,
      private userRepository: UserRepository,
  ) {
  }

  @OnEvent("upload.failed")
  async handleUploadFailedEvent(event: UploadFailedEvent): Promise<void> {
    Logger.debug(`upload FAILED ${event.filename}`);

    // remove file
    try {
      await this.awsS3Service.remove(event.filename);
      await this.removeUploadFromDB(event.filename.split(".")[0]);
    } catch(err) {
      Logger.error(err, err.stack);
    }
  }

  @OnEvent("upload.succeeded")
  async handleUploadSucceededEvent(event: UploadSucceededEvent): Promise<void> {
    Logger.debug(`upload SUCCEEDED ${event.upload.uuid}`);

    // send notifications to institution representatives
    event.representatives.forEach((user: User) => {
      Logger.debug(`Dispatching ${user.uuid}`);
      this.uploadNotifyQueue.add("pending",{
        representativeUuid: user.uuid,
        representativeEmail: user.email,
        representativeFullName: user.fullName,
      });
    });
  }

  @OnEvent("upload.approved")
  async handleUploadApprovedEvent(event: UploadApprovedEvent): Promise<void> {
    Logger.debug(`upload APPROVED ${event.upload.uuid}`);

    await this.prisma.upload.update({
      data: { status: UploadStatus.APPROVED },
      where: { uuid: event.upload.uuid },
    });
    Logger.debug(`upload status changed to APPROVED ${event.upload.uuid}`);

    if (0 !== event.representatives.length) {
      // Notify representatives about approve
      event.representatives.forEach((user: User) => {
        Logger.debug(`Dispatching ${user.uuid}`);
        this.uploadNotifyQueue.add("approved", {
          representativeUuid: user.uuid,
          representativeEmail: user.email,
          representativeFullName: user.fullName,
          isAuthenticatedBy: user.uuid === event.upload.uploadedBy,
        });
      });
    }

    const authenticatedBy: User = await this.userRepository.getByUuid(event.upload.uploadedBy);

    // parse file into hashable data DTOs
    const credentialDataArray: CredentialsDataDto[] = await this.fileParser
      .parseUpload(
        this.awsS3Service.get(event.upload.filename),
        authenticatedBy,
        event.institution,
        event.upload.mapping.split(","),
        event.upload.filename,
      )
    ;
    Logger.debug(`Upload parsed into DTOs ${event.upload.uuid}`);

    // foreach entry create credentialsCreateMessage with data from entry
    credentialDataArray.forEach(credentialData => {
      Logger.debug(`Dispatching credentialsCreateMessage ${credentialData.graduatedName}`);
      this.credentialsCreateQueue.add("create", { credentialDataDto: credentialData, uploadUuid: event.upload.uuid });
    });
  }

  @OnEvent("upload.rejected")
  async handleUploadRejectedEvent(event: UploadRejectedEvent): Promise<void> {
    Logger.debug(`upload REJECTED ${event.upload.uuid}`);

    await this.prisma.upload.update({
      data: { status: UploadStatus.REJECTED },
      where: { uuid: event.upload.uuid },
    });
    Logger.debug(`upload status changed to REJECTED ${event.upload.uuid}`);

    // Notify representatives about reject
    event.representatives.forEach((user: User) => {
      Logger.debug(`Dispatching ${user.uuid}`);
      this.uploadNotifyQueue.add("rejected",{
        representativeUuid: user.uuid,
        representativeEmail: user.email,
        representativeFullName: user.fullName,
      });
    });

    // remove file
    try {
      await this.awsS3Service.remove(event.upload.filename);
    } catch(err) {
      console.error(err);
    }
  }

  private async removeUploadFromDB(uuid: string): Promise<void> {
    this.prisma.upload.delete({ where: { uuid: uuid } });
    Logger.debug(`upload REMOVED ${uuid}`);
  }
}