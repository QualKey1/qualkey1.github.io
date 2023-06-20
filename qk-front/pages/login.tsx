import React from "react"

import axios from "axios"
import { getCookie } from "cookies-next"
import dynamic from "next/dynamic"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

import { ResendOtp } from "@components/ResendOtp/ResendOtp"
import { authUrl } from "@constants/urls"
import { AuthFlowStepsEnum } from "@customTypes/common"
import { useAuthFlow } from "@hooks/useAuthFlow"
import { useGetOtp } from "@hooks/useGetOtp"
import { Button, Checkbox, Form, Input, InputOtp, Loading, Text } from "@lib/components"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { FormDataType } from "@customTypes/common"
import type { IndexLayoutType } from "@customTypes/layouts"
import type { NextPage } from "next"
import type PinInput from "react-pin-input"

const IndexLayout = dynamic<IndexLayoutType>(() => import("@layouts/IndexLayout/IndexLayout").then(module => module.IndexLayout),
   { loading: () => <Loading isOpen={true}/> })

const loginFormInitialState = {
   email: "",
   password: "",
   rememberMe: false,
   otp: ""
}

const authFlowStepsMapping = new Map([
   [AuthFlowStepsEnum.FORM, ["Login", undefined, "Login"]],
   [AuthFlowStepsEnum.OTP, [
      "Check your email",
      "Enter the 4-digit code we’ve sent to your email and then choose your new password",
      "Enter"
   ]],
])

const Home: NextPage = (): JSX.Element => {
   const router = useRouter()
   const [authFlowStep, setAuthFlowStep, currentAuthFlowStepData] = useAuthFlow(authFlowStepsMapping)
   const [pinInput, setPinInput] = React.useState<PinInput | null>(null)
   const [loading, setLoading] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")
   const [otpData, setOtpData, handleGetOtp] = useGetOtp(authFlowStep, setError)

   /**
    * Login form submit handler
    */
   const handleFormSubmit = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()
      setLoading(true)

      if (authFlowStep === AuthFlowStepsEnum.FORM) {
         const { email, password, rememberMe } = formData

         await axios.post(`${authUrl}/check`, {
            email: email as string,
            password: password as string,
            rememberMe: (rememberMe as boolean).toString()
         }, { withCredentials: true })

            .then(res => {
               setLoading(false)
               setError("")
               if (res.status === 200) {
                  setOtpData({
                     ...otpData,
                     email: email as string
                  })
                  setAuthFlowStep(AuthFlowStepsEnum.OTP)

               } else {
                  setError("Unexpected response")
               }

            })
            .catch(err => {
               handleAxiosError(err as never, setError, pinInput, setLoading)
            })
      }

      if (authFlowStep === AuthFlowStepsEnum.OTP) {
         await axios.post(`${authUrl}/login`, { ...formData, otpUuid: otpData.otpUuid }, { withCredentials: true })

            .then(res => {
               setLoading(false)
               setError("")
               if (res.status === 200) {
                  const isRedirectRequired = getCookie("redirect")
                  if (!isRedirectRequired) {
                     router.push("/dashboard")

                  } else {
                     router.push(isRedirectRequired as string)
                  }

               } else {
                  setError("Unexpected response")
               }

            })
            .catch(err => {
               handleAxiosError(err as never, setError, pinInput, setLoading)
            })
      }
   }

   return (
      <>
         <Head>
            <title>Login | QualKey</title>
         </Head>

         <IndexLayout header={currentAuthFlowStepData && currentAuthFlowStepData[0]}
                      subheader={currentAuthFlowStepData && currentAuthFlowStepData[1]}>

            <Form handleFormSubmit={handleFormSubmit} initialState={loginFormInitialState}>

               {authFlowStep === AuthFlowStepsEnum.FORM && <>
                  <Input autoFocus fullWidth
                         required
                         name="email"
                         placeholder="Email"
                         type="email"/>
                  <Input fullWidth
                         required
                         name="password"
                         placeholder="Password"
                         type="password"/>
                  <div className="auth__remember">
                     <Checkbox color="500" label="Remember me"
                               name="rememberMe"/>
                     <Link passHref href="/forgot">
                        <Text underline color="darkblue"
                              component="a" size="label">
                           Forgot Password?
                        </Text>
                     </Link>
                  </div>
               </>}

               {authFlowStep === AuthFlowStepsEnum.OTP && <InputOtp setPinInput={setPinInput}/>}

               <Button fullWidth error={error} loading={loading}
                       size="lg"
                       type="submit"
                       variant="primary">
                  {currentAuthFlowStepData && currentAuthFlowStepData[2]}
               </Button>

               {authFlowStep === AuthFlowStepsEnum.OTP &&
                  <ResendOtp handleGetOtp={handleGetOtp}/>
               }
            </Form>
         </IndexLayout>
      </>
   )
}

export default Home
