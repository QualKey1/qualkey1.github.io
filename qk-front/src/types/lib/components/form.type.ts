import type { FormEvent } from "react"
import React from "react"

import type { FormDataType } from "@customTypes/common"

export type FormType = {
    initialState: FormDataType
    handleFormSubmit: (event: FormEvent<HTMLFormElement>, formData: FormDataType) => void
    resetValueOnQueryChange?: boolean
    children: React.ReactNode
    editFunctionality?: boolean
    activeFormSetter?: React.Dispatch<React.SetStateAction<"strings" | "dates" | null>>
    [k: string]: unknown
}