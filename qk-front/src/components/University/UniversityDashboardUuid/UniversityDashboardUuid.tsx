import React from "react"

import classNames from "classnames/bind"
import dynamic from "next/dynamic"
import { useRecoilState } from "recoil"

import { isWithdrawCredentialModalOpen } from "@atoms/isWthdrawCredentialModal.atom"
import { QualificationStatus } from "@components/QualificationStatus/QualificationStatus"
import { WithHover } from "@components/WithHover/WithHover"
import { WithdrawCredentialModalType } from "@customTypes/components/Modals"
import { CredentialStatusEnum } from "@interfaces/credentials.interface"
import { LoadingComponent, Text } from "@lib/components"
import { formatDate } from "@utils/formatDate"

import type {
   DashboardUuidNavigationType,
   UniversityDashboardUuidEditType,
   UniversityDashboardUuidType
} from "@customTypes/components"

import styles from "./UniversityDashboardUuid.module.scss"

const cx = classNames.bind(styles)

const DashboardUuidNavigation = dynamic<DashboardUuidNavigationType>(() => import("@components/DashboardUuidNavigation/DashboardUuidNavigation")
   .then(module => module.DashboardUuidNavigation), { loading: () => <LoadingComponent/> })
const UniversityDashboardUuidEdit = dynamic<UniversityDashboardUuidEditType>(() => import("@components/University/UniversityDashboardUuidEdit/UniversityDashboardUuidEdit")
   .then(module => module.UniversityDashboardUuidEdit), { loading: () => <LoadingComponent/> })
const WithdrawCredentialModal = dynamic<WithdrawCredentialModalType>(() => import("@components/Modals")
   .then(module => module.WithdrawCredentialModal))

export const UniversityDashboardUuid: React.FC<UniversityDashboardUuidType> = ({ data }): JSX.Element => {

   const className = cx(styles.actions, {
      disabled: (data.status === CredentialStatusEnum.NEW)
          || (data.status === CredentialStatusEnum.WITHDRAWN)
          || (data.status === CredentialStatusEnum.UPLOADING_TO_BLOCKCHAIN)
          || (data.status === CredentialStatusEnum.EXPIRED)
   })

   const [withdrawCredentialModalOpen, setWithdrawCredentialModalOpen] = useRecoilState(isWithdrawCredentialModalOpen)
   const [isEditOpen, setIsEditOpen] = React.useState<boolean>(false)

   const handleToggleIsEditOpen = (): void => {
      setIsEditOpen(prevState => !prevState)
   }

   return (
      <>
         <div className={styles.wrapper}>
            <div className={styles.qualification}>
               <div className={styles.item}>
                  <svg fill="none" height="48" viewBox="0 0 48 48"
                             width="48" xmlns="http://www.w3.org/2000/svg">
                     <path d="M6 12V27" stroke="#262626" strokeLinecap="round"
                                  strokeLinejoin="round" strokeWidth="1.5"/>
                     <path d="M10.1621 40.4999C11.663 38.1979 13.7144 36.3067 16.1307 34.9976C18.5469 33.6885 21.2515 33.0029 23.9996 33.0029C26.7477 33.0029 29.4523 33.6885 31.8686 34.9976C34.2848 36.3067 36.3362 38.1979 37.8371 40.4999"
                                stroke="#262626" strokeLinecap="round"
                                strokeLinejoin="round" strokeWidth="1.5"/>
                     <path d="M42 12L24 18L6 12L24 6L42 12Z" stroke="#262626" strokeLinecap="round"
                                  strokeLinejoin="round" strokeWidth="1.5"/>
                     <path d="M31.7438 15.4126C33.1197 16.9152 34.0288 18.7856 34.3602 20.7959C34.6916 22.8062 34.4309 24.8694 33.6101 26.7342C32.7892 28.5989 31.4436 30.1845 29.7372 31.2978C28.0308 32.411 26.0374 33.0037 24 33.0037C21.9626 33.0037 19.9692 32.411 18.2628 31.2978C16.5564 30.1845 15.2108 28.5989 14.3899 26.7342C13.5691 24.8694 13.3084 22.8062 13.6398 20.7959C13.9712 18.7856 14.8803 16.9152 16.2563 15.4126"
                                stroke="#262626" strokeLinecap="round"
                                strokeLinejoin="round" strokeWidth="1.5"/>
                  </svg>
                  <Text bold color="800" component="p"
                              size="paragraph">
                     {data.graduatedName}
                  </Text>
                  <Text color="500" component="p" size="label">
                            Name
                  </Text>
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
               <QualificationStatus data={data} isStudent={false} status={data.status}/>
               <div className={styles.date}>
                  <Text bold color="800" component="p"
                              size="paragraph">
                     {formatDate("HH:mm DD/MM/YYYY", data.updatedAt)}
                  </Text>
                  <Text color="500" component="p" size="label">
                            Last Modified
                  </Text>
               </div>
               <div className={className}>
                  <WithHover height={40} label="Edit credentials."
                                   width={40}>
                     <svg fill="none" height="40" viewBox="0 0 40 40"
                                 width="40"
                                 xmlns="http://www.w3.org/2000/svg" onClick={handleToggleIsEditOpen}>
                        <path d="M20 25H15V20L30 5L35 10L20 25Z" stroke="#262626" strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M26.25 8.75L31.25 13.75" stroke="#262626" strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M33.75 18.75V32.5C33.75 32.8315 33.6183 33.1495 33.3839 33.3839C33.1495 33.6183 32.8315 33.75 32.5 33.75H7.5C7.16848 33.75 6.85054 33.6183 6.61612 33.3839C6.3817 33.1495 6.25 32.8315 6.25 32.5V7.5C6.25 7.16848 6.3817 6.85054 6.61612 6.61612C6.85054 6.3817 7.16848 6.25 7.5 6.25H21.25"
                                    stroke="#262626" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="1.5"/>
                     </svg>
                  </WithHover>
                  <Text color="500" component="p" size="label">
                            Actions
                  </Text>
               </div>
            </div>

            {!isEditOpen && <DashboardUuidNavigation data={data} isStudent={false}/>}
            {isEditOpen && <UniversityDashboardUuidEdit data={data} handleToggleIsEditOpen={handleToggleIsEditOpen}/>}

         </div>

         {withdrawCredentialModalOpen &&
               <WithdrawCredentialModal handleCloseModal={(): void => setWithdrawCredentialModalOpen(false)}
                                        isOpen={withdrawCredentialModalOpen} uuid={data.uuid}/>}
      </>
   )
}