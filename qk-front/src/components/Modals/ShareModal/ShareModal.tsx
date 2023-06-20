import React from "react"

import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil"

import { dataToShareState, isShareModalOpen, shareUuids } from "@atoms/shareModal.atom"
import { Button, Heading, Modal, Text } from "@lib/components"

import type { ShareModalEmailFormType, ShareModalType } from "@customTypes/components/Modals"

import styles from "./ShareModal.module.scss"

const EmailShareForm = dynamic<ShareModalEmailFormType>(() => import("@components/Modals/ShareModal/ShareModalEmailForm")
   .then(module => module.ShareModalEmailForm))
const ShareModalAdjustData = dynamic<Record<string, never>>(() => import("@components/Modals/ShareModal/ShareModalAdjustData")
   .then(module => module.ShareModalAdjustData))

const totalSteps = 3

enum DataSelectionEnum {
   ALL = "all",
   SELECTION = "selection"
}

export const ShareModal: React.FC<ShareModalType> = ({ name }): JSX.Element => {

   const router = useRouter()

   const resetShareData = useResetRecoilState(dataToShareState)
   const resetSharedUuids = useResetRecoilState(shareUuids)

   const [activeStep, setActiveStep] = React.useState<number>(1)

   const [shareModalOpen, setShareModalOpen] = useRecoilState(isShareModalOpen)
   const sharedUuids = useRecoilValue(shareUuids)

   const [dataSelection, setDataSelection] = React.useState<DataSelectionEnum>(DataSelectionEnum.ALL)

   /**
    * Close modal handler
    */
   const handleCloseModal = (): void => {
      setShareModalOpen(false)
      resetSharedUuids()
      resetShareData()
   }

   /**
    * Radio input handler
    */
   const handleRadioInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setDataSelection(event.target.value as DataSelectionEnum)
   }

   /**
    * Return to dashboard handler
    */
   const handleReturn = (): void => {
      router.reload()
   }

   return (
      <Modal stepsRequired activeStep={activeStep} handleCloseModal={handleCloseModal}
             isOpen={shareModalOpen}
             style={{ overflowY: "scroll" }} totalSteps={totalSteps}>

         {activeStep === 1 && <>
            <Heading color="blue" component="h3" size="md">
               Adjust shared data
            </Heading>
            <Text color="800" component="p" size="paragraph">
               By default you will share all your data. However, you can review your credentials and choose which data to share.
            </Text>
            <div className={styles.selectionChoose}>
               <div className={styles.radio}>
                  <input checked={dataSelection === DataSelectionEnum.ALL} name="all" type="radio"
                         value={DataSelectionEnum.ALL}
                         onChange={handleRadioInputChange}/>
                  <Text color={dataSelection === DataSelectionEnum.ALL ? "800" : "500"} component="p" size="paragraph">
                     Share all credentials
                  </Text>
               </div>
               <div className={styles.radio}>
                  <input checked={dataSelection === DataSelectionEnum.SELECTION} name="selection" type="radio"
                         value={DataSelectionEnum.SELECTION}
                         onChange={handleRadioInputChange}/>
                  <Text color={dataSelection === DataSelectionEnum.SELECTION ? "800" : "500"} component="p"
                        size="paragraph">
                     Share a selection of credentials
                  </Text>
               </div>
            </div>

            {dataSelection === DataSelectionEnum.SELECTION && <ShareModalAdjustData/>}

            <Button center loading={false} size="lg"
                    variant="primary"
                    onClick={(): void => setActiveStep(prevState => prevState + 1)}>
               Confirm shared data
            </Button>
         </>}

         {activeStep === 2 && <>
            <Heading color="blue" component="h3" size="md">
               Review your email
            </Heading>
            <Text color="800" component="p" size="paragraph">
               You are sharing ({sharedUuids.length}) qualification(s).<br/>
               Please fill out all fields in the template below in
               order
               to share credentials.
            </Text>
            <EmailShareForm activeStepSetter={setActiveStep} name={name}/>
         </>}

         {activeStep === 3 && <>
            <svg fill="none" height="40" style={{ margin: "0 auto 1.2rem", display: "block" }}
                 viewBox="0 0 40 40"
                 width="40" xmlns="http://www.w3.org/2000/svg">
               <rect fill="#16A34A" height="40" rx="10"
                     width="40"/>
               <path d="M10 18.332L17.5 25.832L30 13.332" stroke="white" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="2"/>
            </svg>
            <Heading color="blue" component="h3" size="md">
               Congratulations
            </Heading>
            <Text color="800" component="p" size="paragraph">
               Your credentials have been shared! You now may close this window.
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