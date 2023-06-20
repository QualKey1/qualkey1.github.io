import { Credential, CredentialsWithdrawalRequest, User } from "@prisma/client";

export class CredentialsWithdrawalApprovedEvent {
  credentials: Credential;
  withdrawalRequest: CredentialsWithdrawalRequest;
  representatives: User[];
}