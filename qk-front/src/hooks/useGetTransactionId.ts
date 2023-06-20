import type { UseGetTransactionIdType } from "@customTypes/hooks"
import type { ICredentialChange } from "@interfaces/credentials.interface"

export const useGetTransactionId = (credentialChange?: ICredentialChange[]): UseGetTransactionIdType | undefined => {
   if (credentialChange && credentialChange?.length > 0) {

      const sortedArray = credentialChange
         .sort((a, b) =>
            new Date(b.createdAt as Date).valueOf() - new Date(a.createdAt as Date).valueOf())

      const transactionId = sortedArray[0].transactionId &&
         sortedArray[0].transactionId.replace(/[^a-zA-Z0-9]/g, "")

      const transactionHash = sortedArray[0].transactionHash &&
         sortedArray[0].transactionHash

      return {
         transactionId,
         transactionHash
      }
   }
}