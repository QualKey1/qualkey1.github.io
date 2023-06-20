import { Credential, CredentialsWithdrawalRequest, User } from "@prisma/client";

export class CredentialsWithdrawalRejectedEvent {
  credentials: Credential;
  withdrawalRequest: CredentialsWithdrawalRequest;
  representatives: User[];
}