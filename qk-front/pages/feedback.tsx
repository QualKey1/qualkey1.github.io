import React from "react"

import axios from "axios"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useRouter } from "next/router"

import { apiUrl } from "@constants/urls"
import { Heading, Loading, LoadingComponent } from "@lib/components"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { FormDataType } from "@customTypes/common"
import type { MessageFormType } from "@customTypes/components"
import type { MainLayoutType } from "@customTypes/layouts"
import type { PublicPageType } from "@customTypes/pages"
import type { GetServerSideProps, NextPage } from "next"

const messageFormInitialState = { message: "" }

const MainLayout = dynamic<MainLayoutType>(() => import("@layouts/MainLayout/MainLayout")
   .then(module => module.MainLayout), { loading: () => <Loading isOpen={true}/> })
const MessageForm = dynamic<MessageFormType>(() => import("@components/MessageForm/MessageForm")
   .then(module => module.MessageForm), { loading: () => <LoadingComponent/> })

const Feedback: NextPage<PublicPageType> = ({ userData, actionData }): JSX.Element => {

   const router = useRouter()

   const [loading, setLoading] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")
   const [success, setSuccess] = React.useState<string>("")

   /**
    * Feedback form submit handler
    */
   const handleFormSubmit = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      const { message } = formData
      event.preventDefault()
      if ((message as string).trim() === "") {
         setError("Please enter a message")

      } else {
         setError("")
         setLoading(true)

         await axios.post(`${apiUrl}/email/info`, {
            senderEmail: userData.email,
            subject: "Feedback",
            emailText: message
         }, { withCredentials: true })

            .then(res => {
               setError("")
               setLoading(false)
               if (res.status === 201) {
                  setSuccess("Your feedback has been sent!")
                  setTimeout(() => {
                     router.reload()
                  }, 1500)
               } else {
                  setError("Unexpected response")
               }
            })

            .catch(err => {
               setSuccess("")
               handleAxiosError(err as never, setError, null, setLoading)
            })
      }
   }

   return (
      <>
         <Head>
            <title>Give Feedback | QualKey</title>
         </Head>

         <MainLayout actionData={actionData} userData={userData}>
            <Heading color="blue" component="h1" size="lg">
               Give Feedback
            </Heading>

            <MessageForm isFeedback error={error} formInitialState={messageFormInitialState}
                         handleFormSubmit={handleFormSubmit}
                         loading={loading} success={success}/>
         </MainLayout>
      </>
   )
}

export default Feedback

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const { req, res } = ctx

   res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
   )

   try {
      const userResponse = await axios.get(`${apiUrl}/user/me`, {
         withCredentials: true,
         headers: { Cookie: req.headers.cookie || "" }
      })
      const { data: userData } = userResponse

      const actionResponse = await axios.get(`${apiUrl}/action`, {
         withCredentials: true,
         headers: { Cookie: req.headers.cookie || "" }
      })
      const { data: actionData } = actionResponse

      return { props: { userData, actionData } }

   } catch (err) {
      if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
         return { props: { serverErrorMessage: "Network error, connection refused" } }
      }
      if (err.response.status === 401) {
         return { redirect: { destination: "/login", permanent: false } }
      }
      return { props: {} }
   }
}