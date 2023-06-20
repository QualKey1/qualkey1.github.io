import React from "react"

import axios from "axios"
import { getCookie } from "cookies-next"
import dynamic from "next/dynamic"
import Head from "next/head"

import { apiUrl } from "@constants/urls"
import { Heading, Loading, LoadingComponent } from "@lib/components"

import type { MainLayoutType } from "@customTypes/layouts"
import type { PublicPageType } from "@customTypes/pages"
import type { GetServerSideProps, NextPage } from "next"

const MainLayout = dynamic<MainLayoutType>(() => import("@layouts/MainLayout/MainLayout").then(module => module.MainLayout),
   { loading: () => <Loading isOpen={true}/> })
const FaqComponent = dynamic<Record<string, unknown>>(() => import("@components/Faq/Faq")
   .then(module => module.FaqComponent), { loading: () => <LoadingComponent/> })

const HelpFaq: NextPage<PublicPageType> = ({ userData, actionData, shareId }): JSX.Element => {
   
   return (
      <>
         <Head>
            <title>Help & FAQ | QualKey</title>
         </Head>

         <MainLayout actionData={actionData} shareId={shareId} userData={userData}>
            <Heading color="blue" component="h1" size="lg">
               Help & FAQ
            </Heading>
            <FaqComponent/>
         </MainLayout>
      </>
   )
}

export default HelpFaq

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
         return { props: { userData: { role: "PUBLIC" } } }
      }
      return { props: {} }
   }
}