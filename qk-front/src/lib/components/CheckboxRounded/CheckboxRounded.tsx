import React from "react"

import { FormContext } from "@lib/components"

import type { CheckboxRoundedType } from "@customTypes/lib/components"

import styles from "./CheckboxRounded.module.scss"

//TODO: One Checkbox component

export const CheckboxRounded: React.FC<CheckboxRoundedType> = ({
   name,
   isForm,
   isChecked,
   handleCheckboxValue
}): JSX.Element => {

   const formContext = React.useContext(FormContext)
   const { formData, setFormData } = formContext

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
   
   if (isForm) return (
      <label className={styles.switch} htmlFor={name}>
         <input checked={formData[name] as boolean} id={name} name={name}
                type="checkbox"
                onChange={handleCheckboxChange}/>
         <span className={styles.slider}></span>
      </label>
   )

   return (
      <label className={styles.switch} htmlFor={name}>
         <input checked={isChecked} id={name} name={name}
                type="checkbox"
                onChange={handleCheckboxValue}/>
         <span className={styles.slider}></span>
      </label>
   )
}