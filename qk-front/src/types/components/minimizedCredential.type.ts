import type { ICredential } from "@interfaces/credentials.interface"

export type MinimizedCredentialType = {
   data: ICredential
   [k: string]: unknown
}