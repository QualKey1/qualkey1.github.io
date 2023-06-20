import React from "react"

import axios from "axios"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useRouter } from "next/router"

import { authUrl } from "@constants/urls"
import { AuthFlowStepsEnum } from "@customTypes/common"
import { useAuthFlow } from "@hooks/useAuthFlow"
import { Button, Form, Input, Loading } from "@lib/components"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { FormDataType } from "@customTypes/common"
import type { IndexLayoutType } from "@customTypes/layouts"
import type { NextPage } from "next"

const IndexLayout = dynamic<IndexLayoutType>(() => import("@layouts/IndexLayout/IndexLayout").then(module => module.IndexLayout),
   { loading: () => <Loading isOpen={true}/> })

const forgotFormInitialState = { email: "", }

const authFlowStepsMapping = new Map([
   [AuthFlowStepsEnum.FORM, [
      "Forgot password",
      "Enter your email and we will send you a temporary password which you can change after login.",
      "Send Temporary Password"
   ]],
   [AuthFlowStepsEnum.SUCCESS, [
      "Check your email",
      "Now please use the temporary password we’ve sent to your email to login.",
      "Back to Login"
   ]],
])

const Forgot: NextPage = (): JSX.Element => {

   const router = useRouter()

   const [authFlowStep, setAuthFlowStep, currentAuthFlowStep] = useAuthFlow(authFlowStepsMapping)
   const [loading, setLoading] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")

   /**
    * Forgot form submit handler
    */
   const handleFormSubmit = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()
      const { email } = formData

      if (authFlowStep === AuthFlowStepsEnum.FORM) {
         setLoading(true)
         await axios.post(`${authUrl}/password-forgot`, { email }, { withCredentials: false })

            .then(res => {
               setLoading(false)
               if (res.status === 200) {
                  setAuthFlowStep(AuthFlowStepsEnum.SUCCESS)

               } else {
                  setError("Unexpected response")
               }
            })

            .catch(err => {
               if (err.response.status === 404) {
                  setLoading(false)
                  setError("User not found")
               } else {
                  handleAxiosError(err as never, setError, null, setLoading)
               }
            })
      }
   }

   /**
    * Handle back to login page
    */
   const handleBackToLogin = async (): Promise<void> => {
      await router.push("/login")
   }

   return (
      <>
         <Head>
            <title>Forgot Password | QualKey</title>
         </Head>

         <IndexLayout header={currentAuthFlowStep && currentAuthFlowStep[0]}
                      subheader={currentAuthFlowStep && currentAuthFlowStep[1]}>

            {authFlowStep === AuthFlowStepsEnum.FORM &&
               <Form handleFormSubmit={handleFormSubmit} initialState={forgotFormInitialState}>

                  <Input autoFocus fullWidth
                         required
                         name="email"
                         placeholder="Email"
                         type="email"/>

                  <Button fullWidth error={error}
                          loading={loading}
                          size="lg"
                          type="submit"
                          variant="primary">
                     {currentAuthFlowStep && currentAuthFlowStep[2]}
                  </Button>

                  <Button fullWidth icon={<svg fill="none" height="16" viewBox="0 0 19 16"
                                               width="19" xmlns="http://www.w3.org/2000/svg">
                     <path d="M17.75 8L1.25 8" stroke="#0880CE" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                     <path d="M7.75 14.75L1 8L7.75 1.25" stroke="#0880CE" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                  </svg>} loading={false}
                          size="lg"
                          style={{ marginTop: "6.4rem" }}
                          type="button"
                          variant="secondary"
                          onClick={(): Promise<boolean> => router.push("/login")}>
                     Go Back
                  </Button>
               </Form>}

            {authFlowStep === AuthFlowStepsEnum.SUCCESS && <Button fullWidth loading={false} size="lg"
                                                                   variant="primary"
                                                                   onClick={handleBackToLogin}>
               {currentAuthFlowStep && currentAuthFlowStep[2]}
            </Button>}

         </IndexLayout>
      </>
   )
}

export default Forgot