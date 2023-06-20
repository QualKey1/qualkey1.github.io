import React from "react"

import axios from "axios"
import dynamic from "next/dynamic"
import Head from "next/head"

import { apiUrl } from "@constants/urls"
import { MainLayout } from "@layouts/MainLayout/MainLayout"
import { Heading, LoadingComponent } from "@lib/components"

import type { AnalyticsComponentType } from "@customTypes/components"
import type { AnalyticsPageType } from "@customTypes/pages"
import type { GetServerSideProps, NextPage } from "next"

import Error from "./_error"

const AnalyticsComponent = dynamic<AnalyticsComponentType>(() => import("@components/Analytics/AnalyticsComponent")
   .then(module => module.AnalyticsComponent), { loading: () => <LoadingComponent/> })

const Analytics: NextPage<AnalyticsPageType> = ({ userData, actionData, statsData, serverErrorMessage }): JSX.Element => {

   if (serverErrorMessage) return <Error serverErrorMessage={serverErrorMessage}/>

   return (
      <>
         <Head>
            <title>Analytics | QualKey</title>
         </Head>

         <MainLayout actionData={actionData} userData={userData}>
            <Heading color="blue" component="h1" size="lg">
               Analytics
            </Heading>
            <Heading color="800" component="h2" size="subDisplay"
                     style={{ marginTop: ".8rem" }}>
               dashboard of key performance indicators
            </Heading>

            {statsData && <AnalyticsComponent statsData={statsData}/>}
         </MainLayout>
      </>
         
   )
}

export default Analytics

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const { req, res, query } = ctx

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

      const statsResponse = await axios.get(`${apiUrl}/stats`, {
         params: {
            filter: query.search ? query.search as string : undefined,
            dateCreatedFrom: query.from ? query.from as string : undefined,
            dateCreatedUntil: query.to ? parseInt(query.to as string) + 1 : undefined
         },
         withCredentials: true,
         headers: { Cookie: req.headers.cookie || "" }
      })
      const { data: statsData } = statsResponse

      return { props: { userData, actionData, statsData } }

   } catch (err) {
      if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
         return { props: { serverErrorMessage: "Network error, connection refused" } }
      }
      if (err.response.status === 401) {
         return { redirect: { destination: "/login", permanent: false } }
      }
      if (err.response.status === 404) {
         return { redirect: { destination: "/dashboard", permanent: false } }
      }
      return { props: {} }
   }
}