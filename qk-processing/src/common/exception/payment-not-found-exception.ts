import { NotFoundException } from "@nestjs/common";

export class PaymentNotFoundException extends NotFoundException {
  constructor(uuid: string) {
    super(`Payment ${uuid} was not found`);
  }
}