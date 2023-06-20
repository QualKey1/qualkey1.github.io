import React from "react"

export type WithHoverType = {
   label: string
   width: number | string
   height: number
   isCenter?: boolean
   children: React.ReactNode
   style?: {[k: string]: string}
}