import { Module } from "@nestjs/common";

import { CredentialsStatusUpdateService } from "../credentials/credentials.status-update.service";
import { CredentialsRepository } from "../credentials/repository/credentials.repository";
import { SettingsService } from "../settings/settings.service";
import { StatsInstitutionRepository } from "../stats/repository/stats.institution.repository";
import { StatsIncrementerService } from "../stats/stats.incrementer.service";
import { StatsModule } from "../stats/stats.module";
import { PaymentEventListener } from "./listener/payment.event.listener";
import { PaymentStripeEventProcessor } from "./payment-stripe-event-processor.service";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { PaymentStatusUpdateService } from "./payment.status-update.service";
import { PaymentWebhookController } from "./payment.webhook.controller";

@Module({
  controllers: [PaymentController, PaymentWebhookController],
  imports: [StatsModule],
  providers: [
    PaymentService,
    CredentialsRepository,
    SettingsService,
    PaymentStripeEventProcessor,
    PaymentStatusUpdateService,
    PaymentEventListener,
    CredentialsStatusUpdateService,
    StatsIncrementerService,
    StatsInstitutionRepository,
  ],
})
export class PaymentModule {}
