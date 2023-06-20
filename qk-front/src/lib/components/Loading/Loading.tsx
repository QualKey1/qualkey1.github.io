import React from "react"

import { Text } from "@lib/components"

import type { LoadingType } from "@customTypes/lib/components"

import styles from "./Loading.module.scss"

export const Loading: React.FC<LoadingType> = ({ isOpen }): JSX.Element => {
   return (
      <>
         {isOpen && <div className={styles.loading}>
            <svg height="58" viewBox="0 0 58 58" width="58"
                 xmlns="http://www.w3.org/2000/svg">
               <g fill="none" fillRule="evenodd">
                  <g stroke="#FFF" strokeWidth="1.5" transform="translate(2 1)">
                     <circle cx="42.601" cy="11.462" fill="#fff"
                             fillOpacity="1" r="5">
                        <animate attributeName="fill-opacity"
                                 begin="0s" calcMode="linear"
                                 dur="1.3s" repeatCount="indefinite"
                                 values="1;0;0;0;0;0;0;0"/>
                     </circle>
                     <circle cx="49.063" cy="27.063" fill="#fff"
                             fillOpacity="0" r="5">
                        <animate attributeName="fill-opacity"
                                 begin="0s" calcMode="linear"
                                 dur="1.3s" repeatCount="indefinite"
                                 values="0;1;0;0;0;0;0;0"/>
                     </circle>
                     <circle cx="42.601" cy="42.663" fill="#fff"
                             fillOpacity="0" r="5">
                        <animate attributeName="fill-opacity"
                                 begin="0s" calcMode="linear"
                                 dur="1.3s" repeatCount="indefinite"
                                 values="0;0;1;0;0;0;0;0"/>
                     </circle>
                     <circle cx="27" cy="49.125" fill="#fff"
                             fillOpacity="0" r="5">
                        <animate attributeName="fill-opacity"
                                 begin="0s" calcMode="linear"
                                 dur="1.3s" repeatCount="indefinite"
                                 values="0;0;0;1;0;0;0;0"/>
                     </circle>
                     <circle cx="11.399" cy="42.663" fill="#fff"
                             fillOpacity="0" r="5">
                        <animate attributeName="fill-opacity"
                                 begin="0s" calcMode="linear"
                                 dur="1.3s" repeatCount="indefinite"
                                 values="0;0;0;0;1;0;0;0"/>
                     </circle>
                     <circle cx="4.938" cy="27.063" fill="#fff"
                             fillOpacity="0" r="5">
                        <animate attributeName="fill-opacity"
                                 begin="0s" calcMode="linear"
                                 dur="1.3s" repeatCount="indefinite"
                                 values="0;0;0;0;0;1;0;0"/>
                     </circle>
                     <circle cx="11.399" cy="11.462" fill="#fff"
                             fillOpacity="0" r="5">
                        <animate attributeName="fill-opacity"
                                 begin="0s" calcMode="linear"
                                 dur="1.3s" repeatCount="indefinite"
                                 values="0;0;0;0;0;0;1;0"/>
                     </circle>
                     <circle cx="27" cy="5" fill="#fff"
                             fillOpacity="0" r="5">
                        <animate attributeName="fill-opacity"
                                 begin="0s" calcMode="linear"
                                 dur="1.3s" repeatCount="indefinite"
                                 values="0;0;0;0;0;0;0;1"/>
                     </circle>
                  </g>
               </g>
            </svg>
            <Text color="000" component="p" size="paragraph"
                  style={{ marginTop: "1.2rem" }}>
               Loading...
            </Text>
         </div>}
      </>
   )
}