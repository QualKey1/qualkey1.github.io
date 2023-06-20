import { Module } from "@nestjs/common";

import { SettingsService } from "./settings.service";

@Module({
  exports: [SettingsService],
  providers: [SettingsService],
})
export class SettingsModule {}
