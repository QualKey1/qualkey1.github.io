import React from "react"

import axios from "axios"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { apiUrl } from "@constants/urls"
import { MinimizedCredentialType } from "@customTypes/components"
import { useUserActionDecision } from "@hooks/useUserActionDecision"
import { UserActionDecisionEnum } from "@interfaces/user.interface"
import { Button, Heading, Modal, Text } from "@lib/components"

import type { UserActionReviewWithdrawalModalType } from "@customTypes/components/Modals/userActionReviewWithdrawalModal.type"
import type { ICredential } from "@interfaces/credentials.interface"

const MinimizedCredential = dynamic<MinimizedCredentialType>(() => import("@components/MinimizedCredential/MinimizedCredential")
   .then(module => module.MinimizedCredential))

const totalSteps = 3

export const UserActionReviewWithdrawalModal: React.FC<UserActionReviewWithdrawalModalType> = ({
   data,
   handleCloseModal,
   isOpen
}): JSX.Element => {

   const router = useRouter()

   const [activeStep, setActiveStep] = React.useState<number>(1)
   const [credentialsData, setCredentialsData] = React.useState<ICredential | null>(null)

   const [error, setError] = React.useState<string>("")
   const [loading, setLoading] = React.useState<boolean>(false)

   const [isConfirmed, isDeclined, handleRequest] = useUserActionDecision(data, setActiveStep, totalSteps, setError, setLoading)

   /**
    * Next step handler
    */
   const handleNextStep = (): void => {
      setActiveStep(prevState => prevState + 1)
   }

   /**
    * Go back to dashboard handler
    */
   const handleReturnToDashboard = (): void => {
      handleCloseModal()
      router.reload()
   }

   /**
    * Set ActionData from global state to this modal handler
    */
   React.useEffect(() => {
      axios.get(`${apiUrl}/credential?uuid=${data?.credentialsUuid}`, { withCredentials: true })
         .then(res => {
            if (res.status === 200) {
               setCredentialsData(res.data[0])
            } else {
               setError("Unexpected response")
            }
         })
         .catch(err => {
            setError(err.response.data.message)
         })

      return () => {
         setCredentialsData(null)
      }
   }, [data?.credentialsUuid])

   return (
      <Modal stepsRequired activeStep={activeStep}
             error={error} handleCloseModal={handleCloseModal} isOpen={isOpen}
             totalSteps={totalSteps}>

         {activeStep === 1 && <>
            <Heading color="blue" component="h3" size="md">
                     Credential withdrawal request. Your action is required.
            </Heading>
            <Text color="800" component="p" size="paragraph">
               {data?.initiatorName} has put forward a credential withdrawal request.
            </Text>
            {credentialsData && <MinimizedCredential data={credentialsData}/>}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.6rem" }}>
               <Button icon={<svg fill="none" height="20" viewBox="0 0 17 20"
                                        width="17"
                                        xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.25 19H1.75C1.55109 19 1.36032 18.921 1.21967 18.7803C1.07902 18.6397 1 18.4489 1 18.25V1.75C1 1.55109 1.07902 1.36032 1.21967 1.21967C1.36032 1.07902 1.55109 1 1.75 1H10.75L16 6.25V18.25C16 18.4489 15.921 18.6397 15.7803 18.7803C15.6397 18.921 15.4489 19 15.25 19Z"
                           stroke="white" strokeLinecap="round" strokeLinejoin="round"
                           strokeWidth="1.5"/>
                  <path d="M10.75 1V6.25H16" stroke="white" strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"/>
                  <path d="M6.25 12.25H10.75" stroke="white" strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"/>
               </svg>} loading={false} size="lg"
                             variant="danger"
                             onClick={handleNextStep}>
                        Confirm Withdraw
               </Button>
               <Button loading={loading} size="lg"
                             variant="secondary"
                             onClick={(): Promise<void> => handleRequest(UserActionDecisionEnum.REJECT)}>
                        Decline Request
               </Button>
            </div>
         </>}

         {activeStep === 2 && <>
            <Heading color="blue" component="h3" size="md">
                     Confirm credentials withdrawal
            </Heading>
            <Text bold color="danger" component="p"
                        size="paragraph">
                     This action CANNOT be reversed
            </Text>
            {credentialsData && <MinimizedCredential data={credentialsData}/>}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.6rem" }}>
               <Button icon={<svg fill="none" height="20" viewBox="0 0 17 20"
                                                      width="17"
                                                      xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.25 19H1.75C1.55109 19 1.36032 18.921 1.21967 18.7803C1.07902 18.6397 1 18.4489 1 18.25V1.75C1 1.55109 1.07902 1.36032 1.21967 1.21967C1.36032 1.07902 1.55109 1 1.75 1H10.75L16 6.25V18.25C16 18.4489 15.921 18.6397 15.7803 18.7803C15.6397 18.921 15.4489 19 15.25 19Z"
                           stroke="white" strokeLinecap="round" strokeLinejoin="round"
                           strokeWidth="1.5"/>
                  <path d="M10.75 1V6.25H16" stroke="white" strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"/>
                  <path d="M6.25 12.25H10.75" stroke="white" strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"/>
               </svg>} loading={loading}
                             size="lg" variant="danger"
                             onClick={(): Promise<void> => handleRequest(UserActionDecisionEnum.APPROVE)}>
                        Confirm Withdraw
               </Button>
               <Button loading={false} size="lg" variant="secondary"
                             onClick={handleCloseModal}>
                        Go back
               </Button>
            </div>
         </>}

         {activeStep === 3
            ? <>
               <Heading color="blue" component="h3" size="md">
                  {isDeclined && "Withdrawal request declined"}
                  {isConfirmed && "Credentials withdrawn successfully"}
               </Heading>
               <Text color="800" component="p"
                           size="paragraph">
                        You may now return to dashboard
               </Text>
               <Button center loading={false} size="lg"
                             variant="primary"
                             onClick={handleReturnToDashboard}>
                        Return to Dashboard
               </Button>
            </> : null}

      </Modal>
   )
}