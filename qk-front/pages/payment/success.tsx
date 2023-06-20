import React from "react"

import { getCookie } from "cookies-next"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useRouter } from "next/router"
import { useRecoilValue } from "recoil"

import logoText from "@assets/images/logo-blue-text.svg"
import { paymentDataState } from "@atoms/payment.atom"
import { PaymentCountdown } from "@components/PaymentCountdown/PaymentCountdown"
import { Button, Heading, LoadingComponent, Text } from "@lib/components"

import type { MinimizedCredentialType } from "@customTypes/components"
import type { GetServerSideProps, NextPage } from "next"

const MinimizedCredential = dynamic<MinimizedCredentialType>(() => import("@components/MinimizedCredential/MinimizedCredential")
   .then(module => module.MinimizedCredential), { loading: () => <LoadingComponent/> })

const Success: NextPage = (): JSX.Element => {

   const router = useRouter()

   const globalCredential = useRecoilValue(paymentDataState)
   const [isDisplay, setIsDisplay] = React.useState<boolean>(false)

   /**
    * Required to prevent hydration error
    */
   React.useEffect(() => {
      setIsDisplay(true)
   }, [])

   /**
    * Return to dashboard handler
    */
   const handleReturn = async (): Promise<void> => {
      await router.push("/dashboard")
   }

   return (
      <>
         {isDisplay && <div className="payment">
            <div className="payment__top">
               <Image alt="Qualkey | Qualifications protected" height={53} objectFit="contain"
                      quality={100}
                      src={logoText} width={78}/>
            </div>
            <svg fill="none" height="97" viewBox="0 0 96 97"
                 width="96" xmlns="http://www.w3.org/2000/svg">
               <path d="M94.156 43.3263L69.0285 33.7435L59.6456 2.0597C59.2842 0.837842 58.1858 0 56.9462 0C55.7066 0 54.6082 0.837842 54.2468 2.0597L44.8667 33.7435L19.7364 43.3263C18.6267 43.7511 17.8926 44.8362 17.8926 46.0551C17.8926 47.2712 18.6267 48.3621 19.7364 48.7839L44.8526 58.3639L54.2383 91.0135C54.5941 92.247 55.6953 93.0936 56.9462 93.0936C58.1942 93.0936 59.2983 92.247 59.6541 91.0106L69.0398 58.361L94.1588 48.781C95.2628 48.3621 95.9998 47.2741 95.9998 46.0551C95.9998 44.8391 95.2628 43.7511 94.156 43.3263Z"
                     fill="#FFAC33"/>
               <path d="M37.687 75.3312L31.1531 72.841L28.6118 63.2407C28.2786 61.9723 27.1633 61.0937 25.8899 61.0937C24.6164 61.0937 23.5011 61.9723 23.1651 63.2378L20.6238 72.8381L14.0927 75.3283C12.983 75.7502 12.2489 76.8411 12.2489 78.0571C12.2489 79.2732 12.983 80.3641 14.0927 80.7859L20.5899 83.2675L23.1509 93.8045C23.4672 95.0962 24.5938 96.0038 25.8899 96.0038C27.1859 96.0038 28.3125 95.0962 28.6288 93.8016L31.1898 83.2646L37.687 80.783C38.7967 80.3641 39.5308 79.2732 39.5308 78.0571C39.5308 76.8411 38.7967 75.7502 37.687 75.3312ZM25.4381 12.3098L18.763 9.76426L16.2895 2.88407C15.8801 1.74076 14.8241 0.984375 13.641 0.984375C12.4607 0.984375 11.4046 1.74076 10.9924 2.88407L8.52171 9.76426L1.84383 12.3098C0.734144 12.7345 0 13.8226 0 15.0386C0 16.2546 0.734144 17.3456 1.84383 17.7674L8.52171 20.3129L10.9924 27.1931C11.4046 28.3364 12.4607 29.0928 13.641 29.0928C14.8212 29.0928 15.8773 28.3364 16.2895 27.1931L18.7602 20.3129L25.4381 17.7674C26.5478 17.3427 27.2819 16.2546 27.2819 15.0386C27.2819 13.8226 26.5478 12.7345 25.4381 12.3098Z"
                     fill="#FFCC4D"/>
            </svg>
            <Heading color="blue" component="h1" size="lg"
                     style={{ textAlign: "center" }}>
               Credential successfully activated
            </Heading>
            <Text color="800" component="p" size="paragraph"
                  style={{ marginTop: "1.2rem", textAlign: "center" }}>
               Your payment has been accepted. You will receive an
               email containing your transaction details.
            </Text>
            {globalCredential && <MinimizedCredential data={globalCredential}/>}
            <div className="payment__back">
               <PaymentCountdown handleReturn={handleReturn}/>
               <div className="payment__or">
                  <Text thin color="400" component="p"
                        size="paragraph"
                        style={{ textAlign: "center" }}>
                     or press
                  </Text>
               </div>
               <Button center loading={false} size="lg"
                       variant="primary"
                       onClick={handleReturn}>
                  Return to Dashboard
               </Button>
            </div>
         </div>}
      </>
   )
}

export default Success

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   
   const isPaymentCookie = getCookie("credentialActivation", ctx)

   if (!isPaymentCookie) {
      return { redirect: { destination: "/dashboard", permanent: false } }
      
   } else {
      return { props: {} }
   }
}