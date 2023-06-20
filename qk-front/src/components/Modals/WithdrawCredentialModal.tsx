import React from "react"


import axios from "axios"
import { useRouter } from "next/router"

import { apiUrl } from "@constants/urls"
import { Button, Heading, Modal, Text } from "@lib/components"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { WithdrawCredentialModalType } from "@customTypes/components/Modals"

const totalSteps = 3

export const WithdrawCredentialModal: React.FC<WithdrawCredentialModalType> = ({
   uuid,
   isOpen,
   handleCloseModal
}): JSX.Element => {

   const router = useRouter()

   const [activeStep, setActiveStep] = React.useState<number>(1)
   const [loading, setLoading] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")

   /**
    * Withdraw credential handler
    */
   const handleWithdrawCredentials = async (): Promise<void> => {
      setLoading(true)
      await axios.post(`${apiUrl}/credential/withdraw`, { uuid }, { withCredentials: true })

         .then(res => {
            setError("")
            setLoading(false)
            if (res.status === 200) {
               setActiveStep(prevState => prevState + 1)
            } else {
               setError("Unexpected response")
            }
         })

         .catch(err => {
            handleAxiosError(err as never, setError, null, setLoading)
         })
   }

   /**
    * Return to dashboard handler
    */
   const handleReturn = async (): Promise<void> => {
      await router.push("/dashboard")
      handleCloseModal()
   }

   return (
      <Modal stepsRequired activeStep={activeStep} handleCloseModal={handleCloseModal}
             isOpen={isOpen} totalSteps={totalSteps}>

         {activeStep === 1 && <>
            <Heading color="blue" component="h3" size="md">
               Do you wish to withdraw these credentials?
            </Heading>
            <Text color="800" component="p" size="paragraph">
               This action will be first approved by the Assigned Approver before it takes effect.
            </Text>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.6rem" }}>
               <Button icon={<svg fill="none" height="24" viewBox="0 0 25 24"
                                  width="25" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.25 21H5.75C5.55109 21 5.36032 20.921 5.21967 20.7803C5.07902 20.6397 5 20.4489 5 20.25V3.75C5 3.55109 5.07902 3.36032 5.21967 3.21967C5.36032 3.07902 5.55109 3 5.75 3H14.75L20 8.25V20.25C20 20.4489 19.921 20.6397 19.7803 20.7803C19.6397 20.921 19.4489 21 19.25 21Z"
                     stroke="white" strokeLinecap="round" strokeLinejoin="round"
                     strokeWidth="1.5"/>
                  <path d="M14.75 3V8.25H20" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"/>
                  <path d="M10.25 14.25H14.75" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"/>
               </svg>} loading={false} size="lg"
                       variant="danger"
                       onClick={(): void => setActiveStep(prevState => prevState + 1)}>
                  Confirm Withdraw</Button>
               <Button loading={false} size="lg" variant="secondary"
                       onClick={handleCloseModal}>
                  Go back
               </Button>
            </div>
         </>}

         {activeStep === 2 && <>
            <Heading color="blue" component="h3" size="md">
               Confirm credentials withdrawal request
            </Heading>
            <Text color="800" component="p" size="paragraph">
               This action will be first approved by the Assigned Approver before it takes effect.
            </Text>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.6rem" }}>
               <Button error={error} icon={<svg fill="none" height="24" viewBox="0 0 25 24"
                                                width="25" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.25 21H5.75C5.55109 21 5.36032 20.921 5.21967 20.7803C5.07902 20.6397 5 20.4489 5 20.25V3.75C5 3.55109 5.07902 3.36032 5.21967 3.21967C5.36032 3.07902 5.55109 3 5.75 3H14.75L20 8.25V20.25C20 20.4489 19.921 20.6397 19.7803 20.7803C19.6397 20.921 19.4489 21 19.25 21Z"
                        stroke="white" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="1.5"/>
                  <path d="M14.75 3V8.25H20" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"/>
                  <path d="M10.25 14.25H14.75" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"/>
               </svg>} loading={loading}
                       size="lg" variant="danger"
                       onClick={handleWithdrawCredentials}>
                  Confirm Withdraw</Button>
               <Button loading={false} size="lg" variant="secondary"
                       onClick={handleCloseModal}>
                  Go back
               </Button>
            </div>
         </>}

         {activeStep === 3 && <>
            <Heading color="blue" component="h3" size="md">
               Withdrawal request sent for approval
            </Heading>
            <Text color="800" component="p" size="paragraph">
               You will be notified as soon as the Assigned Approver confirms this action. You may now return to Dashboard.
            </Text>
            <Button center error={error} loading={loading}
                    size="lg"
                    variant="primary"
                    onClick={handleReturn}>
               Return to Dashboard
            </Button>
         </>}

      </Modal>
   )
}