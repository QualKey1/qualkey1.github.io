import React from "react"

import classNames from "classnames/bind"

import { Text } from "@lib/components"

import type { ButtonType } from "@customTypes/lib/components"

import styles from "./Button.module.scss"

const cx = classNames.bind(styles)

export const Button: React.FC<ButtonType> = ({
   icon,
   onlyIcon,
   loading,
   error,
   success,
   size,
   variant,
   thin,
   fullWidth,
   center,
   active,
   disabled,
   children,
   ...props
}): JSX.Element => {

   const className = cx(styles.button, {
      [size]: [size],
      [variant]: [variant],
      fullWidth: fullWidth,
      center: center,
      icon: icon,
      loading: loading,
      thin: thin,
      active: active
   })

   return (
      <div className={styles.wrapper}>
         <button className={className} {...props} disabled={disabled ?? loading}>

            {loading
               ? <svg className={styles.loading} fill="#fff"
                      viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="15" r="15">
                     <animate attributeName="r" begin="0s" calcMode="linear"
                              dur="0.8s" from="15"
                              repeatCount="indefinite" to="15"
                              values="15;9;15"/>
                     <animate attributeName="fill-opacity" begin="0s" calcMode="linear"
                              dur="0.8s" from="1"
                              repeatCount="indefinite" to="1"
                              values="1;.5;1"/>
                  </circle>
                  <circle cx="60" cy="15" fillOpacity="0.3"
                          r="9">
                     <animate attributeName="r" begin="0s" calcMode="linear"
                              dur="0.8s" from="9"
                              repeatCount="indefinite" to="9"
                              values="9;15;9"/>
                     <animate attributeName="fill-opacity" begin="0s" calcMode="linear"
                              dur="0.8s" from="0.5"
                              repeatCount="indefinite" to="0.5"
                              values=".5;1;.5"/>
                  </circle>
                  <circle cx="105" cy="15" r="15">
                     <animate attributeName="r" begin="0s" calcMode="linear"
                              dur="0.8s" from="15"
                              repeatCount="indefinite" to="15"
                              values="15;9;15"/>
                     <animate attributeName="fill-opacity" begin="0s" calcMode="linear"
                              dur="0.8s" from="1"
                              repeatCount="indefinite" to="1"
                              values="1;.5;1"/>
                  </circle>
               </svg>

               : icon
                  ? <>
                     {icon}
                     {!onlyIcon && <span>{children}</span>}
                  </>

                  : <span>{children}</span>}

         </button>

         {error && <div className={styles.textWrapper}>
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
         </div>}

         {success && <div className={styles.textWrapper}>
            <svg fill="none" height="25" viewBox="0 0 24 25"
                 width="24" xmlns="http://www.w3.org/2000/svg">
               <path d="M20.25 7.25L9.75 17.75L4.5 12.5" stroke="#16A34A" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
            </svg>
            <Text color="success" component="p" size="paragraph">
               {success}
            </Text>
         </div>}
      </div>
   )
}