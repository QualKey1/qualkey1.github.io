import React from "react"

import type { FormDataType } from "@customTypes/common"

export type MessageFormType = {
   handleFormSubmit: (event: React.SyntheticEvent, formData: FormDataType) => Promise<void>
   isFeedback?: boolean
   isCredentialShare?: boolean
   formInitialState: FormDataType
   selectOptions?: string[]
   selectLabel?: string,
   error: string
   loading: boolean
   success: string
}