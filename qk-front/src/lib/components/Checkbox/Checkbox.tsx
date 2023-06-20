import React from "react"

import classNames from "classnames/bind"

import { FormContext } from "@lib/components"

import type { CheckboxType } from "@customTypes/lib/components/checkbox.type"

import styles from "./Checkbox.module.scss"

const cx = classNames.bind(styles)

//TODO: One Checkbox component

export const Checkbox: React.FC<CheckboxType> = ({ label, name, color, disabled }): JSX.Element => {
   
   const className = cx(styles.label, { [`c_${color}`]: `c_${[color]}`, disabled: disabled })

   const formContext = React.useContext(FormContext)
   const { formData, setFormData } = formContext

   const [isCheckboxFocused, setIsCheckboxFocused] = React.useState<boolean>(false)

   /**
    * Checkbox focus handler
    */
   const handleIsCheckboxFocused = (): void => {
      setIsCheckboxFocused(true)
   }

   /**
    * Checkbox value handler on Enter key
    */
   const toggleCheckboxOnEnter = (event: React.KeyboardEvent<HTMLSpanElement>): void => {
      if (isCheckboxFocused) {
         if (event.key === "Enter" && setFormData) {
            setFormData({
               ...formData,
               [name]: !formData[name]
            })
         }
      }
   }

   /**
    * Checkbox value handler
    */
   const handleCheckboxChange = (event: React.SyntheticEvent): void => {
      const target = event.target as HTMLInputElement
      if (setFormData) {
         setFormData({
            ...formData,
            [name]: target.checked
         })
      }
   }

   return (
      <label className={className} htmlFor={name}>
         {label}
         <input checked={formData[name] as boolean} id={name} name={name}
                   type="checkbox"
                   onChange={handleCheckboxChange}/>
         <span className={styles.checkmark} tabIndex={0} onFocus={handleIsCheckboxFocused}
                  onKeyDown={toggleCheckboxOnEnter}></span>
      </label>
   )
}