import React from "react"

import type { FormDataType } from "@customTypes/common"

export type FormContextType = {
    formData: FormDataType
    handleInputChange?: ((event: React.SyntheticEvent<Element, Event>) => void)
    handleInputOtpChange?: ((value: string) => void)
    setFormData?: React.Dispatch<React.SetStateAction<FormDataType>>
}