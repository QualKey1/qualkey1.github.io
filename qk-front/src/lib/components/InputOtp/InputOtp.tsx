import React from "react"

import PinInput from "react-pin-input"

import { FormContext } from "@lib/components"

import type { InputOtpType } from "@customTypes/lib/components/inputOtp.type"

export const InputOtp: React.FC<InputOtpType> = ({ setPinInput }): JSX.Element => {

   const formContext = React.useContext(FormContext)
   const { handleInputOtpChange } = formContext

   return (
      <>
         {handleInputOtpChange && <PinInput ref={(n): void => setPinInput(n)}
                                            focus
                                            initialValue=""
                                            inputMode="number"
                                            length={4}
                                            regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                                            type="numeric"
                                            onComplete={(value): void => handleInputOtpChange(value)}
         />}
      </>
   )
}