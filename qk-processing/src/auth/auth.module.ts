import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AwsModule } from "../aws/aws.module";
import { EmailModule } from "../email/email.module";
import { EmailService } from "../email/email.service";
import { SettingsModule } from "../settings/settings.module";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { OtpService } from "./otp.service";
import { RouteProvider } from "./provider";
import { JwtStrategy } from "./strategy";

@Module({
  imports: [
    JwtModule.register({}),
    AwsModule,
    SettingsModule,
    forwardRef(() => EmailModule),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RouteProvider, OtpService, EmailService],
})
export class AuthModule {}