import React from "react"

import { otpTimerSeconds } from "@constants/otpTimerSeconds"
import { Text } from "@lib/components"

import type { ResendOtpType } from "@customTypes/components"

export const ResendOtp: React.FC<ResendOtpType> = ({ handleGetOtp }): JSX.Element => {

   const styles = { marginTop: "6.4rem", textAlign: "center" }

   const [seconds, setSeconds] = React.useState<number>(otpTimerSeconds)

   /**
    * OTP request handler
    */
   const handleOtpRequest = (): void => {
      handleGetOtp()
      setSeconds(otpTimerSeconds)
   }

   /**
    * OTP countdown handler
    */
   React.useEffect(() => {
      const intervalId = setInterval(() => {
         setSeconds(prevState => prevState - 1)
      }, 1000)
      if (seconds === 0) {
         clearInterval(intervalId)
      }
      return () => {
         clearInterval(intervalId)
      }
   }, [seconds])

   return (
      <>
         {seconds !== 0 && <Text thin color="500" component="p"
                           size="paragraph" style={styles}>
            00:{seconds < 10 ? `0${seconds}` : seconds}
         </Text>}
         {!seconds && <Text thin color="500" component="p"
                            size="paragraph"
                            style={{ ...styles, cursor: "pointer" }}
                            onClick={handleOtpRequest}>Resend OTP</Text>}
      </>
   )
}