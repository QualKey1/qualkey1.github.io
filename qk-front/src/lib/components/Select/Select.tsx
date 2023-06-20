import React from "react"

import classNames from "classnames/bind"
import { useRouter } from "next/router"

import { FormContext } from "@lib/components"

import type { SelectType } from "@customTypes/lib/components"

import styles from "./Select.module.scss"

const cx = classNames.bind(styles)

export const Select: React.FC<SelectType> = ({
   defaultLabel,
   fullWidth,
   optionsList,
   selectKey,
   selectIndex,
   clearable,
   disabled,
   controlledState,
   state,
   resetValueOnQueryChange,
   handleGetStateOutside,
}): JSX.Element => {

   const { query } = useRouter()

   const formContext = React.useContext(FormContext)
   const { formData, setFormData } = formContext

   const [isSelectOpen, setIsSelectOpen] = React.useState<boolean>(false)
   const [selectedOption, setSelectedOption] = React.useState<number>(-1)

   const classNameWrapper = cx(styles.wrapper, { fullWidth: fullWidth })
   const classNameButton = cx(styles.button, { expanded: isSelectOpen, disabled: disabled })
   const classNameOptions = cx(styles.options, { show: isSelectOpen })

   /**
    * Dropdown toggle handler
    */
   const handleToggleIsSelectOpen = (): void => {
      setIsSelectOpen(prevState => !prevState)
   }

   /**
    * Dropdown select value handler
    * @description Puts selected elements in array in order they appear in components
    */
   const handleSelectOption = (index: number): void => {
      if (handleGetStateOutside) {
         handleGetStateOutside(optionsList[index])
      }

      setSelectedOption(index)
      if (setFormData && selectKey) {

         const formDataCopy = formData[selectKey] as string[]
         formDataCopy[selectIndex] = optionsList[index]

         setFormData({
            ...formData,
            [selectKey]: formDataCopy
         })
      }
      setIsSelectOpen(false)
   }

   /**
    * Dropdown reset handler
    */
   const handleResetDropdownValue = (): void => {
      if (clearable || resetValueOnQueryChange) {
         setSelectedOption(-1)
         if (setFormData && selectKey) {

            const formDataCopy = formData[selectKey] as string[] | undefined[]
            formDataCopy[selectIndex] = undefined

            setFormData({
               ...formData,
               [selectKey]: formDataCopy
            })
         }
         setIsSelectOpen(false)
      }
   }

   /**
    * Listen for select value reset on query change
    */
   React.useEffect(() => {
      if (resetValueOnQueryChange) {
         handleResetDropdownValue()
      }
   }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

   return (
      <div className={styles.container}>
         <div className={classNameWrapper}>
            <button aria-expanded={isSelectOpen}
                    aria-haspopup="listbox"
                    className={classNameButton}
                    type="button"
                    onClick={handleToggleIsSelectOpen}
            >
               {!controlledState && (optionsList[selectedOption] ?? defaultLabel)}
               {controlledState && state ? state[selectIndex] : null}

            </button>
            <ul aria-activedescendant={optionsList[selectedOption]}
                className={classNameOptions}
                role="listbox"
            >
               {optionsList.map((option, index) => (
                  <li key={option} aria-selected={selectedOption == index}
                      id={option}
                      role="option"
                      onClick={(): void => {
                         handleSelectOption(index)
                      }}>
                     {option}
                  </li>
               ))}
            </ul>
         </div>
         {clearable && <svg fill="#262626" height="24px" viewBox="0 0 50 50"
                            width="24px"
                            xmlns="http://www.w3.org/2000/svg" onClick={handleResetDropdownValue}>
            <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"/>
         </svg>}
      </div>
   )
}