import React from "react"

import { useRecoilState } from "recoil"

import { globalErrorModal } from "@atoms/globalErrorModal.atom"
import { isShareModalOpen, shareUuids } from "@atoms/shareModal.atom"
import { useCredentialShareDisplay } from "@hooks/useCredentialShareDisplay"
import { Button, Text } from "@lib/components"

import type { QualificationHistoryCredentialShareDetailsType } from "@customTypes/components"

import styles from "./QualificationHistoryDetails.module.scss"

export const QualificationHistoryCredentialShareDetails: React.FC<QualificationHistoryCredentialShareDetailsType> = ({
   data,
   id
}): JSX.Element => {

   const [sharedData] = useCredentialShareDisplay(data, id)
   const [, setShareModalOpen] = useRecoilState(isShareModalOpen)
   const [, setSharedUuids] = useRecoilState(shareUuids)
   const [, setErrorModal] = useRecoilState(globalErrorModal)

   /**
    * Reshare handler
    */
   const handleReshareCredentials = (): void => {
      if (sharedData) {
         setSharedUuids(sharedData.uuids)
         setShareModalOpen(true)

      } else {
         setErrorModal({
            isShown: true,
            error: "Unable to reshare credentials, please contact support"
         })
      }
   }

   return (
      <>
         {sharedData && <>
            <div className={styles.detailsItem}>
               <Text thin color="500" component="p"
                     size="paragraph">
                  Shared with: <span>{sharedData.email}</span>
               </Text>
            </div>
            <div className={styles.detailsItem}>
               <Text thin color="500" component="p"
                     size="paragraph">
                  Date shared: <span>{sharedData.sharedAt}</span>
               </Text>
               <Text thin color="500" component="p"
                     size="paragraph">
                  Date expires: <span>{sharedData.expiresAt}</span>
               </Text>
            </div>
            <div className={styles.detailsItem}>
               <Text thin color="500" component="p"
                     size="paragraph">
                  Status:
               </Text>
               <Text color={!sharedData.isLinkActive ? "danger" : "success"} component="p" size="paragraph">
                  {!sharedData.isLinkActive ? "Link Expired" : "Link Active"}
               </Text>
            </div>
            <div className={styles.detailsItem}>
               <Text thin color="500" component="p"
                     size="paragraph">
                  Shared Credentials:
               </Text>
               <div className={styles.credentials}>
                  {sharedData.credentials.map(cred => (
                     <Text key={cred} color="800" component="p"
                           size="paragraph">
                        {cred}
                     </Text>
                  ))}
               </div>
            </div>
            <Button icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                               width="24" xmlns="http://www.w3.org/2000/svg">
               <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z"
                  stroke="#0880CE" strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth="1.5"/>
               <path d="M16.5 21.75C18.1569 21.75 19.5 20.4069 19.5 18.75C19.5 17.0931 18.1569 15.75 16.5 15.75C14.8431 15.75 13.5 17.0931 13.5 18.75C13.5 20.4069 14.8431 21.75 16.5 21.75Z"
                  stroke="#0880CE" strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth="1.5"/>
               <path d="M16.5 8.25C18.1569 8.25 19.5 6.90685 19.5 5.25C19.5 3.59315 18.1569 2.25 16.5 2.25C14.8431 2.25 13.5 3.59315 13.5 5.25C13.5 6.90685 14.8431 8.25 16.5 8.25Z"
                  stroke="#0880CE" strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth="1.5"/>
               <path d="M13.9777 6.87207L8.52148 10.3783" stroke="#0880CE" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
               <path d="M8.52148 13.6221L13.9777 17.1283" stroke="#0880CE" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
            </svg>} loading={false} size="md"
                    variant="secondary"
                    onClick={handleReshareCredentials}>
               Reshare Credentials
            </Button>
         </>}
      </>
   )
}