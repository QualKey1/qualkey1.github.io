import React from "react"

import dynamic from "next/dynamic"
import { useRecoilState, useRecoilValue } from "recoil"

import { globalErrorModal } from "@atoms/globalErrorModal.atom"
import { globalLoading } from "@atoms/globalLoading.atom"
import { isShareModalOpen } from "@atoms/shareModal.atom"
import { DashboardNavigation } from "@components/DashboardNavigation/DashboardNavigation"
import { StudentQualificationItem } from "@components/Student/StudentQualificationItem/StudentQualificationItem"
import { Loading, Modal, Text } from "@lib/components"

import type { StudentDashboardType } from "@customTypes/components"
import type { ShareModalType } from "@customTypes/components/Modals"

import styles from "./StudentDashboard.module.scss"

const ShareModal = dynamic<ShareModalType>(() => import("@components/Modals").then(module => module.ShareModal))

export const StudentDashboard: React.FC<StudentDashboardType> = ({ data, name }): JSX.Element => {

   const shareModalOpen = useRecoilValue(isShareModalOpen)
   const [errorModal, setErrorModal] = useRecoilState(globalErrorModal)
   const loading = useRecoilValue(globalLoading)

   /**
    * Global error modal close handler
    */
   const handleCloseErrorModal = (): void => {
      setErrorModal({
         ...errorModal,
         isShown: false
      })
   }

   return (
      <div className={styles.dashboard}>

         <DashboardNavigation isStudent shownCredentials={data.length} totalCredentials={0}/>

         <div className={styles.qualification}>
            {data.map(item => (
               <StudentQualificationItem key={item.uuid} data={item} length={data.length}/>
            ))}
         </div>

         {data.length === 0 && <Text color="500" component="p" size="paragraph"
                                     style={{ marginTop: "1.2rem" }}>
            No records found
         </Text>}

         {loading && <Loading isOpen={loading}/>}

         {shareModalOpen && <ShareModal name={name}/>}

         {errorModal.isShown &&
            <Modal error={errorModal.error} handleCloseModal={handleCloseErrorModal} isOpen={errorModal.isShown}/>}

      </div>
   )
}