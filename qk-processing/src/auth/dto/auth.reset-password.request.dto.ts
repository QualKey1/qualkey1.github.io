import { IsNotEmpty, IsString } from "class-validator";

/**
 * Data Transfer Object of the Reset Password Request
 */
export class ResetPasswordRequestDto {
    @IsString()
    @IsNotEmpty()
      oldPassword: string;

    @IsString()
    @IsNotEmpty()
      newPassword: string;
}
