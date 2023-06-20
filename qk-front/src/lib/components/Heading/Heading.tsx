import React from "react"

import classNames from "classnames/bind"

import type { HeadingType } from "@customTypes/lib/components"

import styles from "./Heading.module.scss"

const cx = classNames.bind(styles)

export const Heading: React.FC<HeadingType> = ({ component, color, size, children, ...props }): JSX.Element => {

   const className = cx({
      [`c_${color}`]: `c_${[color]}`,
      [size]: [size],
   })

   const CustomComponent = component as React.ElementType

   return (
      <CustomComponent className={className} {...props}>{children}</CustomComponent>
   )
}