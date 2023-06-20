import React from "react"

export type ShareModalEmailFormType = {
   name: string
   activeStepSetter: React.Dispatch<React.SetStateAction<number>>
   isPublicShare?: boolean
}