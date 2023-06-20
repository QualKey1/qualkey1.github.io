import { forwardRef, Module } from "@nestjs/common";

import { AwsModule } from "../aws/aws.module";
import { CredentialsDeleteService } from "../credentials/credentials.delete.service";
import { CredentialsModule } from "../credentials/credentials.module";
import { EmailModule } from "../email/email.module";
import { EmailService } from "../email/email.service";
import { SettingsModule } from "../settings/settings.module";
import { StatsModule } from "../stats/stats.module";
import { PasswordGenerator } from "./helper/password-generator.service";
import { UserController } from "./user.controller";
import { UserFactory } from "./user.factory";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserSettingService } from "./user.setting.service";

@Module({
  imports: [
    AwsModule,
    EmailModule,
    StatsModule,
    forwardRef(() => CredentialsModule),
    forwardRef(() => SettingsModule),
  ],
  controllers: [UserController],
  exports: [PasswordGenerator, UserFactory, UserRepository],
  providers: [
    PasswordGenerator,
    UserFactory,
    UserRepository,
    UserSettingService,
    UserService,
    CredentialsDeleteService,
    EmailService,
  ],
})
export class UserModule {}
