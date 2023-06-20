import React from "react"

import { redirectPaymentSeconds } from "@constants/redirectPaymentSeconds"
import { Heading } from "@lib/components"

import type { PaymentCountdownType } from "@customTypes/components"

export const PaymentCountdown: React.FC<PaymentCountdownType> = ({ handleReturn }): JSX.Element => {

   const [seconds, setSeconds] = React.useState<number>(redirectPaymentSeconds)

   /**
    * Redirect home countdown handler
    */
   React.useEffect(() => {
      const intervalId = setInterval(() => {
         setSeconds(prevState => prevState - 1)
      }, 1000)
      if (seconds === 0) {
         handleReturn()
         clearInterval(intervalId)
      }
      return () => {
         clearInterval(intervalId)
      }
   }, [seconds, handleReturn])
   
   return (
      <Heading color="800" component="p" size="sm"
               style={{ textAlign: "center" }}>
         You will be re-directed back to the dashboard in {seconds}...
      </Heading>
   )
}