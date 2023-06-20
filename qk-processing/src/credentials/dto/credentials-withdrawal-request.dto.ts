import { IsNotEmpty, IsString } from "class-validator";

/**
 * Data Transfer Object with request data for credentials withdrawal
 */
export class CredentialsWithdrawalRequestDto {
    @IsString()
    @IsNotEmpty()
      uuid: string;
}