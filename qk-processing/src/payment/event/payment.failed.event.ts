import { Payment, User } from "@prisma/client";

export class PaymentFailedEvent {
  payment: Payment;
  student: User;
}