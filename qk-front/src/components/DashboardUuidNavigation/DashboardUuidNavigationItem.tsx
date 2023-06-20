import React from "react"

import classNames from "classnames/bind"

import { Heading } from "@lib/components"

import type { DashboardUuidNavigationItemType } from "@customTypes/components"

import styles from "./DashboardUuidNavigation.module.scss"

const cx = classNames.bind(styles)

export const DashboardUuidNavigationItem: React.FC<DashboardUuidNavigationItemType> = ({ navigation, navigationSetter, data }): JSX.Element => {

   const classNameNavItem = cx(styles.navigationItem, { active: data === navigation })

   return (
      <div className={classNameNavItem} onClick={(): void => navigationSetter(data)}>
         <Heading color="000" component="p" size="sm">
            {data}
         </Heading>
      </div>
   )
}