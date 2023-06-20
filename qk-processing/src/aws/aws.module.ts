import { Module } from "@nestjs/common";

import { SettingsModule } from "../settings/settings.module";
import { AwsS3Service } from "./aws.s3.service";

@Module({
  imports: [SettingsModule],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsModule {}
