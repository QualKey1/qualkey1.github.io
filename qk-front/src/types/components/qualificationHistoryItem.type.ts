import type { ICredentialChange, ICredentialShare } from "@interfaces/credentials.interface"

export type QualificationHistoryItemType = {
   data: ICredentialChange | ICredentialShare
   handleHistoryItem: (id: number | string) => void
   id: number | string | null
   isShare: boolean
}