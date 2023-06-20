import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Logger, PreconditionFailedException } from "@nestjs/common";
import { CredentialStatus, Credential, CredentialChange } from "@prisma/client";
import { Job, Queue } from "bull";

import { HederaService } from "../../hedera/hedera.service";
import { UserRepository } from "../../user/user.repository";
import { CredentialsService } from "../credentials.service";
import { CredentialsStatusUpdateService } from "../credentials.status-update.service";

@Processor("credentials-upload")
export class CredentialsUploadToHederaConsumer {
  constructor(
        @InjectQueue("credentials-notify") private credentialsNotifyQueue: Queue,
        private hederaService: HederaService,
        private credentialsService: CredentialsService,
        private userRepository: UserRepository,
        private readonly credentialsStatusUpdateService: CredentialsStatusUpdateService,
  ) {
  }

    @Process({ name: "upload", concurrency: 1 })
  async handleUpload(job: Job): Promise<void> {
    Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
    try {
      const credential: Credential = job.data.credential;
      const credentialChange: CredentialChange = job.data.credentialChange;

      if (credential.status !== CredentialStatus.UPLOADING_TO_BLOCKCHAIN) {
        throw new PreconditionFailedException(`Wrong status, unable to upload to hedera credentials: ${credential.uuid}`);
      }

      // save to SC
      await this.hederaService.writeCredentialChangeToSmartContract(credentialChange);
      Logger.debug(`CredentialChange saved to smart contract - ${credentialChange.id}`);

      // change status to UPLOADED_TO_BLOCKCHAIN
      await this.credentialsStatusUpdateService.toUploadedToBlockchain(credential);

      const student = await this.userRepository.getByUuid(credential.studentUuid);
      // Notify student
      await this.credentialsNotifyQueue.add("credentials-uploaded", {
        recipientEmail: student.email,
        recipientFullName: student.fullName,
        credentialUuid: credential.uuid,
      });
    } catch (err) {
      Logger.error(err, err.stack);
    }
    await job.moveToCompleted();
  }
}
