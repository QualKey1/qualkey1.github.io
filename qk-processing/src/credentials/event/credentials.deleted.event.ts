import { Credential, User } from "@prisma/client";

export class CredentialsDeletedEvent {
  credentials: Credential;
  student: User;
}