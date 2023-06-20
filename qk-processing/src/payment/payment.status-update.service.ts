import { Injectable, Logger, PreconditionFailedException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PaymentStatus } from "@prisma/client";

import { PaymentNotFoundException } from "../common/exception";
import { PrismaService } from "../prisma/prisma.service";
import { PaymentCompletedEvent, PaymentFailedEvent } from "./event";

/**
 * Class for changing status of the Payment
 */
@Injectable()
export class PaymentStatusUpdateService {
  constructor(
        private readonly prisma: PrismaService,
        private eventEmitter: EventEmitter2,
  ) {
  }

  public async toFailed(uuid: string): Promise<void> {
    try {
      const payment = await this.checkPaymentStatus(uuid, PaymentStatus.FAILED);

      await this.prisma.payment.update({
        data: { status: PaymentStatus.FAILED },
        where: { uuid: uuid },
      });
      Logger.debug(`Payment ${uuid} status changed to FAILED`);

      const paymentFailedEvent = new PaymentFailedEvent();
      paymentFailedEvent.payment = payment;
      paymentFailedEvent.student = payment.student;
      this.eventEmitter.emit("payment.failed", paymentFailedEvent);

    } catch (err) {
      if (err instanceof PreconditionFailedException) return;
      throw err;
    }
  }

  public async toCompleted(uuid: string): Promise<void> {
    try {
      const payment = await this.checkPaymentStatus(uuid, PaymentStatus.COMPLETED);

      await this.prisma.payment.update({
        data: { status: PaymentStatus.COMPLETED },
        where: { uuid: uuid },
      });
      Logger.debug(`Payment ${uuid} status changed to COMPLETED`);

      const paymentCompletedEvent = new PaymentCompletedEvent();
      paymentCompletedEvent.payment = payment;
      paymentCompletedEvent.student = payment.student;
      this.eventEmitter.emit("payment.completed", paymentCompletedEvent);

    } catch (err) {
      if (err instanceof PreconditionFailedException) return;
      throw err;
    }
  }

  private async checkPaymentStatus(uuid: string, status: PaymentStatus): Promise<any> {
    const payment = await this.prisma.payment.findUnique({
      where: { uuid: uuid },
      include: { student: true },
    });

    if (null === payment) {
      throw new PaymentNotFoundException(uuid);
    }

    if (payment.status === status) {
      throw new PreconditionFailedException("Payment status already changed.");
    }

    return payment;
  }
}