import { Payment, User } from "@prisma/client";

export class PaymentCompletedEvent {
  payment: Payment;
  student: User;
}