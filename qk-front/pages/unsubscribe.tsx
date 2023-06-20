import React from "react"

import axios from "axios"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"

import { apiUrl } from "@constants/urls"
import { IndexLayout } from "@layouts/IndexLayout/IndexLayout"
import { Button, Heading, Text } from "@lib/components"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { NextPage } from "next"

const Unsubscribe: NextPage = (): JSX.Element => {

   const router = useRouter()

   const [activeStep, setActiveStep] = React.useState<number>(1)
   const [loading, setLoading] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")

   const handleUnsubscribe = async (): Promise<void> => {

      if (router.query.email) {
         setLoading(true)
         await axios.get(`${apiUrl}/email/unsubscribe?email=${router.query.email}`)

            .then(res => {
               setLoading(false)
               if (res.status === 200) {
                  setActiveStep(prevState => prevState + 1)

               } else {
                  setError("Unexpected response")
               }

            })

            .catch(err => {
               handleAxiosError(err as never, setError, null, setLoading)
            })

      } else {
         setError("User not found")
      }

   }

   const handleBackToLogin = async (): Promise<void> => {
      await router.push("/dashboard")
   }

   return (
      <IndexLayout>

         {activeStep === 1 && <>
            <Heading color="blue" component="h3" size="md">
               Do you wish to unsubscribe from our newsletter?
            </Heading>
            <Text color="800" component="p" size="paragraph"
                  style={{ marginTop: "1.6rem" }}>
               If you unsubscribe, you will stop receiving our newsletter and updates by email.
            </Text>
            <Button fullWidth error={error} loading={loading}
                       size="lg"
                       variant="primary"
                       onClick={handleUnsubscribe}>
                  Unsubscribe
            </Button>
            <Button fullWidth loading={false} size="lg"
                       variant="secondary"
                       onClick={handleBackToLogin}>
                  Back to login
            </Button>
         </>}

         {activeStep === 2 && <>
            <Heading color="blue" component="h3" size="md">
               Thank you and farewell
            </Heading>
            <Text color="800" component="p" size="paragraph"
                  style={{ marginTop: "1.6rem" }}>
               {router.query.email} has been unsubscribed from QualKey. You will no longer receive newsletters and
               update emails from us. You can always resubscribe by visiting Security & Privacy tab on your Settings
               page. You may close this page now.
            </Text>
            <Button fullWidth loading={false} size="lg"
                    variant="primary"
                    onClick={handleBackToLogin}>
               Back to login
            </Button>
         </>}

      </IndexLayout>
   )
}

export default Unsubscribe

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const { query } = ctx
   
   if (!query.email) {
      return { redirect: { destination: "/dashboard", permanent: false } }
   }
   
   return { props: {} }
   
}



