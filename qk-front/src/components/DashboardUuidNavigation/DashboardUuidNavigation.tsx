import React from "react"

import dynamic from "next/dynamic"
import { useRecoilState } from "recoil"

import { isDeleteCredentialModalOpen } from "@atoms/isDeleteCredentialModal.atom"
import { isWithdrawCredentialModalOpen } from "@atoms/isWthdrawCredentialModal.atom"
import { DashboardUuidNavigationItem } from "@components/DashboardUuidNavigation/DashboardUuidNavigationItem"
import { NavigationEnum } from "@customTypes/components"
import { CredentialStatusEnum } from "@interfaces/credentials.interface"
import { Text } from "@lib/components"

import type {
   DashboardUuidNavigationType,
   QualificationHistoryType,
   QualificationInformationType
} from "@customTypes/components"

import styles from "./DashboardUuidNavigation.module.scss"

const QualificationHistory = dynamic<QualificationHistoryType>(() => import("@components/QualificationHistory/QualificationHistory")
   .then(module => module.QualificationHistory))
const QualificationInformation = dynamic<QualificationInformationType>(() => import("@components/QualificationInformation/QualificationInformation")
   .then(module => module.QualificationInformation))

export const DashboardUuidNavigation: React.FC<DashboardUuidNavigationType> = ({ data, isStudent }): JSX.Element => {

   const [navigation, setNavigation] = React.useState<NavigationEnum>(NavigationEnum.INFO)
   
   const [, setOpenDeleteCredentialModal] = useRecoilState(isDeleteCredentialModalOpen)
   const [, setOpenWithdrawCredentialModal] = useRecoilState(isWithdrawCredentialModalOpen)

   /**
    * Open delete credential modal handler
    */
   const handleDeleteCredentialModal = (): void => {
      setOpenDeleteCredentialModal(true)
   }

   /**
    * Open withdraw credential modal handler
    */
   const handleWithdrawCredentialModal = (): void => {
      setOpenWithdrawCredentialModal(true)
   }

   return (
      <div className={styles.navigation}>
         <div className={styles.navigationHeader}>
            {Object.values(NavigationEnum).map(item => (
               <DashboardUuidNavigationItem key={item} data={item} navigation={navigation}
                                            navigationSetter={setNavigation}/>
            ))}
         </div>

         {navigation === NavigationEnum.INFO && <QualificationInformation data={data}/>}

         {navigation === NavigationEnum.HISTORY &&
            <QualificationHistory data={data.credentialChanges} isExpanded={true} isStudent={isStudent}
                                  uuid={data.uuid}/>}


         {(isStudent && data.status === CredentialStatusEnum.UPLOADED_TO_BLOCKCHAIN)
            || (isStudent && data.status === CredentialStatusEnum.ACTIVATED) ? <div className={styles.delete} onClick={handleDeleteCredentialModal}>
               <Text color="500" component="p" size="paragraph">
               Delete Credential
               </Text>
            </div> : null}

         {(!isStudent && data.status === CredentialStatusEnum.UPLOADED_TO_BLOCKCHAIN)
            || (!isStudent && data.status === CredentialStatusEnum.ACTIVATED) ? <div className={styles.delete} onClick={handleWithdrawCredentialModal}>
               <Text color="500" component="p" size="paragraph">
               Withdraw Credential
               </Text>
            </div> : null}

      </div>
   )
}