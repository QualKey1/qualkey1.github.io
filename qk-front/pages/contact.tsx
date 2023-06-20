import React from "react"

import axios from "axios"
import { getCookie } from "cookies-next"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useRouter } from "next/router"

import { apiUrl } from "@constants/urls"
import { UserRoleEnum } from "@interfaces/user.interface"
import { Heading, Loading, LoadingComponent } from "@lib/components"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { FormDataType } from "@customTypes/common"
import type { MessageFormType } from "@customTypes/components"
import type { MainLayoutType } from "@customTypes/layouts"
import type { PublicPageType } from "@customTypes/pages"
import type { GetServerSideProps, NextPage } from "next"

const MainLayout = dynamic<MainLayoutType>(() => import("@layouts/MainLayout/MainLayout")
   .then(module => module.MainLayout), { loading: () => <Loading isOpen={true}/> })
const MessageForm = dynamic<MessageFormType>(() => import("@components/MessageForm/MessageForm")
   .then(module => module.MessageForm), { loading: () => <LoadingComponent/> })

const messageFormInitialState = {
   options: [],
   message: ""
}

const messageFormInitialStateShare = {
   email: "",
   name: "",
   options: [],
   message: ""
}

const messageTopics = [
   "General Inquiry",
   "Give Feedback",
   "Technical Inquiry",
   "Other"
]

const ContactUs: NextPage<PublicPageType> = ({ userData, actionData, shareId }): JSX.Element => {

   const router = useRouter()
   
   const [loading, setLoading] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")
   const [success, setSuccess] = React.useState<string>("")

   /**
    * Contact form submit handler
    */
   const handleFormSubmit = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      const { email, name, options, message } = formData
      event.preventDefault()
      if (!(options as string[]).length) {
         setError("Please select Topic")
      } else if ((message as string).trim() === "") {
         setError("Please enter a message")

      } else {
         setError("")
         setLoading(true)

         const initialMessagePart = name && `Message from ${name}! `

         const messageFormData = {
            senderEmail: userData.email ?? email,
            subject: (options as string[])[0],
            emailText: initialMessagePart ? initialMessagePart as string + message : message,
         }

         await axios.post(`${apiUrl}/email/info`, messageFormData, { withCredentials: true })

            .then(res => {
               setError("")
               setLoading(false)
               if (res.status === 201) {
                  setSuccess("Your message has been sent!")
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
            <title>Contact Us | QualKey</title>
         </Head>

         <MainLayout actionData={actionData} shareId={shareId} userData={userData}>
            <Heading color="blue" component="h1" size="lg">
               Contact Us
            </Heading>

            {userData.role !== UserRoleEnum.SHARED &&
               <MessageForm error={error} formInitialState={messageFormInitialState} handleFormSubmit={handleFormSubmit}
                            loading={loading}
                            selectLabel="Select Topic"
                            selectOptions={messageTopics}
                            success={success}/>}

            {userData.role === UserRoleEnum.SHARED &&
               <MessageForm isCredentialShare error={error} formInitialState={messageFormInitialStateShare}
                            handleFormSubmit={handleFormSubmit}
                            loading={loading}
                            selectLabel="Select Topic"
                            selectOptions={messageTopics}
                            success={success}/>}
         </MainLayout>
      </>
   )
}

export default ContactUs

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const { req, res } = ctx

   res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
   )

   const shareId = getCookie("credentialShare", ctx)

   if (shareId) {
      return {
         props:
            { userData: { role: "SHARED" }, shareId }
      }
   }

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