import {AccountBalanceQuery, Client, Hbar, TransferTransaction} from "@hashgraph/sdk";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Command } from "nestjs-command";

/**
 * Just for testnet to top up our testnet wallet
 */
@Injectable()
export class HederaFillTestnetWallet {
  constructor(private readonly config: ConfigService) {}

    @Command({
      command: "fill:wallet",
      describe: "Send test HBAR to our testnet wallet",
    })
  async fill(): Promise<void> {
    const accountId = "0.0.48105612";
    const privateKey = "302e020100300506032b6570042204209f084f33e936c48d4a77425d6d333478a94d3ac4143c14e18f69c75998dc81ad";

    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);

    const accountBalance = await new AccountBalanceQuery()
      .setAccountId("0.0.48105612")
      .execute(client);

    console.log(accountBalance.hbars.toString(), "NEW_ACCOUNT");

    const accountBalance1 = await new AccountBalanceQuery()
      .setAccountId(this.config.get<string>("HEDERA_ACCOUNT_ID"))
      .execute(client);

    console.log(accountBalance1.hbars.toString(), "OLD_ACCOUNT");

    // Create the transfer transaction
    const sendHbar = await new TransferTransaction()
        .addHbarTransfer(accountId, new Hbar(-1)) //Sending account
        .addHbarTransfer(this.config.get<string>("HEDERA_ACCOUNT_ID"), new Hbar(1)) //Receiving account
        .execute(client);

    console.log(sendHbar);

      const transactionReceipt = await sendHbar.getReceipt(client);
      const transactionResponse = await sendHbar.getRecord(client);
      const transactionHash = Buffer.from(sendHbar.transactionHash.buffer).toString("hex");

      console.log(transactionReceipt, 'transactionReceipt');
      console.log(transactionResponse, 'transactionResponse');
      console.log(transactionHash, 'transactionHash');
  }
}
