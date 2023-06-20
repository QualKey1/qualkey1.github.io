import { InjectQueue, OnQueueActive, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { User, UserStatus } from "@prisma/client";
import { Job, Queue } from "bull";

import { HederaService } from "../../hedera/hedera.service";
import { StatsIncrementerService } from "../../stats/stats.incrementer.service";
import { UserFactory } from "../../user/user.factory";
import { UserRepository } from "../../user/user.repository";
import { CredentialsService } from "../credentials.service";
import { CredentialsHashableDataDto, CredentialsDataDto } from "../dto";
import { CredentialsChangeFactory } from "../factory/credentials-change.factory";
import { CredentialsFactory } from "../factory/credentials.factory";
import { Hasher } from "../helper/hasher";
import { CredentialsChangeRepository } from "../repository/credentials-change.repository";

@Processor("credentials-create")
export class CredentialsCreateConsumer {
  constructor(
    @InjectQueue("credentials-notify") private credentialsNotifyQueue: Queue,
    private readonly hederaService: HederaService,
    private readonly credentialsService: CredentialsService,
    private readonly userFactory: UserFactory,
    private readonly userRepository: UserRepository,
    private readonly credentialsFactory: CredentialsFactory,
    private readonly credentialsChangeFactory: CredentialsChangeFactory,
    private readonly credentialsChangeRepository: CredentialsChangeRepository,
    private readonly statsIncrementerService: StatsIncrementerService,
  ) {
  }

    @Process({ name: "create", concurrency: 1 })
  async handleCreate(job: Job): Promise<void> {
    Logger.debug(`Handling job ${job.id} of type ${job.name}...`);
    const dto: CredentialsDataDto = job.data.credentialDataDto;

    try {
      const dataHash = Hasher.hash(JSON.stringify(CredentialsHashableDataDto.fromCredentialsData(dto)));

      // check if credentialChange has such hash
      if (await this.credentialsChangeRepository.hasHash(dataHash)) {
        // if yes - warn and stop creating credentials
        Logger.warn(`CredentialsChange with hash ${dataHash} already exists ${dto.email} ${dto.graduatedName}`);
        await job.moveToCompleted();
        return;
      }

      // check if user exists
      let user: User;
      if (await this.userRepository.has(dto.email)) {
        user = await this.userRepository.get(dto.email);
        // if user has not ACTIVE status - abort creation
        if (user.status !== UserStatus.ACTIVE) {
          Logger.debug(`User with email has status - ${user.status}, ABORT credentials creation.`);
          await job.moveToCompleted();
          return;
        }

        Logger.debug(`User with email - ${dto.email} already exists`);
      } else {
        Logger.debug(`User with email - ${dto.email} does not exists, creating...`);
        user = await this.userFactory.createStudent(dto.email, dto.graduatedName, dto.awardingInstitution);
        Logger.debug(`User created - ${dto.email}`);
      }

      // create credentials and credentialsChange
      const credentials = await this.credentialsFactory.create(dto, user, job.data.uploadUuid);
      Logger.debug(`Credentials created - ${credentials.uuid}`);
      await this.statsIncrementerService.incrementTotalQualifications(dto.institutionUuid);

      const credentialsChange = await this.credentialsChangeFactory.create(credentials, dataHash);
      Logger.debug(`CredentialsChange created - ${credentialsChange.id}`);
    } catch (err) {
      Logger.error(err, err.stack);
    }
    await job.moveToCompleted();
  }

    @OnQueueActive()
    onActive(job: Job): void {
      Logger.debug(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
    }
}