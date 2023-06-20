import { Injectable, Logger, UnprocessableEntityException } from "@nestjs/common";
import { User } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { UserChangeSettingDto } from "./dto/user.change-setting.dto";

/**
 * Service for changing user settings
 */
@Injectable()
export class UserSettingService {
  constructor(
       private readonly prisma: PrismaService,
  ) {}

  public async changeUserSetting(user: User, dto: UserChangeSettingDto): Promise<void> {
    if (dto.settingName === "currency") {
      return await this.changeCurrency(user, dto.newValue);
    }

    throw new UnprocessableEntityException(`Not recognized setting name ${dto.settingName}`);
  }

  private async changeCurrency(user: User, newValue: string): Promise<void> {
    Logger.debug(`change user's ${user.email} currency to ${newValue}`);
    await this.prisma.user.update({
      data: { currency: newValue },
      where: { uuid: user.uuid },
    });
  }
}