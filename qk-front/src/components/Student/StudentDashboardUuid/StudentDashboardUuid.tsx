import React from "react"

import dynamic from "next/dynamic"
import Image from "next/image"
import { useRecoilState, useRecoilValue } from "recoil"

import { isDeleteCredentialModalOpen } from "@atoms/isDeleteCredentialModal.atom"
import { isShareModalOpen, shareUuids } from "@atoms/shareModal.atom"
import { QualificationStatus } from "@components/QualificationStatus/QualificationStatus"
import { WithHover } from "@components/WithHover/WithHover"
import { CredentialStatusEnum } from "@interfaces/credentials.interface"
import { Button, LoadingComponent, Text } from "@lib/components"
import { transformToAwsUrl } from "@utils/transformToAwsUrl"

import type { DashboardUuidNavigationType, StudentDashboardUuidType } from "@customTypes/components"
import type { CertificateShareModalType, DeleteCredentialModalType, ShareModalType } from "@customTypes/components/Modals"

import styles from "./StudentDashboardUuid.module.scss"

const DashboardUuidNavigation = dynamic<DashboardUuidNavigationType>(() => import("@components/DashboardUuidNavigation/DashboardUuidNavigation")
   .then(module => module.DashboardUuidNavigation), { loading: () => <LoadingComponent/> })

const CertificateShareModal = dynamic<CertificateShareModalType>(() => import("@components/Modals")
   .then(module => module.CertificateShareModal))
const ShareModal = dynamic<ShareModalType>(() => import("@components/Modals")
   .then(module => module.ShareModal))
const DeleteCredentialModal = dynamic<DeleteCredentialModalType>(() => import("@components/Modals")
   .then(module => module.DeleteCredentialModal))

export const StudentDashboardUuid: React.FC<StudentDashboardUuidType> = ({ data, name }): JSX.Element => {

   const shareModalOpen = useRecoilValue(isShareModalOpen)
   const [deleteCredentialModalOpen, setDeleteCredentialModalOpen] = useRecoilState(isDeleteCredentialModalOpen)
   const [isCertificateModalOpen, setIsCertificateModalOpen] = React.useState<boolean>(false)

   const handleOpenCertificate = (): void => {
      setIsCertificateModalOpen(true)
   }

   const [, setShareModalOpen] = useRecoilState(isShareModalOpen)
   const [, setSharedUuids] = useRecoilState(shareUuids)

   /**
    * Reshare handler
    */
   const handleShareCredentials = (): void => {
      if (data.status === CredentialStatusEnum.ACTIVATED) {
         setSharedUuids([data.uuid])
         setShareModalOpen(true)
      }
   }

   return (
      <div className={styles.wrapper}>
         <div className={styles.qualification}>
            <div className={styles.logoWrapper}>
               <div className={styles.uniLogo}>
                  <div className={styles.uniLogo__wrapper}>
                     <Image unoptimized alt={data?.institution.name ?? "University"} layout="fill"
objectFit="contain"
                            src={transformToAwsUrl(data?.institution.logoUrl ?? "")}/>
                  </div>
                  <Text color="500" component="p" size="label">
                     School Name
                  </Text>
               </div>
            </div>
            <div className={styles.item}>
               <svg fill="none" height="41" viewBox="0 0 48 41"
                    width="48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 12.9995L24 0.999512L46.5 12.9995L24 24.9995L1.5 12.9995Z" stroke="#262626"
                        strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M35.25 40V19L24 13" stroke="#262626" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M41.25 15.7944V26.0319C41.2487 26.3505 41.1433 26.6599 40.95 26.9132C39.6937 28.6007 34.3687 34.7507 24 34.7507C13.6313 34.7507 8.30625 28.6007 7.05 26.9132C6.85668 26.6599 6.75135 26.3505 6.75 26.0319V15.7944"
                     stroke="#262626" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
               </svg>
               <Text bold color="800" component="p"
                     size="paragraph">
                  {data.qualificationName}
               </Text>
               <Text color="500" component="p" size="label">
                  Degree
               </Text>
            </div>
            <QualificationStatus isStudent data={data} status={data.status}/>
            <div className={styles.actions}>
               <WithHover height={50} label="View and share your certificate." width={187}>
                  <Button disabled={data.status !== CredentialStatusEnum.ACTIVATED}
                          icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                     width="24"
                                     xmlns="http://www.w3.org/2000/svg">
                             <path d="M9 9H15" stroke="#0880CE" strokeLinecap="round"
                                   strokeLinejoin="round" strokeWidth="1.5"/>
                             <path d="M9 12H15" stroke="#0880CE" strokeLinecap="round"
                                   strokeLinejoin="round" strokeWidth="1.5"/>
                             <path d="M9 15H12" stroke="#0880CE" strokeLinecap="round"
                                   strokeLinejoin="round" strokeWidth="1.5"/>
                             <path d="M14.6906 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V4.5C3.75 4.30109 3.82902 4.11032 3.96967 3.96967C4.11032 3.82902 4.30109 3.75 4.5 3.75H19.5C19.6989 3.75 19.8897 3.82902 20.0303 3.96967C20.171 4.11032 20.25 4.30109 20.25 4.5V14.6906C20.2503 14.788 20.2315 14.8845 20.1945 14.9746C20.1575 15.0647 20.1031 15.1466 20.0344 15.2156L15.2156 20.0344C15.1466 20.1031 15.0647 20.1575 14.9746 20.1945C14.8845 20.2315 14.788 20.2503 14.6906 20.25V20.25Z"
                                stroke="#0880CE" strokeLinecap="round"
                                strokeLinejoin="round" strokeWidth="1.5"/>
                             <path d="M20.1844 15H15V20.1844" stroke="#0880CE" strokeLinecap="round"
                                   strokeLinejoin="round" strokeWidth="1.5"/>
                          </svg>} loading={false}
                          size="lg"
                          variant="secondary"
                          onClick={handleOpenCertificate}>
                     Certificate</Button>
               </WithHover>
               <Text color="500" component="p" size="label">
                  Degree
               </Text>
            </div>
         </div>

         <WithHover height={48} label="Share your credentials." width="100%">
            <Button fullWidth disabled={data.status !== CredentialStatusEnum.ACTIVATED} loading={false}
                    size="lg"
                    variant="primary"
                    onClick={handleShareCredentials}>
               Share credentials
            </Button>
         </WithHover>

         <DashboardUuidNavigation isStudent data={data}/>

         {shareModalOpen && <ShareModal name={name ?? "Full Name"}/>}

         {isCertificateModalOpen &&
            <CertificateShareModal data={data} handleCloseModal={(): void => setIsCertificateModalOpen(false)}
                                   isOpen={isCertificateModalOpen}/>}

         {deleteCredentialModalOpen &&
            <DeleteCredentialModal handleCloseModal={(): void => setDeleteCredentialModalOpen(false)}
                                   isOpen={deleteCredentialModalOpen}
                                   uuid={data.uuid}/>}
      </div>
   )
}