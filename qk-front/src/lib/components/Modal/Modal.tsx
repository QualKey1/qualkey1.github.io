import React from "react"

import { Text } from "@lib/components"
import { ModalStep } from "@lib/components/ModalStep/ModalStep"

import type { ModalType } from "@customTypes/lib/components"

import styles from "./Modal.module.scss"

export const Modal: React.FC<ModalType> = ({
   error,
   stepsRequired,
   activeStep,
   totalSteps,
   isOpen,
   handleCloseModal,
   children,
   ...props
}): JSX.Element => {

   return (
      <div className={styles.wrapper} style={{ display: isOpen ? "flex" : "none" }}>
         <div className={styles.modal} {...props}>
            <svg fill="none" height="27" viewBox="0 0 27 27"
                 width="27"
                 xmlns="http://www.w3.org/2000/svg" onClick={handleCloseModal}>
               <path d="M22.1121 22.1122C26.7984 17.4259 26.7984 9.82796 22.1121 5.14167C17.4258 0.45538 9.82782 0.455381 5.14153 5.14167C0.45524 9.82796 0.45524 17.4259 5.14153 22.1122C9.82782 26.7985 17.4258 26.7985 22.1121 22.1122Z"
                  stroke="#A3A3A3" strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth="1.5"/>
               <path d="M10.0938 17.1621L17.1648 10.091" stroke="#A3A3A3" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
               <path d="M10.0938 10.0918L17.1648 17.1629" stroke="#A3A3A3" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
            </svg>

            {stepsRequired && <ModalStep activeStep={activeStep} totalSteps={totalSteps}/>}

            <div className={styles.content}>
               {error
                  ? <div className={styles.errorWrapper}>
                     <svg fill="none" height="24" viewBox="0 0 24 24"
                       width="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9.75V13.5" stroke="#D6193D" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M10.7058 3.75024L2.45585 18.0002C2.32442 18.2279 2.25512 18.4861 2.25488 18.7489C2.25465 19.0118 2.3235 19.2701 2.45452 19.498C2.58555 19.7258 2.77416 19.9153 3.00145 20.0473C3.22875 20.1793 3.48674 20.2493 3.7496 20.2502H20.2496C20.5125 20.2493 20.7705 20.1793 20.9977 20.0473C21.225 19.9153 21.4136 19.7258 21.5447 19.498C21.6757 19.2701 21.7445 19.0118 21.7443 18.7489C21.7441 18.4861 21.6748 18.2279 21.5434 18.0002L13.2934 3.75024C13.1629 3.5223 12.9746 3.33287 12.7474 3.20113C12.5202 3.06938 12.2622 3 11.9996 3C11.737 3 11.479 3.06938 11.2518 3.20113C11.0246 3.33287 10.8363 3.5223 10.7058 3.75024V3.75024Z"
                           stroke="#D6193D" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M12 17.8125C12.5178 17.8125 12.9375 17.3928 12.9375 16.875C12.9375 16.3572 12.5178 15.9375 12 15.9375C11.4822 15.9375 11.0625 16.3572 11.0625 16.875C11.0625 17.3928 11.4822 17.8125 12 17.8125Z"
                           fill="#D6193D"/>
                     </svg>
                     <Text color="danger" component="p" size="paragraph">
                        {error}
                     </Text>
                  </div>
                  : children}
            </div>
         </div>
      </div>
   )
}