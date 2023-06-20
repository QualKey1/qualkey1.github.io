import type { FormEvent } from "react"
import React from "react"

import { useRouter } from "next/router"


import { dateDataEdit, stringDataEdit } from "@constants/qualkeyFieldsMapping"

import type { FormDataType } from "@customTypes/common"
import type { FormContextType } from "@customTypes/context"
import type { FormType } from "@customTypes/lib/components"

import styles from "./Form.module.scss"

export const FormContext = React.createContext<FormContextType>({ formData: {} })

export const Form: React.FC<FormType> = ({ initialState, handleFormSubmit, resetValueOnQueryChange, editFunctionality, activeFormSetter, children, ...props }): JSX.Element => {

   const { query } = useRouter()
   
   const [formData, setFormData] = React.useState<FormDataType>(initialState)

   /**
    * Listen initial form state change
    */
   React.useEffect(() => {
      setFormData(initialState)
   }, [initialState])

   /**
    * Listen for form reset on query change
    */
   React.useEffect(() => {
      if (resetValueOnQueryChange) {
         setFormData(initialState)
      }
   }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

   /**
    * Form input change handler
    */
   const handleInputChange = (event: React.SyntheticEvent): void => {
      const target = event.target as HTMLInputElement
      const { name, value } = target
      
      if (editFunctionality && activeFormSetter) {
         if (stringDataEdit.some(item => item === name)) {
            activeFormSetter("strings")
         } else if (dateDataEdit.some(item => item === name)) {
            activeFormSetter("dates")
         }
      }
      
      setFormData({
         ...formData,
         [name]: value
      })
   }

   /**
    * Form OTP input change handler
    */
   const handleInputOtpChange = (value: string): void => {
      setFormData({
         ...formData,
         otp: value
      })
   }

   return (
      <form className={styles.form} {...props}
            onSubmit={(event: FormEvent<HTMLFormElement>): void => handleFormSubmit(event, formData)}>
         <FormContext.Provider value={{
            formData,
            handleInputChange,
            handleInputOtpChange,
            setFormData
         }}>
            {children}
         </FormContext.Provider>
      </form>
   )
}