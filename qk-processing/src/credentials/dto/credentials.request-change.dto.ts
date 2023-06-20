import { IsArray, IsNotEmpty, IsString } from "class-validator";

/**
 * Data Transfer Object with CredentialsChangeRequest data
 */
export class CredentialsRequestChangeDto {
    @IsString()
    @IsNotEmpty()
      uuid: string;

    @IsArray()
    @IsNotEmpty()
      changedTo: string[]; // array with changes from     { Peter, Dinklage }

    @IsArray()
    @IsNotEmpty()
      fieldName: string[]; // array with field names      { fullName }
}