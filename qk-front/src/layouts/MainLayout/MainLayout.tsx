import React from "react"

import { getCookie } from "cookies-next"
import dynamic from "next/dynamic"
import { useRecoilState } from "recoil"

import { isUploadModalOpen } from "@atoms/isUploadModalOpen.atom"
import { useLogout } from "@hooks/useLogout"
import { useUserAction } from "@hooks/useUserAction"
import { UserActionTypeEnum } from "@interfaces/user.interface"
import { Modal, Loading } from "@lib/components"

import type {
   FirstLoginModalType, UploadModalType,
   UserActionReviewUploadType
} from "@customTypes/components/Modals"
import type { UserActionReviewWithdrawalModalType } from "@customTypes/components/Modals/userActionReviewWithdrawalModal.type"
import type { LayoutContextType } from "@customTypes/context"
import type { MainLayoutType } from "@customTypes/layouts"

import styles from "./MainLayout.module.scss"

const Topbar = dynamic<Record<string, unknown>>(() => import("@components/Topbar/Topbar")
   .then(module => module.Topbar), { loading: () => <Loading isOpen={true}/> })
const Sidebar = dynamic<Record<string, unknown>>(() => import("@components/Sidebar/Sidebar")
   .then(module => module.Sidebar), { loading: () => <Loading isOpen={true}/> })

const FirstLoginModal = dynamic<FirstLoginModalType>(() => import("@components/Modals").then(module => module.FirstLoginModal))
const UserActionReviewWithdrawalModal = dynamic<UserActionReviewWithdrawalModalType>(() => import("@components/Modals").then(module => module.UserActionReviewWithdrawalModal))
const UserActionReviewUpload = dynamic<UserActionReviewUploadType>(() => import("@components/Modals").then(module => module.UserActionReviewUpload))
const UploadModal = dynamic<UploadModalType>(() => import("@components/Modals").then(module => module.UploadModal))

export const LayoutContext = React.createContext<LayoutContextType>({})

export const MainLayout: React.FC<MainLayoutType> = ({ userData, actionData, shareId, children }): JSX.Element => {

   const [isLogoutErrorModalOpen, setIsLogoutErrorModalOpen, logoutError, handleLogout] = useLogout()

   const [isFirstLoginModalOpen, setIsFirstLoginModalOpen] = React.useState<boolean>(false)

   const [, handleUserActionModal, isUserActionModalOpen, modalActionData] = useUserAction()

   const [isUploadModalActive, setIsUploadModalActive] = useRecoilState(isUploadModalOpen)

   /**
    * First login change password modal handler
    */
   React.useEffect(() => {
      const firstLoginCookie = getCookie("first_login")
      if (firstLoginCookie) {
         setIsFirstLoginModalOpen(true)
      }
   }, [])

   return (
      <>
         <LayoutContext.Provider value={{ userData, actionData, shareId, handleLogout }}>
            <Topbar/>
            <Sidebar/>
         </LayoutContext.Provider>

         <div className={styles.container}>
            {children}
         </div>

         {logoutError &&
            <Modal error={logoutError}
                   handleCloseModal={(): void => setIsLogoutErrorModalOpen(false)} isOpen={isLogoutErrorModalOpen}/>}

         {isFirstLoginModalOpen && <FirstLoginModal isOpen={isFirstLoginModalOpen}/>}

         {isUserActionModalOpen.REVIEW_WITHDRAWAL &&
            <UserActionReviewWithdrawalModal data={modalActionData} handleCloseModal={(): void => handleUserActionModal(
               UserActionTypeEnum.REVIEW_WITHDRAWAL, false, null
            )} isOpen={isUserActionModalOpen.REVIEW_WITHDRAWAL}/>}

         {isUserActionModalOpen.REVIEW_UPLOAD &&
            <UserActionReviewUpload data={modalActionData} handleCloseModal={(): void => handleUserActionModal(
               UserActionTypeEnum.REVIEW_UPLOAD, false, null
            )} isOpen={isUserActionModalOpen.REVIEW_UPLOAD}/>}

         {isUploadModalActive && <UploadModal handleCloseModal={(): void => setIsUploadModalActive(false)}
                                              institutionData={userData.institution} isOpen={isUploadModalActive}/>}
      </>
   )
}