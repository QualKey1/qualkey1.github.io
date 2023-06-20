import { Injectable } from "@nestjs/common";
import { Command } from "nestjs-command";

import { HederaService } from "./hedera.service";

@Injectable()
export class CreateSmartContractCommand {
  constructor(private readonly hederaService: HederaService) {}

    @Command({
      command: "create:sc",
      describe: "create a Smart Contract",
    })
  async create(): Promise<void> {
    const sc = await this.hederaService.createSmartContract();
    console.log(sc);
  }
}
