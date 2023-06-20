import { IsEmail, IsNotEmpty } from "class-validator";

/**
 * Data Transfer Object of the OneTimePassword Request
 */
export class OtpRequestDto {
    @IsEmail()
    @IsNotEmpty()
      email: string;
}