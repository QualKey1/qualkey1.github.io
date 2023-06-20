import {
  IsEmail,
  IsNotEmpty,
  IsNumberString, IsOptional,
  IsString,
  Length,
} from "class-validator";

/**
 * Data Transfer Object of the Authentication Request,
 * it validates incoming data and helps to move data safely within processing component
 */
export class AuthRequestDto {
    @IsEmail()
    @IsNotEmpty()
      email: string;

    @IsString()
    @IsNotEmpty()
      password: string;

    @IsNumberString()
    @IsNotEmpty()
    @Length(4, 4)
      otp: string;

    @IsString()
    @IsNotEmpty()
      otpUuid: string;

    @IsOptional()
    @IsNotEmpty()
      rememberMe?: boolean = false;
}