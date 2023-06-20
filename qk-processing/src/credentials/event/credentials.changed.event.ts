import { Credential } from "@prisma/client";

export class CredentialsChangedEvent {
  credentials: Credential;
}