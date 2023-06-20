import React from "react"

import classNames from "classnames/bind"

import type { BurgerType } from "@customTypes/lib/components"

import styles from "./Burger.module.scss"

const cx = classNames.bind(styles)

export const Burger: React.FC<BurgerType> = ({ isOpen, ...props }): JSX.Element => {
   
   const className = cx( styles.burger, { active: isOpen })
   
   return (
      <div className={className} {...props}>
         <span></span>
         <span></span>
         <span></span>
      </div>
   )
}