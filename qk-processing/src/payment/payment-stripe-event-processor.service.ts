import { Injectable, Logger } from "@nestjs/common";
import Stripe from "stripe";

import { PrismaService } from "../prisma/prisma.service";
import { PaymentStatusUpdateService } from "./payment.status-update.service";

@Injectable()
export class PaymentStripeEventProcessor {
  constructor(
        private readonly prisma: PrismaService,
        private readonly paymentStatusUpdateService: PaymentStatusUpdateService,
  ) {
  }

  public async processEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
    case "payment_intent.created":
      break;
    case "customer.created":
      Logger.debug(`Adding stripe customer id to user ${event.data.object["email"]}`);

      await this.prisma.user.update({
        data: { stripeCustomerId: event.data.object["id"] },
        where: { email: event.data.object["email"] },
      });
      break;
    case "charge.succeeded":
      break;
    case "charge.failed":
      break;
    case "checkout.session.completed":
      await this.paymentStatusUpdateService.toCompleted(event.data.object["client_reference_id"]);

      break;
    case "checkout.session.expired":
      await this.paymentStatusUpdateService.toFailed(event.data.object["client_reference_id"]);
      break;
    }
  }
}