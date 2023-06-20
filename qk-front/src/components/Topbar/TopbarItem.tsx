import React from "react"

import classNames from "classnames/bind"
import Link from "next/link"
import { useRouter } from "next/router"

import styles from "@components/Topbar/TopbarItem.module.scss"
import { Text } from "@lib/components"

import type { TopbarItemType } from "@customTypes/components"

const cx = classNames.bind(styles)

export const TopbarItem: React.FC<TopbarItemType> = ({ isLink, href, icon, text, ...props }): JSX.Element | null => {

   const { pathname } = useRouter()

   const className = cx(styles.item, { active: pathname.startsWith(href ? href : "#") })

   const action = <div className={className} {...props}>
      <div className={styles.itemInner}>
         <>
            {icon}
         </>
         <Text color="800" component="p"
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