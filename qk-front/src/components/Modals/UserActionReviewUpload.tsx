import React from "react"

import axios from "axios"
import { useRouter } from "next/router"

import { FileTypeMapping } from "@constants/fileTypeMapping"
import { apiUrl } from "@constants/urls"
import { useUserActionDecision } from "@hooks/useUserActionDecision"
import { UserActionDecisionEnum } from "@interfaces/user.interface"
import { Button, Heading, Modal, Text } from "@lib/components"
import { formatDate } from "@utils/formatDate"

import type { UserActionReviewUploadType } from "@customTypes/components/Modals"

const totalSteps = 4

export const UserActionReviewUpload: React.FC<UserActionReviewUploadType> = ({
   isOpen,
   handleCloseModal,
   data
}): JSX.Element => {

   const router = useRouter()

   const [downloadedFilename, setDownloadedFilename] = React.useState<string>("")

   const [activeStep, setActiveStep] = React.useState<number>(1)

   const [error, setError] = React.useState<string>("")
   const [loading, setLoading] = React.useState<boolean>(false)

   const [isConfirmed, isDeclined, handleRequest] = useUserActionDecision(data, setActiveStep, totalSteps, setError, setLoading)

   /**
    * Go back to dashboard handler
    */
   const handleReturnToDashboard = (): void => {
      handleCloseModal()
      router.reload()
   }

   /**
    * Next step handler
    */
   const handleNextStep = (): void => {
      setActiveStep(prevState => prevState + 1)
   }

   /**
    * Get file from AWS through processing handler
    */
   const handleGetFile = async (): Promise<void> => {
      setLoading(true)
      await axios.get(`${apiUrl}/upload?uuid=${data?.subjectUuid}`, { withCredentials: true, responseType: "blob" })

         .then(res => {
            setLoading(false)
            if (res.status === 200) {

               const authFlowStepData = FileTypeMapping.has(res.data.type) ? FileTypeMapping.get(res.data.type) : undefined
               if (authFlowStepData) {
                  const filename = `${formatDate("DD.MM.YYYY_HH:mm", new Date())}_qualkey.${authFlowStepData[0]}`
                  const blob = new Blob([res.data])
                  const downloadLink = document.createElement("a")
                  downloadLink.href = window.URL.createObjectURL(blob)
                  downloadLink.download = filename
                  downloadLink.click()

                  setDownloadedFilename(filename)
                  setActiveStep(prevState => prevState + 1)

               } else {
                  setError("Unknown file extension")
               }

            } else {
               setError("Unexpected response")
            }

         })
         .catch(err => {
            setLoading(false)
            setError(`${err.message}, ${err.response.statusText}`)
         })
   }

   return (
      <Modal stepsRequired activeStep={activeStep} error={error}
             handleCloseModal={handleCloseModal}
             isOpen={isOpen} totalSteps={totalSteps}>

         {activeStep === 1 || activeStep === 2 ? <>
            <Heading color="blue" component="h3" size="md">
               Please approve credentials
            </Heading>
            <Text color="800" component="p" size="paragraph">
               {data?.initiatorName} has uploaded new credentials that require approval.
            </Text>
         </> : null}

         {activeStep === 1 && <>
            <Button center icon={<svg fill="none" height="20" viewBox="0 0 20 20"
                                      width="20" xmlns="http://www.w3.org/2000/svg">
               <path d="M5.875 8.875H11.875" stroke="white" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
               <path d="M8.875 5.875V11.875" stroke="white" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
               <path d="M8.875 16.75C13.2242 16.75 16.75 13.2242 16.75 8.875C16.75 4.52576 13.2242 1 8.875 1C4.52576 1 1 4.52576 1 8.875C1 13.2242 4.52576 16.75 8.875 16.75Z"
                  stroke="white" strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth="1.5"/>
               <path d="M14.4438 14.4438L19.0001 19.0001" stroke="white" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
            </svg>}
                    loading={loading}
                    size="lg"
                    variant="primary"
                    onClick={handleGetFile}>
               Examine file
            </Button>
         </>}

         {activeStep === 2 && <>
            <div style={{
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
               gap: "1.2rem",
               marginTop: "2.4rem"
            }}>
               <svg fill="none" height="20" viewBox="0 0 17 20"
                    width="17" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.25 19H1.75C1.55109 19 1.36032 18.921 1.21967 18.7803C1.07902 18.6397 1 18.4489 1 18.25V1.75C1 1.55109 1.07902 1.36032 1.21967 1.21967C1.36032 1.07902 1.55109 1 1.75 1H10.75L16 6.25V18.25C16 18.4489 15.921 18.6397 15.7803 18.7803C15.6397 18.921 15.4489 19 15.25 19Z"
                     stroke="#737373" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M10.75 1V6.25H16" stroke="#737373" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M5.875 11.875L8.5 9.25L11.125 11.875" stroke="#737373" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M8.5 15.25V9.25" stroke="#737373" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
               </svg>
               <Text thin color="500" component="span"
                     size="label">
                  {downloadedFilename}
               </Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.6rem" }}>
               <Button icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                  width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.25 6.75L9.75 17.25L4.5 12" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
               </svg>} loading={false} size="lg"
                       variant="primary" onClick={handleNextStep}>
                  Approve
               </Button>
               <Button loading={loading} size="lg"
                       variant="danger"
                       onClick={(): Promise<void> => handleRequest(UserActionDecisionEnum.REJECT)}>
                  Reject
               </Button>
            </div>
         </>}

         {activeStep === 3 && <>
            <Heading color="blue" component="h3" size="md">
               You chose to Approve
            </Heading>
            <Text color="800" component="p" size="paragraph">
               Please confirm your decision
            </Text>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.6rem" }}>
               <Button icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                  width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.25 6.75L9.75 17.25L4.5 12" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
               </svg>} loading={loading}
                       size="lg"
                       variant="primary" onClick={(): Promise<void> => handleRequest(UserActionDecisionEnum.APPROVE)}>
                  Approve
               </Button>
               <Button loading={false} size="lg"
                       variant="secondary"
                       onClick={handleCloseModal}>
                  Go back
               </Button>
            </div>
         </>}

         {activeStep === 4
            ? <>
               <Heading color="blue" component="h3" size="md">
                  {isDeclined && "Credentials Rejected"}
                  {isConfirmed && "Credentials Approved"}
               </Heading>
               <Text color="800" component="p"
                     size="paragraph">
                  {isDeclined && "Credentials were not uploaded and the initiating uploader will be informed about" +
                     " your decision."}
                  {isConfirmed && "Credentials were approved by you and all other approvers and therefore successfully uploaded."}
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