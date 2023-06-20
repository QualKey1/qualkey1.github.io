import React from "react"

import axios from "axios"
import { deleteCookie } from "cookies-next"
import dynamic from "next/dynamic"
import Head from "next/head"

import { apiUrl } from "@constants/urls"
import { UserRoleEnum } from "@interfaces/user.interface"
import { Heading, Loading, LoadingComponent } from "@lib/components"

import type { DashboardType, StudentDashboardType } from "@customTypes/components"
import type { MainLayoutType } from "@customTypes/layouts"
import type { DashboardPageType } from "@customTypes/pages"
import type { ICredential } from "@interfaces/credentials.interface"
import type { GetServerSideProps, NextPage } from "next"

import Error from "../_error"

const MainLayout = dynamic<MainLayoutType>(() => import("@layouts/MainLayout/MainLayout")
   .then(module => module.MainLayout), { loading: () => <Loading isOpen={true}/> })
const StudentDashboard = dynamic<StudentDashboardType>(() => import("@components/Student/StudentDashboard/StudentDashboard")
   .then(module => module.StudentDashboard), { loading: () => <LoadingComponent/> })
const UniversityDashboard = dynamic<DashboardType>(() => import("@components/University/UniversityDashboard/UniversityDashboard")
   .then(module => module.UniversityDashboard), { loading: () => <LoadingComponent/> })

const Dashboard: NextPage<DashboardPageType> = ({ serverErrorMessage, credentialsData, userData, actionData }): JSX.Element => {

   if (serverErrorMessage) return <Error serverErrorMessage={serverErrorMessage}/>

   return (
      <>
         <Head>
            <title>
               Dashboard | Qualkey
            </title>
         </Head>
      
         <MainLayout actionData={actionData} userData={userData}>
            <Heading color="blue" component="h1" size="lg">
               {userData.role === UserRoleEnum.INSTITUTION_REPRESENTATIVE && "University Dashboard"}
               {userData.role === UserRoleEnum.STUDENT && "Credentials Dashboard"}
            </Heading>
            <Heading color="800" component="h2" size="subDisplay"
                     style={{ marginTop: ".8rem" }}>
               {userData.role === UserRoleEnum.INSTITUTION_REPRESENTATIVE && "browse all records"}
               {userData.role === UserRoleEnum.STUDENT && "view, share and manage your credentials"}
            </Heading>

            {userData.role === UserRoleEnum.INSTITUTION_REPRESENTATIVE && <UniversityDashboard data={credentialsData}/>}
            {userData.role === UserRoleEnum.STUDENT && <StudentDashboard data={credentialsData as unknown as ICredential[]} name={userData.fullName ?? "Full Name"}/>}
         </MainLayout>
      </>
   )
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const { req, query } = ctx

   deleteCookie("credentialShare", ctx)
   deleteCookie("credentialActivation", ctx)
   deleteCookie("publicShare", ctx)

   try {
      const credentialResponse = await axios.get(`${apiUrl}/credential`, {
         params: {
            filter: query.search ? query.search as string : undefined,
            dateCreatedFrom: query.from ? query.from : undefined,
            dateCreatedUntil: query.to ? parseInt(query.to as string) + 1 : undefined
         },
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
         return { redirect: { destination: "/login", permanent: false } }
      }
      return { props: {} }
   }
}
