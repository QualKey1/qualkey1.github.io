import React from "react"

export type InputType = {
    label?: string
    type: React.HTMLInputTypeAttribute
    placeholder?: string
    name: string
    fullWidth?: boolean
    [k: string]: unknown
}