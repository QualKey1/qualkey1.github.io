import { IsOptional, IsString, IsNotEmpty } from "class-validator";

/**
 * Data Transfer Object with GET credentials shares request data
 */
export class CredentialsGetSharesRequestDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
  public readonly credentialUuid?: string = null;
}