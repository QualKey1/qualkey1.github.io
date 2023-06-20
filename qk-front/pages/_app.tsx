import "@assets/styles/globals.scss"
import React from "react"

import Head from "next/head"
import NextNProgress from "nextjs-progressbar"
import { RecoilRoot } from "recoil"

import { CookiesConsent } from "@components/CookiesConsent/CookiesConsent"

import type { AppProps } from "next/app"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {

   return (
      <>
         <Head>
            <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
            <title>Qualkey</title>
         </Head>
         <NextNProgress color="#05558A" options={{ easing: "ease", speed: 500, showSpinner: false }}
         />
         <RecoilRoot>

            <Component {...pageProps} />
            <CookiesConsent/>

         </RecoilRoot>
      </>
   )
}

export default MyApp
