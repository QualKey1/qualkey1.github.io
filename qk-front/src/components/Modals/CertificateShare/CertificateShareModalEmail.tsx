import React from "react"

import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useRecoilState } from "recoil"

import { shareUuids } from "@atoms/shareModal.atom"
import { Button, Heading, Modal, Text } from "@lib/components"

import type { CertificateShareModalEmailType, ShareModalEmailFormType } from "@customTypes/components/Modals"


const ShareModalEmailForm = dynamic<ShareModalEmailFormType>(() => import("@components/Modals/ShareModal/ShareModalEmailForm")
   .then(module => module.ShareModalEmailForm))

const totalSteps = 2

export const CertificateShareModalEmail: React.FC<CertificateShareModalEmailType> = ({
   uuid,
   name,
   isOpen,
   handleCloseModal
}): JSX.Element => {

   const router = useRouter()
   
   const [activeStep, setActiveStep] = React.useState<number>(1)

   const [, setSharedUuids] = useRecoilState(shareUuids)

   /**
    * Return to dashboard handler
    */
   const handleReturn = (): void => {
      router.reload()
   }
   
   React.useEffect(() => {
      setSharedUuids([uuid])
   }, [uuid]) // eslint-disable-line react-hooks/exhaustive-deps

   return (
      <Modal stepsRequired activeStep={activeStep} handleCloseModal={handleCloseModal}
             isOpen={isOpen} totalSteps={totalSteps}>

         {activeStep === 1 && <>
            <Heading color="blue" component="h3" size="md">
               Review your email
            </Heading>
            <Text color="800" component="p" size="paragraph">
               Please review the email containing the link to your certificate
            </Text>
            <ShareModalEmailForm isPublicShare activeStepSetter={setActiveStep} name={name ?? "Full Name"}/>
         </>}

         {activeStep === 2 && <>
            <Heading color="blue" component="h3" size="md">
               Certificate shared successfully
            </Heading>
            <Text color="800" component="p" size="paragraph">
               You may now return to dashboard
            </Text>
            <Button center loading={false} size="lg"
                    variant="primary"
                    onClick={handleReturn}>
               Return to dashboard
            </Button>
         </>}

      </Modal>
   )
}