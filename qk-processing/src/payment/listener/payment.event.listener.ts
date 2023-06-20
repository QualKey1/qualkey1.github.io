import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { CredentialsStatusUpdateService } from "../../credentials/credentials.status-update.service";
import { StatsIncrementerService } from "../../stats/stats.incrementer.service";
import { PaymentCompletedEvent, PaymentFailedEvent } from "../event";

/**
 * Handler for all events regarding payments
 */
@Injectable()
export class PaymentEventListener {
  constructor(
        private readonly credentialsStatusUpdateService: CredentialsStatusUpdateService,
        private readonly statsIncrementerService: StatsIncrementerService,
  ) {
  }

    @OnEvent("payment.failed")
  async handlePaymentFailedEvent(event: PaymentFailedEvent): Promise<void> {
    Logger.debug(`payment FAILED ${event.payment.uuid}`);
  }

    @OnEvent("payment.completed")
    async handlePaymentCompletedEvent(event: PaymentCompletedEvent): Promise<void> {
      Logger.debug(`payment COMPLETED ${event.payment.uuid}`);

      // Change credentials Status to activated
      for (const credentialsUuid of event.payment.credentialUuids) {
        await this.credentialsStatusUpdateService.toActivated(credentialsUuid);
        await this.statsIncrementerService.incrementActivatedQualifications;
      }
    }
}