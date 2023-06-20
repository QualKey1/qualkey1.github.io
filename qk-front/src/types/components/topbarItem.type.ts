import type { SVGProps } from "react"

export type TopbarItemType = {
   isLink: boolean,
   href?: string
   text: string
   icon: SVGProps<SVGSVGElement>
   [k: string]: unknown
}