import { IsNotEmpty, IsString } from "class-validator";

/**
 * Data Transfer Object of the PATCH change user setting request
 */
export class UserChangeSettingDto {
    @IsString()
    @IsNotEmpty()
      settingName: string;

    @IsString()
    @IsNotEmpty()
      newValue: string;
}