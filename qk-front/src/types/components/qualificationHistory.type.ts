import type { ICredentialChange } from "@interfaces/credentials.interface"

export type QualificationHistoryType = {
   data?: ICredentialChange[]
   uuid?: string
   isExpanded: boolean
   isStudent?: boolean
}