import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

/**
 * Data Transfer Object with CredentialChange GET request data
 */
export class CredentialsChangeGetRequestDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
  public readonly id: number;
}