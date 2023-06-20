import { Body, Controller, Delete, Get, Patch, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";

import { GetUser } from "../auth/decorator";
import { JwtGuard } from "../auth/guard";
import { UserChangeSettingDto } from "./dto/user.change-setting.dto";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserSettingService } from "./user.setting.service";

@UseGuards(JwtGuard)
@Controller("user")
export class UserController {
  constructor(
      private readonly userRepository: UserRepository,
      private readonly userSettingService: UserSettingService,
      private readonly userService: UserService,
  ) {
  }

  @Get("me")
  async getMe(@GetUser() user: User): Promise<User> {
    return this.userRepository.get(user.email);
  }

  @Patch("setting")
  async changeSetting(@GetUser() user: User, @Body() dto: UserChangeSettingDto): Promise<void> {
    await this.userSettingService.changeUserSetting(user, dto);
  }

  @Delete()
  async deleteUser(@GetUser() user: User): Promise<void> {
    await this.userService.deleteUser(user);
  }
}
