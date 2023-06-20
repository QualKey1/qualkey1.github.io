import { IsEmail, IsNotEmpty } from "class-validator";

/**
 * Data Transfer Object of the Forgot Password Request
 */
export class ForgotPasswordRequestDto {
    @IsEmail()
    @IsNotEmpty()
      email: string;
}
