import React from "react"

export type CheckboxRoundedType = {
   name: string
   isForm: boolean
   isChecked?: boolean
   handleCheckboxValue?: (event:(React.SyntheticEvent)) => void
}