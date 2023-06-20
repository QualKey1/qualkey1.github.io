import { IsEmail, IsNotEmpty, IsString } from "class-validator";

/**
 * Data Transfer Object of the Check Credentials Request
 */
export class AuthCheckCredentialsRequestDto {
    @IsEmail()
    @IsNotEmpty()
      email: string;

    @IsString()
    @IsNotEmpty()
      password: string;
}