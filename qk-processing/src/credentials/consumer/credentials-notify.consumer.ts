import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";

import { EmailService } from "../../email/email.service";
import { UserRepository } from "../../user/user.repository";

@Processor("credentials-notify")
export class CredentialsNotifyConsumer {
  constructor(
      private readonly emailService: EmailService,
      private readonly userRepository: UserRepository,
  ) {
  }

  @Process("withdrawal-approved")
  async handleWithdrawalApproved(job: Job): Promise<void> {
    Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
    Logger.debug(`Sending notification to ${job.data.representativeEmail}`);
    try {
      if (job.data.isRequestedBy) {
        await this.emailService.sendWithdrawalApprovedToInitiatorEmail(job.data.representativeEmail, job.data.representativeFullName, job.data.credentialUuid);
      } else {
        await this.emailService.sendWithdrawalApprovedEmail(job.data.representativeEmail, job.data.representativeFullName, job.data.credentialUuid);
      }
    } catch (err) {
      Logger.error(err, err.stack);
      return;
    }
    await job.moveToCompleted();
  }

  @Process("withdrawal-rejected")
  async handleWithdrawalRejected(job: Job): Promise<void> {
    Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
    Logger.debug(`Sending notification to ${job.data.representativeEmail}`);
    try {
      if (job.data.isRequestedBy) {
        await this.emailService.sendWithdrawalRejectedToInitiatorEmail(job.data.representativeEmail, job.data.representativeFullName, job.data.credentialUuid);
      } else {
        await this.emailService.sendWithdrawalRejectedEmail(job.data.representativeEmail, job.data.representativeFullName, job.data.credentialUuid);
      }
    } catch (err) {
      Logger.error(err, err.stack);
      return;
    }
    await job.moveToCompleted();
  }

  @Process("withdrawal-request-created")
  async handleWithdrawalRequestCreated(job: Job): Promise<void> {
    Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
    Logger.debug(`Sending notification to ${job.data.representativeEmail}`);
    try {
      await this.emailService.sendReviewWithdrawalEmail(job.data.representativeEmail, job.data.representativeFullName, job.data.credentialUuid);
    } catch (err) {
      Logger.error(err, err.stack);
      return;
    }
    await job.moveToCompleted();
  }

  @Process("credentials-share")
  async handleCredentialsShare(job: Job): Promise<void> {
    Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
    Logger.debug(`Sending notification to ${job.data.recipientEmail} with temporaryPassword: ${job.data.temporaryPassword}`);
    try {
      if (job.data.isPublic && null !== job.data.did) {
        await this.emailService.sendShareOneCredential(
          job.data.recipientEmail,
          job.data.did,
          job.data.recipientName,
          job.data.studentName,
        );
      } else {
        await this.emailService.sendShareCredentials(
          job.data.recipientEmail,
          job.data.temporaryPassword,
          job.data.recipientName,
          job.data.studentName,
          new Date(job.data.expiresAt),
          job.data.shareUuid,
        );
      }
    } catch (err) {
      Logger.error(err, err.stack);
      return;
    }
    await job.moveToCompleted();
  }

  @Process("credentials-activated")
  async handleCredentialsActivated(job: Job): Promise<void> {
    Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
    Logger.debug(`Sending notification to ${job.data.studentEmail}`);
    try {
      await this.emailService.sendCredentialsActivated(job.data.studentEmail, job.data.studentName);
    } catch (err) {
      Logger.error(err, err.stack);
      return;
    }
    await job.moveToCompleted();
  }

  @Process("credentials-deleted")
  async handleCredentialsDeleted(job: Job): Promise<void> {
    Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
    Logger.debug(`Sending notification to ${job.data.studentEmail}`);
    try {
      await this.emailService.sendCredentialsDeleted(job.data.studentEmail, job.data.studentName, job.data.qualificationName);
    } catch (err) {
      Logger.error(err, err.stack);
      return;
    }
    await job.moveToCompleted();
  }

  @Process("credentials-changed-representative")
  async handleCredentialsChangedRepresentative(job: Job): Promise<void> {
    Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
    Logger.debug(`Sending notification to ${job.data.recipientEmail}`);
    try {
      await this.emailService.sendCredentialsChangedRepresentative(
        job.data.recipientEmail,
        job.data.recipientFullName,
        job.data.credentialUuid,
      );
    } catch (err) {
      Logger.error(err, err.stack);
      return;
    }
    await job.moveToCompleted();
  }

  @Process("credentials-changed-student")
  async handleCredentialsChangedStudent(job: Job): Promise<void> {
    Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
    Logger.debug(`Sending notification to ${job.data.recipientEmail}`);
    try {
      await this.emailService.sendCredentialsChangedStudent(
        job.data.recipientEmail,
        job.data.recipientFullName,
        job.data.institutionName,
        job.data.credentialUuid,
      );
    } catch (err) {
      Logger.error(err, err.stack);
      return;
    }
    await job.moveToCompleted();
  }

  @Process("credentials-withdrawn-student")
  async handleCredentialsWithdrawnStudent(job: Job): Promise<void> {
    Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
    Logger.debug(`Sending notification to ${job.data.recipientEmail}`);
    try {
      await this.emailService.sendCredentialsWithdrawnStudent(
        job.data.recipientEmail,
        job.data.recipientFullName,
        job.data.institutionName,
      );
    } catch (err) {
      Logger.error(err, err.stack);
      return;
    }
    await job.moveToCompleted();
  }

  @Process("credentials-uploaded")
  async handleCredentialsUploaded(job: Job): Promise<void> {
    Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
    Logger.debug(`Sending notification to ${job.data.recipientEmail}`);
    try {
      await this.emailService.sendCredentialsUploaded(
        job.data.recipientEmail,
        job.data.recipientFullName,
        job.data.credentialUuid,
      );
    } catch (err) {
      Logger.error(err, err.stack);
      return;
    }
    await job.moveToCompleted();
  }

  @Process("credentials-manipulated")
  async handleCredentialsManipulated(job: Job): Promise<void> {
    Logger.debug(`Handling job ${job.id} of type ${job.name}...`);

    const admins = await this.userRepository.getActiveAdmins();

    for (const admin of admins) {
      Logger.debug(`Sending notification to ${admin.email}`);
      try {
        await this.emailService.sendCredentialsManipulated(
          admin.email,
          admin.fullName,
          job.data.institutionName,
          job.data.credentialUuid,
        );
      } catch (err) {
        Logger.error(err, err.stack);
        return;
      }
    }

    await job.moveToCompleted();
  }
}