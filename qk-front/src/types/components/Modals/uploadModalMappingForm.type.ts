import type { ParsedDataType } from "@customTypes/hooks"

export type UploadModalMappingFormType = {
   fields?: ParsedDataType[]
   handleNextStep: () => void
   selectedFile: File | null
   handleCloseModal: () => void
}