import React from "react"

import classNames from "classnames/bind"

import type { ModalStepType } from "@customTypes/lib/components"

import styles from "./ModalStep.module.scss"

const cx = classNames.bind(styles)

export const ModalStep: React.FC<ModalStepType> = ({ activeStep, totalSteps }): JSX.Element => {

   const classNameWrapper = cx(styles.wrapper, {})
   
   return (
      <>
         {activeStep && totalSteps ? <div className={classNameWrapper}>
            {Array.from({ length: totalSteps }, (_, index) => <span key={index} className={
               `
            ${styles.item}
            ${activeStep === index + 1 ? styles.active : ""}
            `
            }></span>)}
         </div> : null}
      </>
   )
}