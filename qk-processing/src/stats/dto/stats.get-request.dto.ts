import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

/**
 * Data Transfer Object with credentials GET request data
 */
export class StatsGetRequestDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
  public readonly filter?: string = null;

    @IsOptional()
    @IsDateString()
    @IsNotEmpty()
    public readonly dateCreatedFrom?: string = null;

    @IsOptional()
    @IsDateString()
    @IsNotEmpty()
    public readonly dateCreatedUntil?: string = null;
}