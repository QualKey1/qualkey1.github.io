import { IsString, IsNotEmpty } from "class-validator";

/**
 * Data Transfer Object with info email details
 */
export class SendInfoEmailDto {
    @IsString()
    @IsNotEmpty()
  public readonly senderEmail: string;

    @IsString()
    @IsNotEmpty()
    public readonly subject: string;

    @IsString()
    @IsNotEmpty()
    public readonly emailText: string;
}