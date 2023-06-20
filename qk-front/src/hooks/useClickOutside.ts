import React, { RefObject } from "react"

/**
 * Click outside target to close it handler
 */
export const useClickOutside = (ref: RefObject<HTMLElement>, handler: (event: MouseEvent) => void ): void => {
   
   React.useEffect(() => {
      const listener = (event: MouseEvent): void => {
         if (!ref.current || ref.current.contains(event.target as Node)) {
            return
         }
         
         handler(event)
      }
      
      document.addEventListener("mousedown", listener)
      
      return () => {
         document.removeEventListener("mousedown", listener)
      }
   })
}