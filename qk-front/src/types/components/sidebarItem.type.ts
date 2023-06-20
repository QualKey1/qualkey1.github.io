import type { SVGProps } from "react"

export type SidebarItemType = {
   isLink: boolean,
   href?: string
   text: string
   icon: SVGProps<SVGSVGElement>
   isSecondary?: boolean
   [k: string]: unknown
}