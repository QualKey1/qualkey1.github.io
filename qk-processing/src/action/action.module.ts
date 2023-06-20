import { Module } from "@nestjs/common";

import { CredentialsModule } from "../credentials/credentials.module";
import { PrismaService } from "../prisma/prisma.service";
import { UploadModule } from "../upload/upload.module";
import { ActionController } from "./action.controller";
import { ActionRepository } from "./action.repository";
import { ActionService } from "./action.service";

@Module({
  imports: [UploadModule, CredentialsModule],
  controllers: [ActionController],
  providers: [
    ActionService,
    PrismaService,
    ActionRepository,
  ],
})
export class ActionModule {}
