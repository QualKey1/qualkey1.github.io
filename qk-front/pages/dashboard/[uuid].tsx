import React from "react"

import axios from "axios"
import { deleteCookie, setCookie } from "cookies-next"
import dynamic from "next/dynamic"
import Head from "next/head"

import { Heading, LoadingComponent } from "@components/../../src/lib/components"
import { Loading } from "@components/../../src/lib/components/Loading/Loading"
import { apiUrl } from "@constants/urls"
import { UserRoleEnum } from "@interfaces/user.interface"

import type { StudentDashboardUuidType, UniversityDashboardUuidType } from "@customTypes/components"
import type { MainLayoutType } from "@customTypes/layouts"
import type { DashboardUuidPageType } from "@customTypes/pages"
import type { GetServerSideProps, NextPage } from "next"

import Error from "../_error"

const MainLayout = dynamic<MainLayoutType>(() => import("@layouts/MainLayout/MainLayout")
   .then(module => module.MainLayout), { loading: () => <Loading isOpen={true}/> })
const StudentDashboardUuid = dynamic<StudentDashboardUuidType>(() => import("@components/Student/StudentDashboardUuid/StudentDashboardUuid")
   .then(module => module.StudentDashboardUuid), { loading: () => <LoadingComponent/> })
const UniversityDashboardUuid = dynamic<UniversityDashboardUuidType>(() => import("@components/University/UniversityDashboardUuid/UniversityDashboardUuid")
   .then(module => module.UniversityDashboardUuid))

export const DashboardUuid: NextPage<DashboardUuidPageType> = ({
   credentialsData,
   actionData,
   userData,
   serverErrorMessage
}): JSX.Element => {

   if (serverErrorMessage) return <Error serverErrorMessage={serverErrorMessage}/>

   return (
      <>
         <Head>
            <title>View Credentials | QualKey</title>
         </Head>

         <MainLayout actionData={actionData} userData={userData}>
            <Heading color="blue" component="h1" size="lg">
               View Credentials
            </Heading>
            <Heading color="800" component="h2" size="subDisplay"
                     style={{ marginTop: ".8rem" }}>
               {userData.role === UserRoleEnum.INSTITUTION_REPRESENTATIVE && "browse all credential records"}
               {userData.role === UserRoleEnum.STUDENT && "view, share and manage your credentials"}
            </Heading>

            {userData.role === UserRoleEnum.STUDENT &&
               <StudentDashboardUuid data={credentialsData[0]} name={userData.fullName}/>}

            {userData.role === UserRoleEnum.INSTITUTION_REPRESENTATIVE
               && <UniversityDashboardUuid data={credentialsData[0]}/>}
         </MainLayout>
      </>
   )
}

export default DashboardUuid

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const { req, res, query } = ctx

   res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
   )

   deleteCookie("credentialShare", ctx)
   deleteCookie("publicShare", ctx)
   deleteCookie("redirect", ctx)

   try {
      const credentialResponse = await axios.get(`${apiUrl}/credential?uuid=${query.uuid}`, {
         withCredentials: true,
         headers: { Cookie: req.headers.cookie || "" }
      })
      const { data: credentialsData } = credentialResponse

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

      return { props: { credentialsData, userData, actionData } }

   } catch (err) {
      if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
         return { props: { serverErrorMessage: "Network error, connection refused" } }
      }
      if (err.response.status === 401) {
         setCookie("redirect", req.url, ctx)
         return { redirect: { destination: "/login", permanent: false } }
      }
      return { props: {} }
   }
}