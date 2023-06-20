import React from "react"

import moment from "moment/moment"

import type { ParsedDataType, UseUploadDataValidationType, ValidationErrorType } from "@customTypes/hooks"
import type { InstitutionMappingType } from "@interfaces/institution.interface"

const notEmptyFields = [
   "email",
   "graduatedAt",
   "graduatedFullName",
   "graduatedFirstName",
   "graduatedLastName",
   "qualificationLevel",
   "qualificationName",
   "studyEndedAt",
   "studyStartedAt"
]

const dateFields = [
   "expiresAt",
   "graduatedAt",
   "studyEndedAt",
   "studyStartedAt"
]

/**
 * Every row data validation handler
 */
export const useUploadDataValidation = (): UseUploadDataValidationType => {
   const [data, setData] = React.useState<ParsedDataType[]>([])
   const [validationErrors, setValidationErrors] = React.useState<ValidationErrorType[]>([])

   const checkIsFieldEmpty = React.useCallback((value: string, row: number, isExcel?: boolean): string | undefined => {
      if (!isExcel) {
         if (value === "") return `empty on row ${row}`
      }

      if (isExcel) {
         if (value === null) return `empty on row ${row}`
      }
   }, [])

   const checkIfStringIsDate = React.useCallback((value: string, row: number, isExcel?: boolean) => {
      const date = moment(value)
      if (!isExcel) {
         if (value !== "" && !date.isValid()) return `not valid date on row ${row}`
      }

      if (isExcel) {
         if (value !== null && !date.isValid()) return `not valid date on row ${row}`
      }

   }, [])

   const handleValidation = React.useCallback((institutionDataMapping: InstitutionMappingType[], data: Array<{ [k: string]: string }>, isExcel?: boolean): void => {
      const parsedData: ParsedDataType[] = []
      const errorData: ValidationErrorType[] = []

      for (let i = 0; i < institutionDataMapping.length; i++) {
         const key = institutionDataMapping[i]["originalColumnName"]
         const originalKey = institutionDataMapping[i]["qualkeyName"]

         const dataArray = data.map((item) => item[key])
         parsedData.push({
            key: key,
            originalKey,
            values: dataArray,
         })
         errorData.push({
            columnName: key,
            errors: []
         })
      }

      parsedData.forEach((item) => {
         if (notEmptyFields.includes(item.originalKey)) {
            item.values.forEach((value, index) => {
               const validationResult = checkIsFieldEmpty(value, index + 1, isExcel)
               if (validationResult) {
                  const errorColumnIndex = errorData.findIndex((value) => value.columnName == item.key)
                  errorData[errorColumnIndex].errors.push(validationResult)
               }
            })
         }
         if (dateFields.includes(item.originalKey)) {
            item.values.forEach((value, index) => {
               const validationResult = checkIfStringIsDate(value, index + 1, isExcel)
               if (validationResult) {
                  const errorColumnIndex = errorData.findIndex((value) => value.columnName == item.key)
                  errorData[errorColumnIndex].errors.push(validationResult)
               }
            })
         }
      })

      setValidationErrors(errorData)
      setData(parsedData)

   }, [checkIsFieldEmpty, checkIfStringIsDate])

   return [data, validationErrors, handleValidation]
}