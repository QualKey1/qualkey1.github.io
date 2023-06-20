import { IsNotEmpty, IsString } from "class-validator";

/**
 * Data Transfer Object of the get Upload file request
 */
export class UploadGetFileDto {
    @IsString()
    @IsNotEmpty()
      uuid: string;
}