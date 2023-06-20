import React from "react"

import axios from "axios"
import { deleteCookie, setCookie } from "cookies-next"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useRouter } from "next/router"

import { dashboardPageMaxWidth } from "@constants/styles"
import { apiUrl, authUrl } from "@constants/urls"
import { ShareItemType } from "@customTypes/components"
import { Button, Form, Heading, Input, Loading, LoadingComponent, Text } from "@lib/components"

import type { FormDataType } from "@customTypes/common"
import type { MainLayoutType } from "@customTypes/layouts"
import type { ModalType } from "@customTypes/lib/components"
import type { SharedUuidPageType } from "@customTypes/pages"
import type { GetServerSideProps, NextPage } from "next"

import Error from "../_error"

const temporaryPassInitialState = { password: "" }

const MainLayout = dynamic<MainLayoutType>(() => import("@layouts/MainLayout/MainLayout").then(module => module.MainLayout),
   { loading: () => <Loading isOpen={true}/> })
const Modal = dynamic<ModalType>(() => import("@lib/components").then(module => module.Modal))
const ShareItem = dynamic<ShareItemType>(() => import("@components/Share/ShareItem")
   .then(module => module.ShareItem), { loading: () => <LoadingComponent/> })

const ShareUuid: NextPage<SharedUuidPageType> = ({ serverErrorMessage, userData, shareData, shareId }): JSX.Element => {

   const { query, replace } = useRouter()

   const [loading, setLoading] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")

   /**
    * Temporary pass form submit handler
    */
   const handleFormSubmit = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()
      setLoading(true)
      await axios.get(`${apiUrl}/credential/share/${query.uuid}?password=${formData.password}`)

         .then(res => {
            setLoading(false)
            setError("")
            if (res.status === 200) {
               replace({
                  pathname: "/share/[uuid]",
                  query: { uuid: query.uuid, password: formData.password as string }
               })
            } else {
               setError("Unexpected response")
            }
         })

         .catch(err => {
            setLoading(false)
            if (err.response.status === 404) {
               replace({
                  pathname: "/share/[uuid]",
                  query: { uuid: query.uuid, password: formData.password as string }
               })

            } else if (err.response.status === 403) {
               setError("Incorrect password")
            }
         })
   }

   /**
    * Required to get rid of UI conflict when active JWT token is on /share/[uuid] page
    */
   React.useEffect(() => {
      axios.post(`${authUrl}/logout`, {}, { withCredentials: true })
         .catch(err => {
            console.error(err)
         })
   }, [])

   if (serverErrorMessage) return <Error serverErrorMessage={serverErrorMessage}/>

   return (
      <>
         <Head>
            <title>Shared Credentials | QualKey</title>
         </Head>

         {shareData && <MainLayout shareId={shareId} userData={userData}>
            <Heading color="blue" component="h1" size="lg">
               {shareData && shareData[0].graduatedName} has shared their credentials with you
            </Heading>
            <Heading color="800" component="h2" size="subDisplay"
                     style={{ marginTop: ".8rem" }}>
               viewing shared credentials
            </Heading>

            <div style={{ marginTop: "4.8rem", maxWidth: dashboardPageMaxWidth }}>
               {shareData.map(item => (
                  <ShareItem key={item.did} data={item} length={shareData?.length}/>
               ))}
            </div>

         </MainLayout>}

         {!shareData && <Modal handleCloseModal={(): void => void 0} isOpen={true} style={{ paddingBottom: "6.4rem" }}>
            <Form handleFormSubmit={handleFormSubmit} initialState={temporaryPassInitialState}>
               <Heading color="blue" component="h3" size="md"
                        style={{ textAlign: "center" }}>
                  Temporary password
               </Heading>
               <Text color="800" component="p" size="paragraph">
                  Please enter the temporary password sent to your email
               </Text>
               <div style={{ marginTop: "3.2rem" }}>
                  <Input autoFocus fullWidth required
                         name="password"
                         placeholder="Password"
                         type="password"/>
                  <Button fullWidth error={error} loading={loading}
                          size="lg"
                          style={{ marginTop: "0" }}
                          type="submit"
                          variant="primary">
                     Enter
                  </Button>
               </div>
            </Form>
         </Modal>}
      </>
   )
}

export default ShareUuid

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const { res, query } = ctx

   res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
   )

   deleteCookie("publicShare", ctx)

   const sharePassword = query.password ?? ""

   try {
      const shareResponse = await axios.get(`${apiUrl}/credential/share/${query.uuid}?password=${sharePassword}`)
      const { data: shareData } = shareResponse

      if (shareData) {
         setCookie("credentialShare", `${query.uuid}?password=${query.password}`, ctx)
      }

      return { props: { userData: { role: "SHARED" }, shareData, shareId: `${query.uuid}?password=${query.password}` } }

   } catch (err) {
      if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
         return { props: { serverErrorMessage: "Network error, connection refused" } }
      }
      if (err.response.status === 404) {
         return { props: { serverErrorMessage: "Not found" } }
      }
      return { props: {} }
   }
}