import React from "react"

import { colorBrandBlue24 } from "@constants/styles"

export const LoadingComponent: React.FC = (): JSX.Element => {
   return (
      <svg height="58" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} viewBox="0 0 58 58"
           width="58"
           xmlns="http://www.w3.org/2000/svg">
         <g fill="none" fillRule="evenodd">
            <g stroke={colorBrandBlue24} strokeWidth="1.5" transform="translate(2 1)">
               <circle cx="42.601" cy="11.462" fill={colorBrandBlue24}
                       fillOpacity="1" r="5">
                  <animate attributeName="fill-opacity"
                           begin="0s" calcMode="linear"
                           dur="1.3s" repeatCount="indefinite"
                           values="1;0;0;0;0;0;0;0"/>
               </circle>
               <circle cx="49.063" cy="27.063" fill={colorBrandBlue24}
                       fillOpacity="0" r="5">
                  <animate attributeName="fill-opacity"
                           begin="0s" calcMode="linear"
                           dur="1.3s" repeatCount="indefinite"
                           values="0;1;0;0;0;0;0;0"/>
               </circle>
               <circle cx="42.601" cy="42.663" fill={colorBrandBlue24}
                       fillOpacity="0" r="5">
                  <animate attributeName="fill-opacity"
                           begin="0s" calcMode="linear"
                           dur="1.3s" repeatCount="indefinite"
                           values="0;0;1;0;0;0;0;0"/>
               </circle>
               <circle cx="27" cy="49.125" fill={colorBrandBlue24}
                       fillOpacity="0" r="5">
                  <animate attributeName="fill-opacity"
                           begin="0s" calcMode="linear"
                           dur="1.3s" repeatCount="indefinite"
                           values="0;0;0;1;0;0;0;0"/>
               </circle>
               <circle cx="11.399" cy="42.663" fill={colorBrandBlue24}
                       fillOpacity="0" r="5">
                  <animate attributeName="fill-opacity"
                           begin="0s" calcMode="linear"
                           dur="1.3s" repeatCount="indefinite"
                           values="0;0;0;0;1;0;0;0"/>
               </circle>
               <circle cx="4.938" cy="27.063" fill={colorBrandBlue24}
                       fillOpacity="0" r="5">
                  <animate attributeName="fill-opacity"
                           begin="0s" calcMode="linear"
                           dur="1.3s" repeatCount="indefinite"
                           values="0;0;0;0;0;1;0;0"/>
               </circle>
               <circle cx="11.399" cy="11.462" fill={colorBrandBlue24}
                       fillOpacity="0" r="5">
                  <animate attributeName="fill-opacity"
                           begin="0s" calcMode="linear"
                           dur="1.3s" repeatCount="indefinite"
                           values="0;0;0;0;0;0;1;0"/>
               </circle>
               <circle cx="27" cy="5" fill={colorBrandBlue24}
                       fillOpacity="0" r="5">
                  <animate attributeName="fill-opacity"
                           begin="0s" calcMode="linear"
                           dur="1.3s" repeatCount="indefinite"
                           values="0;0;0;0;0;0;0;1"/>
               </circle>
            </g>
         </g>
      </svg>
   )
}