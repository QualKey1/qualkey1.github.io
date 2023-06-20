import React from "react"

import axios from "axios"

import { authUrl } from "@constants/urls"
import { AuthFlowStepsEnum } from "@customTypes/common"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { ErrorSetterType, LoadingSetterType } from "@customTypes/common"
import type { AuthFlowStepSetterType, UseGetOtpType } from "@customTypes/hooks"

const otpDataInitialState = {
   email: "",
   otpUuid: ""
}

/**
 * Get OTP handler
 */
export const useGetOtp = (
   activeStep: AuthFlowStepsEnum, setError: ErrorSetterType, setLoading?: LoadingSetterType, setAuthFlowStep?: AuthFlowStepSetterType, isForgotFlow?: boolean
): UseGetOtpType => {
   const [otpData, setOtpData] = React.useState(otpDataInitialState)

   const handleGetOtp = (email?: string): void => {
      axios.post(`${authUrl}/otp`, { email: email ?? otpData.email }, { withCredentials: true })

         .then(res => {
            setError("")
            if (res.status === 201) {
               setOtpData({
                  ...otpData,
                  otpUuid: res.data.otpUuid
               })

               if (isForgotFlow) {
                  if (email && setAuthFlowStep && setLoading) {
                     setOtpData({
                        ...otpData,
                        email: email,
                        otpUuid: res.data.otpUuid
                     })
                     setLoading(false)
                     setAuthFlowStep(AuthFlowStepsEnum.OTP)
                  } else {
                     setError("Unexpected error")
                  }
               }

            } else {
               setError("Unexpected response")
            }

         })
         .catch(err => {
            handleAxiosError(err as never, setError, null, setLoading)
         })
   }

   React.useEffect(() => {
      if (!isForgotFlow && activeStep === AuthFlowStepsEnum.OTP) {
         handleGetOtp()
      }

   }, [activeStep]) // eslint-disable-line react-hooks/exhaustive-deps

   return [otpData, setOtpData, handleGetOtp]
}