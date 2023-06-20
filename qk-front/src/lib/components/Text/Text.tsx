import React from "react"

import classNames from "classnames/bind"

import type { TextType } from "@customTypes/lib/components"

import styles from "./Text.module.scss"

const cx = classNames.bind(styles)

export const Text: React.FC<TextType> = React.forwardRef(({
   component,
   color,
   size,
   thin,
   bold,
   underline,
   children,
   ...props
}, ref): JSX.Element => {

   const className = cx({
      [`c_${color}`]: `c_${[color]}`,
      [size]: [size],
      thin: thin,
      bold: bold,
      underline: component === "a" && underline,
   })

   const CustomComponent = component as React.ElementType

   return (
      <CustomComponent ref={ref} className={className} {...props}>{children}</CustomComponent>
   )
})

Text.displayName = "Text"