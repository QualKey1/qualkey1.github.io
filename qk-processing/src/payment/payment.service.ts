import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User, Credential, CredentialStatus } from "@prisma/client";
import { InjectStripe } from "nestjs-stripe";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

import { CredentialsNotFoundException } from "../common/exception";
import { CredentialsRepository } from "../credentials/repository/credentials.repository";
import { PrismaService } from "../prisma/prisma.service";
import { SettingsService } from "../settings/settings.service";
import { PaymentCheckoutDto } from "./dto";

/**
 * Class for handling checkout and activation of credentials
 */
@Injectable()
export class PaymentService {
  public constructor(
        @InjectStripe() private readonly stripe: Stripe,
        private readonly config: ConfigService,
        private readonly settings: SettingsService,
        private readonly credentialsRepository: CredentialsRepository,
        private readonly prisma: PrismaService,
  ) {}

  /**
   * Create new checkout session to pay for credentials
   */
  public async createCheckoutSession(user: User, dto: PaymentCheckoutDto): Promise<string> {
    //  Check credentials and that they belong to the correct user
    const credentials = await this.checkCredentials(user, dto.credentialUuids);
    const uuid = uuidv4();
    Logger.log(`Creating stripe checkout session for student ${user.uuid}`);

    const customerExists = user.stripeCustomerId !== null;
    // Create stripe checkout session
    const session = await this.stripe.checkout.sessions.create({
      customer_email: customerExists ? undefined : user.email,
      client_reference_id: uuid,
      customer: customerExists ? user.stripeCustomerId : undefined,
      line_items: [{
        price: await this.settings.get("credentials.price." + user.currency.toLowerCase()),
        quantity: credentials.length,
      }],
      payment_method_types: ["card"],
      mode: "payment",
      success_url: this.config.get("FRONTEND_URL") + "/payment/success",
      cancel_url: this.config.get("FRONTEND_URL") + "/payment/cancel",
    });
    Logger.log(`Checkout session created: ${session.id}`);
    // Create Payment and save it to DB
    await this.prisma.payment.create({
      data: {
        uuid: uuid,
        externalId: session.id,
        studentUuid: user.uuid,
        amount: session.amount_total,
        currency: user.currency,
        method: session.payment_method_types[0],
        credentialUuids: dto.credentialUuids,
      },
    });

    return session.url;
  }

  /**
   * Create event from the webhook payload
   */
  public constructEventFromPayload(signature: string, payload: Buffer): Stripe.Event {
    const webhookSecret = this.config.get("STRIPE_WEBHOOK_SECRET");

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }

  /**
   * Check that credentials are valid for checkout
   */
  private async checkCredentials(user: User, credentialUuids: string[]): Promise<Credential[]> {
    const credentials: Credential[] = [];
    for (const uuid of credentialUuids) {
      const credential = await this.prisma.credential.findUnique({ where: { uuid: uuid } });

      if (null === credential) throw new CredentialsNotFoundException(uuid);
      // Check that credentials belong to the user
      if (user.uuid !== credential.studentUuid) {
        throw new ForbiddenException("You can activate only your own credentials");
      }
      if (credential.status !== CredentialStatus.UPLOADED_TO_BLOCKCHAIN) {
        throw new ForbiddenException("It is possible to activate only those credentials, which were uploaded to Hedera");
      }

      credentials.push(credential);
    }

    return credentials;
  }
}
