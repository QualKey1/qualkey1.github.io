import React from "react"

import moment from "moment"

import { qualkeyFieldsMapping } from "@constants/qualkeyFieldsMapping"
import { formatDate } from "@utils/formatDate"

import type { UseCredentialChangeChangeDataType } from "@customTypes/hooks"
import type { ICredentialChange } from "@interfaces/credentials.interface"

/**
 * Credential change UI data handler
 */
export const useCredentialChangeDisplay = (data: ICredentialChange, id: number | null): UseCredentialChangeChangeDataType[] => {

   const [changedData, setChangedData] = React.useState<UseCredentialChangeChangeDataType[]>([])

   const isValueDate = React.useCallback((value: string) => {
      const date = moment(value)
      if (!date.isValid()) return value
      else return formatDate("DD.MM.YYYY", value as unknown as Date)
   }, [])

   React.useEffect(() => {

      if (id) {

         const changedDataArray: UseCredentialChangeChangeDataType[] = []

         data.fieldName.map((field, index) => {

            const fieldName = qualkeyFieldsMapping.has(field) ? qualkeyFieldsMapping.get(field) : undefined

            if (fieldName) {
               changedDataArray.push({
                  fieldName: fieldName,
                  changedTo: isValueDate(data.changedTo[index]) ?? "Not valid date",
                  changedFrom: isValueDate(data.changedFrom[index]) ?? "Not valid date"
               })
            }

         })

         setChangedData(changedDataArray)

      }

   }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

   return changedData
}