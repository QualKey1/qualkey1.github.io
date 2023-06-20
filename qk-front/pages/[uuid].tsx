import React from "react"

import axios from "axios"
import { setCookie } from "cookies-next"
import dynamic from "next/dynamic"
import Head from "next/head"

import { apiUrl, url } from "@constants/urls"
import { Heading, Loading, LoadingComponent } from "@lib/components"

import type { CertificateType } from "@customTypes/components"
import type { MainLayoutType } from "@customTypes/layouts"
import type { UuidPublicPageType } from "@customTypes/pages"
import type { GetServerSideProps } from "next"

import Error from "./_error"

const MainLayout = dynamic<MainLayoutType>(() => import("@layouts/MainLayout/MainLayout").then(module => module.MainLayout),
   { loading: () => <Loading isOpen={true}/> })
const Certificate = dynamic<CertificateType>(() => import("@components/Certificate/Certificate")
   .then(module => module.Certificate), { loading: () => <LoadingComponent/> })

const UuidPublicShare: React.FC<UuidPublicPageType> = ({
   userData,
   shareData,
   shareId,
   serverErrorMessage
}): JSX.Element => {

   if (serverErrorMessage) return <Error serverErrorMessage={serverErrorMessage}/>

   return (
      <>
         <Head>
            <title>Shared Credentials | QualKey</title>
            <meta content="Shared Credentials | QualKey" property="og:title"/>
            <meta content="https://public-images-qualkey-test.s3.eu-north-1.amazonaws.com/qk_share.png"
                  property="og:image"/>
            <meta content={`${shareData.graduatedName} has shared their credentials with you`}
                  property="og:description"/>
            <meta content={`${url}/${shareId}`} property="og:url"/>
         </Head>
         <MainLayout shareId={shareId} userData={userData}>
            <Heading color="blue" component="h1" size="lg"
                     style={{ marginBottom: "4.8rem" }}>
               {shareData.graduatedName} has shared their credentials with you,
            </Heading>
            <Certificate showQR data={shareData}/>
         </MainLayout>
      </>
   )
}

export default UuidPublicShare

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const { res, query } = ctx

   res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
   )

   try {
      const shareResponse = await axios.get(`${apiUrl}/credential/${query.uuid}`)
      const { data: shareData } = shareResponse

      if (shareData) {
         setCookie("publicShare", true, ctx)
         setCookie("credentialShare", `${query.uuid}`, ctx)
      }

      return { props: { userData: { role: "SHARED" }, shareData, shareId: `${query.uuid}` } }

   } catch (err) {
      if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
         return { props: { serverErrorMessage: "Network error, connection refused" } }
      }
      if (err.response.status === 404) {
         return { props: { serverErrorMessage: "Not found" } }
      }
      if (err.response.status === 403) {
         return { props: { serverErrorMessage: err.response.data.message } }
      }
      return { props: {} }
   }
}