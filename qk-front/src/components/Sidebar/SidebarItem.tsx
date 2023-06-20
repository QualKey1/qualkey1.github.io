import React from "react"

import classNames from "classnames/bind"
import Link from "next/link"
import { useRouter } from "next/router"

import { Text } from "@lib/components"

import type { SidebarItemType } from "@customTypes/components"

import styles from "./SidebarItem.module.scss"

const cx = classNames.bind(styles)

export const SidebarItem: React.FC<SidebarItemType> = ({ isLink, href, text, icon, isSecondary, ...props }): JSX.Element | null => {

   const { pathname, query } = useRouter()

   const className = cx(styles.textWrapper, {
      secondary: isSecondary,
      active: href?.includes("/share")
         ? pathname.startsWith("/share")
         : query.did
            ? href === `/${query.did}`
            : pathname.startsWith(href ? href : "#")
   })

   const action = <div className={className} {...props}>
      <div className={styles.textInner}>
         <>
            {icon}
         </>
         <Text bold={!isSecondary} color="000" component="p"
               size="paragraph">
            {text}
         </Text>
      </div>
   </div>

   if (isLink && href) return <Link passHref href={href}>
      <a>
         {action}
      </a>
   </Link>

   if (!isLink) return action

   return null
}