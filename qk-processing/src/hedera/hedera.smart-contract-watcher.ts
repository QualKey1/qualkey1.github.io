import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SmartContractStatus } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { HederaService } from "./hedera.service";

@Injectable()
export class HederaSmartContractWatcher {
  constructor(
        private prisma: PrismaService,
        private hedera: HederaService,
  ) {
  }

    @Cron(CronExpression.EVERY_MINUTE)
  async createSmartContractIfNeeded(): Promise<void> {
    const smartContract = await this.prisma.smartContract.findFirst({ where: { status: SmartContractStatus.ACTIVE } });
    if (! smartContract) {
      Logger.warn("There is no ACTIVE Smart Contract, creating new one...");
      await this.hedera.createSmartContract();
    }
  }
}