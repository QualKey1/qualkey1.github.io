import type { ValidationErrorType } from "@customTypes/hooks"

export type UploadModalValidationType = {
   validationErrors: ValidationErrorType[]
   handleNextStep: () => void
}