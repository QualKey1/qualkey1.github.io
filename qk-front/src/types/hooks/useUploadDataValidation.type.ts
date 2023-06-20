import type { InstitutionMappingType } from "@interfaces/institution.interface"

export type ParsedDataType = {
   key: string
   originalKey: string
   values: string[]
}

export type ValidationErrorType = {
   columnName: string
   errors: string[]
}

export type UseUploadDataValidationType = [
   ParsedDataType[],
   ValidationErrorType[],
   ((institutionDataMapping: InstitutionMappingType[],
     data: Array<{[p: string]: string}>, isExcel?: boolean) => void)
]