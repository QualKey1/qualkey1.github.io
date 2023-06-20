import { Body, Controller, ForbiddenException, Post, UseGuards } from "@nestjs/common";
import { Role, User } from "@prisma/client";

import { GetUser } from "../auth/decorator";
import { JwtGuard } from "../auth/guard";
import { PaymentCheckoutDto } from "./dto";
import { PaymentService } from "./payment.service";

@Controller("payment")
@UseGuards(JwtGuard)
export class PaymentController {
  constructor(
        private paymentService: PaymentService,
  ) {
  }

    /**
     * Post payment endpoint, creates checkout session in Stripe for chosen credentials, returns checkout url
     */
    @Post()
  async postCredentialsShare(
        @GetUser() user: User,
        @Body() dto: PaymentCheckoutDto,
  ): Promise<string> {
    if (user.role !== Role.STUDENT) throw new ForbiddenException();

    return await this.paymentService.createCheckoutSession(user, dto);
  }}
