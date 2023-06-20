import React from "react"

import classNames from "classnames/bind"

import { Text, FormContext } from "@lib/components"

import type { InputType } from "@customTypes/lib/components"

import styles from "./Input.module.scss"

const cx = classNames.bind(styles)

export const Input: React.FC<InputType> = ({ label, type, placeholder, name, fullWidth, ...props }): JSX.Element => {

   const classNameInput = cx(styles.input, { fullWidth: fullWidth })
   const classNameWrapper = cx(styles.wrapper, { fullWidth: fullWidth, label: label })

   const [inputType, setInputType] = React.useState<string>(type)

   const formContext = React.useContext(FormContext)
   const { formData, handleInputChange } = formContext

   /**
    * Show password input handler
    */
   const handleTogglePassword = (): void => {
      if (inputType === "password") {
         setInputType("text")
      } else if (inputType === "text") {
         setInputType("password")
      }
   }

   return (
      <div className={classNameWrapper}>

         {label && <Text color="500" component="label"
                            htmlFor={name}
                            size="label">{label}</Text>}

         <input className={classNameInput} id={name} placeholder={placeholder}
                   type={inputType} value={formData[name as string as keyof typeof formData] as string}
                   onChange={handleInputChange}
                   {...props} name={name}>
         </input>

         {type === "password" && <svg fill="none" height="14" viewBox="0 0 20 14"
                                         width="20"
                                         xmlns="http://www.w3.org/2000/svg" onClick={handleTogglePassword}>
            <path clipRule="evenodd"
                     d="M10 0.5C12.6178 0.5 14.972 1.55139 16.6684 2.85335C17.5177 3.50519 18.2146 4.22913 18.7035 4.93368C19.1831 5.6248 19.5 6.3515 19.5 7C19.5 7.6485 19.1831 8.3752 18.7035 9.0663C18.2146 9.7709 17.5177 10.4948 16.6684 11.1466C14.972 12.4486 12.6178 13.5 10 13.5C7.38223 13.5 5.02801 12.4486 3.33162 11.1466C2.48232 10.4948 1.78544 9.7709 1.29649 9.0663C0.81686 8.3752 0.5 7.6485 0.5 7C0.5 6.3515 0.81686 5.6248 1.29649 4.93368C1.78544 4.22913 2.48232 3.50519 3.33162 2.85335C5.02801 1.55139 7.38223 0.5 10 0.5ZM10 3.25C7.92893 3.25 6.25 4.92893 6.25 7C6.25 9.0711 7.92893 10.75 10 10.75C12.0711 10.75 13.75 9.0711 13.75 7C13.75 4.92893 12.0711 3.25 10 3.25ZM10 4.75C11.2426 4.75 12.25 5.7574 12.25 7C12.25 8.2426 11.2426 9.25 10 9.25C8.7574 9.25 7.75 8.2426 7.75 7C7.75 5.7574 8.7574 4.75 10 4.75Z"
                     fill="#C8CBCD"
                     fillRule="evenodd"/>
         </svg>
         }
      </div>
   )
}