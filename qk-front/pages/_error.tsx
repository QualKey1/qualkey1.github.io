import React from "react"

import { useRouter } from "next/router"

import { Button, Heading } from "@lib/components"

import type { ErrorPageType } from "@customTypes/pages"
import type { NextPage } from "next"

const Error: NextPage<ErrorPageType> = ({ serverErrorMessage }): JSX.Element => {

   const router = useRouter()
   const [isDisplay, setIsDisplay] = React.useState<boolean>(false)

   /**
    * Required to prevent hydration error
    */
   React.useEffect(() => {
      setIsDisplay(true)
   }, [])

   return (
      <>
         {isDisplay &&
            <div className="error">
               <div className="error__message">
                  <svg fill="none" height="56" viewBox="0 0 56 56"
                       width="56" xmlns="http://www.w3.org/2000/svg">
                     <path d="M28 49C39.598 49 49 39.598 49 28C49 16.402 39.598 7 28 7C16.402 7 7 16.402 7 28C7 39.598 16.402 49 28 49Z"
                           stroke="#D6193D" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="6"/>
                     <path d="M13.1465 13.1465L42.8527 42.8527" stroke="#D6193D" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="6"/>
                  </svg>
                  <Heading color="danger" component="p" size="lg">
                     {serverErrorMessage}
                  </Heading>
               </div>
               <Button loading={false} size="lg" variant="primary"
                       onClick={(): Promise<boolean> => router.push("/dashboard")}>
                  Go back
               </Button>
            </div>}
      </>
   )
}

export default Error