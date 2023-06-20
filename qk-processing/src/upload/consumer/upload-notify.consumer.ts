import { OnQueueActive, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";

import { EmailService } from "../../email/email.service";

@Processor("upload-notify")
export class UploadNotifyConsumer {
  constructor(
      private emailService: EmailService,
  ) {
  }

    @Process("pending")
  async handlePending(job: Job): Promise<void> {
    Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
    Logger.debug(`Sending notification to ${job.data.representativeEmail}`);
    try {
      await this.emailService.sendReviewUploadEmail(job.data.representativeEmail, job.data.representativeFullName);
    } catch (err) {
      Logger.error(err, err.stack);
      return;
    }
    await job.moveToCompleted();
  }

    @Process("approved")
    async handleApproved(job: Job): Promise<void> {
      Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
      Logger.debug(`Sending notification to ${job.data.representativeEmail}`);
      try {
        if (job.data.isAuthenticatedBy) {
          await this.emailService.sendUploadApprovedToInitiator(job.data.representativeEmail, job.data.representativeFullName);
        } else {
          await this.emailService.sendUploadApprovedToApprover(job.data.representativeEmail, job.data.representativeFullName);
        }
      } catch (err) {
        Logger.error(err, err.stack);
        return;
      }
      await job.moveToCompleted();
    }

    @Process("rejected")
    async handleRejected(job: Job): Promise<void> {
      Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
      Logger.debug(`Sending notification to ${job.data.representativeEmail}`);
      try {
        await this.emailService.sendUploadRejected(job.data.representativeEmail, job.data.representativeFullName);
      } catch (err) {
        Logger.error(err, err.stack);
        return;
      }
      await job.moveToCompleted();
    }

    @OnQueueActive()
    onActive(job: Job): void {
      Logger.debug(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
    }
}