import React from "react"

export type ModalType = {
   error?: string
   stepsRequired?: boolean
   activeStep?: number
   totalSteps?: number
   isOpen: boolean
   handleCloseModal: (() => void)
   children?: React.ReactNode
   [k: string]: unknown
}