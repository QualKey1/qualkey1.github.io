import React from "react"

import axios from "axios"
import dynamic from "next/dynamic"
import Head from "next/head"

import { apiUrl } from "@constants/urls"
import { Heading, Loading, LoadingComponent } from "@lib/components"

import type { SettingsType } from "@customTypes/components"
import type { MainLayoutType } from "@customTypes/layouts"
import type { SettingsPageType } from "@customTypes/pages"
import type { GetServerSideProps , NextPage } from "next"

import Error from "./_error"

const MainLayout = dynamic<MainLayoutType>(() => import("@layouts/MainLayout/MainLayout")
   .then(module => module.MainLayout), { loading: () => <Loading isOpen={true}/> })
const SettingsComponent = dynamic<SettingsType>(() => import("@components/Settings/SettingsComponent")
   .then(module => module.SettingsComponent), { loading: () => <LoadingComponent/> })

const Settings: NextPage<SettingsPageType> = ({ serverErrorMessage, userData, actionData }): JSX.Element => {
   
   if (serverErrorMessage) return <Error serverErrorMessage={serverErrorMessage}/>
   
   return (
      <>
         <Head>
            <title>Settings | QualKey</title>
         </Head>

         <MainLayout actionData={actionData} userData={userData}>
            <Heading color="blue" component="h1" size="lg">
               Settings
            </Heading>
            
            <SettingsComponent userData={userData}/>
         </MainLayout>
      </>
   )
}

export default Settings

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