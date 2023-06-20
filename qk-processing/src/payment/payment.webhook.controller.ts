import { Controller, Post, Headers, BadRequestException, Body, Logger } from "@nestjs/common";

import { PaymentStripeEventProcessor } from "./payment-stripe-event-processor.service";
import { PaymentService } from "./payment.service";

@Controller("payment")
export class PaymentWebhookController {
  constructor(
        private paymentService: PaymentService,
        private eventProcessor: PaymentStripeEventProcessor,
  ) {
  }

    /**
     * Handle successful callback for checkout
     */
    @Post("webhook")
  async handleIncomingWebhooks(
        @Headers("stripe-signature") signature: string,
        @Body() raw: Buffer,
  ): Promise<void> {
    if (!signature) {
      throw new BadRequestException("Missing stripe-signature header");
    }
    const event = this.paymentService.constructEventFromPayload(signature, raw);

    Logger.log(`Stripe webhook received: ${event.type}, ${event.id}`);

    await this.eventProcessor.processEvent(event);
  }
}
