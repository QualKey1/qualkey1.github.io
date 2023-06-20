import React from "react"

export type TextType = {
    component: "p" | "span" | "label" | "a"
    color: "success" | "danger" | "pending" | "blue" | "darkblue" | "000" | "100" | "200" | "300" | "400" | "500" | "800"
    size: "paragraph" | "label"
    thin?: boolean
    bold?: boolean
    underline?: boolean
    children: React.ReactNode
    [k: string]: unknown
}