import { IsArray } from "class-validator";

/**
 * Data transfer object for Payment checkout
 */
export class PaymentCheckoutDto {
  @IsArray()
    credentialUuids: string[]; // array with recipient emails
}