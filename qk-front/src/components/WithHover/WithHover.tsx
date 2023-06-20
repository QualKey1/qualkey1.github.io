import React from "react"

import classNames from "classnames/bind"

import { Text } from "@lib/components"

import type { WithHoverType } from "@customTypes/components"

import styles from "./WithHover.module.scss"

const cx = classNames.bind(styles)

export const WithHover: React.FC<WithHoverType> = ({ label, width, height, isCenter, children, ...style }): JSX.Element => {
   
   const className = cx(styles.label, { center: isCenter })

   return (
      <div className={styles.wrapper} style={{ width, height, ...style.style }}>
         <>
            {children}
         </>
         <div className={className}>
            <div className={styles.labelWrapper}>
               <Text color="000" component="p" size="label"
                     style={{ display: "block" }}>
                  {label}
               </Text>
            </div>
         </div>
      </div>
   )
}