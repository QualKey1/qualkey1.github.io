import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { AwsModule } from "../aws/aws.module";
import { EmailModule } from "../email/email.module";
import { HederaModule } from "../hedera/hedera.module";
import { InstitutionModule } from "../institution/institution.module";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { StatsInstitutionRepository } from "../stats/repository/stats.institution.repository";
import { StatsIncrementerService } from "../stats/stats.incrementer.service";
import { StatsModule } from "../stats/stats.module";
import { UploadModule } from "../upload/upload.module";
import { UserModule } from "../user/user.module";
import { CredentialsNotifyConsumer } from "./consumer/credentials-notify.consumer";
import { CredentialsCreateConsumer } from "./consumer/credentials.create.consumer";
import { CredentialsUploadToHederaConsumer } from "./consumer/credentials.upload-to-hedera.consumer";
import { CredentialsChangeService } from "./credentials-change.service";
import { CredentialsShareService } from "./credentials-share.service";
import { CredentialsChangeRequestService } from "./credentials.change-request.service";
import { CredentialsController } from "./credentials.controller";
import { CredentialsDeleteService } from "./credentials.delete.service";
import { CredentialsPublicController } from "./credentials.public.controller";
import { CredentialsService } from "./credentials.service";
import { CredentialsStatusUpdateService } from "./credentials.status-update.service";
import { CredentialsToExpiredWatcher } from "./credentials.to-expired.watcher";
import { CredentialsUploadToHederaWatcher } from "./credentials.upload-to-hedera.watcher";
import { CredentialsChangeFactory } from "./factory/credentials-change.factory";
import { CredentialsShareFactory } from "./factory/credentials-share.factory";
import { CredentialsWithdrawalRequestFactory } from "./factory/credentials-withdrawal-request.factory";
import { CredentialsFactory } from "./factory/credentials.factory";
import { CredentialsPublicViewDtoFactory } from "./factory/credentials.public-view-dto.factory";
import { CredentialsEventListener } from "./listener/credentials.event.listener";
import { CredentialsChangeRepository } from "./repository/credentials-change.repository";
import { CredentialsShareRepository } from "./repository/credentials-share.repository";
import { CredentialsChangeRequestRepository } from "./repository/credentials.change-request.repository";
import { CredentialsRepository } from "./repository/credentials.repository";
import { CredentialsWithdrawalRequestRepository } from "./repository/credentials.withdrawal-request.repository";
import { IsEmailArrayConstraint } from "./validator/is-email-array.constraint";

@Module({
  imports: [
    HederaModule,
    PrismaModule,
    UploadModule,
    InstitutionModule,
    UserModule,
    AwsModule,
    EmailModule,
    StatsModule,
    BullModule.registerQueue({
      name: "credentials-notify",
      limiter: {
        max: 1000,
        duration: 1000,
      },
      defaultJobOptions: {
        attempts: 10,
        backoff: {
          type: "exponential",
          delay: 100000,
        },
      },
      settings: { retryProcessDelay: 300 },
    }),
    BullModule.registerQueue({
      name: "credentials-upload",
      limiter: {
        max: 1000,
        duration: 1000,
      },
      defaultJobOptions: {
        attempts: 10,
        backoff: {
          type: "exponential",
          delay: 100000,
        },
      },
      settings: { retryProcessDelay: 300 },
    }),
  ],
  controllers: [CredentialsController, CredentialsPublicController],
  exports: [
    CredentialsService,
    CredentialsRepository,
    CredentialsChangeService,
    CredentialsChangeRequestService,
    CredentialsChangeRepository,
    CredentialsStatusUpdateService,
    CredentialsShareRepository,
    CredentialsDeleteService,
  ],
  providers: [
    CredentialsService,
    CredentialsRepository,
    CredentialsChangeRepository,
    CredentialsFactory,
    CredentialsChangeFactory,
    PrismaService,
    CredentialsCreateConsumer,
    CredentialsChangeService,
    CredentialsEventListener,
    CredentialsNotifyConsumer,
    CredentialsWithdrawalRequestRepository,
    CredentialsWithdrawalRequestFactory,
    CredentialsShareRepository,
    IsEmailArrayConstraint,
    CredentialsShareService,
    CredentialsShareFactory,
    CredentialsStatusUpdateService,
    CredentialsChangeRequestRepository,
    CredentialsChangeRequestService,
    CredentialsPublicViewDtoFactory,
    CredentialsUploadToHederaConsumer,
    CredentialsUploadToHederaWatcher,
    CredentialsToExpiredWatcher,
    StatsIncrementerService,
    StatsInstitutionRepository,
    CredentialsDeleteService,
  ],
})
export class CredentialsModule {}
