import { Credential, User } from "@prisma/client";

export class CredentialsActivatedEvent {
  credentials: Credential;
  student: User;
}