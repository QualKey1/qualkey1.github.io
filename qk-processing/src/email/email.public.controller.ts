import { Body, Controller, Get, Post, Query } from "@nestjs/common";

import { SendInfoEmailDto } from "./dto";
import { EmailService } from "./email.service";
import { EmailUnsubscribeService } from "./email.unsubscribe-service";

/**
 * Controller for public access and for users sending emails from Qualkey domain
 */
@Controller("email")
export class EmailPublicController {
  constructor(
        private readonly emailUnsubscribeService: EmailUnsubscribeService,
        private readonly emailService: EmailService,
  ) {}

  /**
   * Endpoint for subscribing/unsubscribing from Qualkey emails
   */
  @Get("unsubscribe")
  async unsubscribeFromEmails(
      @Query("email") email: string,
  ): Promise<void> {
    await this.emailUnsubscribeService.unsubscribe(email);
  }

  /**
   * Endpoint for sending info emails to Qualkey from Qualkey domain
   */
  @Post("info")
  async sendInfoEmail(
      @Body() dto: SendInfoEmailDto,
  ): Promise<void> {
    await this.emailService.sendInfoEmail(dto.senderEmail, dto.subject, dto.emailText);
  }
}
