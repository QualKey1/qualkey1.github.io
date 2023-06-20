import * as fs from "fs";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Command } from "nestjs-command";

import { HederaService } from "./hedera.service";

@Injectable()
export class CreateIdentityNetworkCommand {
  constructor(
      private readonly hederaService: HederaService,
      private readonly config: ConfigService,
  ) {}

    @Command({
      command: "create:did-id-network",
      describe: "create an HCS Identity Network ",
    })
  async create(): Promise<void> {
    const hin = await this.hederaService.createHcsIdentityNetwork();
    console.log(hin);
    console.log(hin.getAddressBook().getFileId().shard);
    console.log(hin.getAddressBook().getFileId().num);
    console.log(hin.getAddressBook().getFileId().realm);

    fs.writeFileSync(
      "./files/hcs_did_network.mainnet.json",
      JSON.stringify({
        identityNetwork: hin,
        fileIdShard: hin.getAddressBook().getFileId().shard,
        fileIdRealm: hin.getAddressBook().getFileId().realm,
        fileIdNum: hin.getAddressBook().getFileId().num,
      }, null, 2), "utf-8",
    );
  }
}
