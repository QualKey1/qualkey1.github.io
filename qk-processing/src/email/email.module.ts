import { join } from "path";

import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as aws from "aws-sdk";
import * as nodemailer from "nodemailer";

import { SettingsService } from "../settings/settings.service";
import { UserRepository } from "../user/user.repository";
import { EmailPublicController } from "./email.public.controller";
import { EmailService } from "./email.service";
import { EmailUnsubscribeService } from "./email.unsubscribe-service";

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: nodemailer.createTransport({
          SES: {
            ses: new aws.SES({
              apiVersion: "2010-12-01",
              region: config.get("AWS_REGION"),
              credentials: {
                accessKeyId: config.get("AWS_ACCESS_KEY_ID"),
                secretAccessKey: config.get("AWS_SECRET_ACCESS_KEY"),
              },
            }),
            aws,
          },
        }).transporter,
        template: {
          dir: join(process.cwd(), "dist/email/templates"),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
    SettingsService,
  ],
  providers: [EmailService, SettingsService, ConfigService, EmailUnsubscribeService, UserRepository],
  exports: [EmailService],
  controllers: [EmailPublicController],
})
export class EmailModule {}
