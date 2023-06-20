import React from "react"
import type { SVGProps } from "react"

export type ButtonType = {
    icon?: SVGProps<SVGSVGElement>
    onlyIcon?: boolean
    loading: boolean
    error?: string
    success?: string
    size: "lg" | "md" | "sm" | "xs",
    variant: "primary" | "secondary" | "danger" | "filter"
    thin?: boolean,
    fullWidth?: boolean
    center?: boolean
    active?: boolean
    disabled?: boolean
    children: React.ReactNode
    [k: string]: unknown
}