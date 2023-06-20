import React from "react"

import axios from "axios"
import { useRouter } from "next/router"

import { apiUrl } from "@constants/urls"
import { Button, Heading, Modal, Text } from "@lib/components"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { DeleteCredentialModalType } from "@customTypes/components/Modals"

const totalSteps = 3

export const DeleteCredentialModal: React.FC<DeleteCredentialModalType> = ({ isOpen, handleCloseModal, uuid }): JSX.Element => {

   const router = useRouter()

   const [activeStep, setActiveStep] = React.useState<number>(1)
   const [loading, setLoading] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")

   /**
    * Delete credential handler
    */
   const handleDeleteCredentials = async (): Promise<void> => {
      setLoading(true)
      await axios.delete(`${apiUrl}/credential/${uuid}`, { withCredentials: true })
         
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
               Do you wish to delete these credentials?
            </Heading>
            <Text color="800" component="p" size="paragraph">
               This action CANNOT be reversed.
            </Text>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.6rem" }}>
               <Button icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                  width="24"
                                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.25 5.25H3.75" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"/>
                  <path d="M9.75 9.75V15.75" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"/>
                  <path d="M14.25 9.75V15.75" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"/>
                  <path d="M18.75 5.25V19.5C18.75 19.6989 18.671 19.8897 18.5303 20.0303C18.3897 20.171 18.1989 20.25 18 20.25H6C5.80109 20.25 5.61032 20.171 5.46967 20.0303C5.32902 19.8897 5.25 19.6989 5.25 19.5V5.25"
                        stroke="white" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="1.5"/>
                  <path d="M15.75 5.25V3.75C15.75 3.35218 15.592 2.97064 15.3107 2.68934C15.0294 2.40804 14.6478 2.25 14.25 2.25H9.75C9.35218 2.25 8.97064 2.40804 8.68934 2.68934C8.40804 2.97064 8.25 3.35218 8.25 3.75V5.25"
                        stroke="white" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="1.5"/>
               </svg>} loading={false} size="lg"
                       variant="danger"
                       onClick={(): void => setActiveStep(prevState => prevState + 1)}>
                  Delete Credentials</Button>
               <Button loading={false} size="lg" variant="secondary"
                       onClick={handleCloseModal}>
                  Go back
               </Button>
            </div>
         </>}

         {activeStep === 2 && <>
            <Heading color="blue" component="h3" size="md">
               Confirm deletion
            </Heading>
            <Text color="800" component="p" size="paragraph">
               Please confirm the deletion of selected credentials.
            </Text>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.6rem" }}>
               <Button error={error} icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                                width="24"
                                                xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.25 5.25H3.75" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"/>
                  <path d="M9.75 9.75V15.75" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"/>
                  <path d="M14.25 9.75V15.75" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"/>
                  <path d="M18.75 5.25V19.5C18.75 19.6989 18.671 19.8897 18.5303 20.0303C18.3897 20.171 18.1989 20.25 18 20.25H6C5.80109 20.25 5.61032 20.171 5.46967 20.0303C5.32902 19.8897 5.25 19.6989 5.25 19.5V5.25"
                        stroke="white" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="1.5"/>
                  <path d="M15.75 5.25V3.75C15.75 3.35218 15.592 2.97064 15.3107 2.68934C15.0294 2.40804 14.6478 2.25 14.25 2.25H9.75C9.35218 2.25 8.97064 2.40804 8.68934 2.68934C8.40804 2.97064 8.25 3.35218 8.25 3.75V5.25"
                        stroke="white" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="1.5"/>
               </svg>} loading={loading}
                       size="lg" variant="danger"
                       onClick={handleDeleteCredentials}>
                  Confirm Delete</Button>
               <Button loading={false} size="lg" variant="secondary"
                       onClick={handleCloseModal}>
                  Go back
               </Button>
            </div>
         </>}

         {activeStep === 3 && <>
            <Heading color="blue" component="h3" size="md">
               Credentials deleted successfully
            </Heading>
            <Text color="800" component="p" size="paragraph">
               You may now return to dashboard.
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