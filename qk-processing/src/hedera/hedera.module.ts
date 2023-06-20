import { Module } from "@nestjs/common";

import { CredentialsChangeRepository } from "../credentials/repository/credentials-change.repository";
import { SettingsModule } from "../settings/settings.module";
import { HederaController } from "./hedera.controller";
import { CreateIdentityNetworkCommand } from "./hedera.create-identity-network";
import { CreateSmartContractCommand } from "./hedera.create-smart-contract";
import { HederaFillTestnetWallet } from "./hedera.fill-testnet-wallet";
import { HederaService } from "./hedera.service";
import { HederaSmartContractWatcher } from "./hedera.smart-contract-watcher";

@Module({
  providers: [
    HederaService,
    CreateIdentityNetworkCommand,
    CreateSmartContractCommand,
    HederaSmartContractWatcher,
    CredentialsChangeRepository,
    HederaFillTestnetWallet,
  ],
  imports: [SettingsModule],
  exports: [HederaService],
  controllers: [HederaController], 
})
export class HederaModule {}
