import React from "react"

export type HeadingType = {
    component: "h1" | "h2" | "h3" | "h4" | "p"
    color: "success" | "danger" | "pending" | "blue" | "darkblue" | "000" | "100" | "200" | "300" | "400" | "500" | "800"
    size: "display" | "subDisplay" | "lg" | "md" | "sm"
    children: React.ReactNode
    [k: string]: unknown
}