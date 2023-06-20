import React, { useCallback } from "react"

import moment from "moment"

import { formatDate } from "@utils/formatDate"

import type { UseCredentialShareSharedDataType } from "@customTypes/hooks"
import type { ICredentialShare } from "@interfaces/credentials.interface"

/**
 * Credential share UI data handler
 */
export const useCredentialShareDisplay = (data: ICredentialShare[], id: string | null): [UseCredentialShareSharedDataType | null] => {

   const [sharedData, setSharedData] = React.useState<UseCredentialShareSharedDataType | null>(null)
   
   const isShareValid = useCallback((date: Date) => {
      const dateNow = moment(new Date(Date.now()).toUTCString())
      const dateExpires = moment(date)
      
      return dateExpires.diff(dateNow) > 0
   }, [])

   React.useEffect(() => {

      if (id && data.some(item => item.uuid === id)) {

         const sharedDataToDisplay = data.filter(item => item.uuid === id)

         setSharedData({
            email: sharedDataToDisplay[0].recipientEmails[0],
            sharedAt: formatDate("DD.MM.YYYY", sharedDataToDisplay[0].createdAt) ?? "Not valid date",
            expiresAt: formatDate("DD.MM.YYYY", sharedDataToDisplay[0].expiresAt) ?? "Not valid date",
            isLinkActive: isShareValid(sharedDataToDisplay[0].expiresAt),
            credentials: sharedDataToDisplay[0].credentialQualificationNames,
            uuids: sharedDataToDisplay[0].credentialUuids
         })

      } else {
         setSharedData(null)
      }

   }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

   return [sharedData]
}