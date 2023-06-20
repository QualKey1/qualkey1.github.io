import React from "react"

import classNames from "classnames/bind"

import { FormContext } from "@lib/components"

import type { TextareaType } from "@customTypes/lib/components"

import styles from "./Textarea.module.scss"

const cx = classNames.bind(styles)

export const Textarea: React.FC<TextareaType> = ({ name, placeholder, fullWidth, ...props }): JSX.Element => {

   const className = cx(styles.textarea, { fullWidth: fullWidth })

   const formContext = React.useContext(FormContext)
   const { formData, handleInputChange } = formContext

   return (
      <textarea rows={15} {...props} className={className}
                id={name}
                name={name} placeholder={placeholder}
                value={formData[name] as string}
                onChange={handleInputChange}/>
   )
}