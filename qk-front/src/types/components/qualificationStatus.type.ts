import { CredentialStatusEnum } from "@interfaces/credentials.interface"

import type { ICredential } from "@interfaces/credentials.interface"

export type QualificationStatusType = {
   isStudent?: boolean
   status: CredentialStatusEnum
   data?: ICredential
}