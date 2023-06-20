import React from "react"

import { useRecoilState, useResetRecoilState } from "recoil"

import { isUserActionModalOpen, userActionData } from "@atoms/userActionModal.atom"
import { colorBrandBlue24, colorDanger } from "@constants/styles"
import { IUserAction, UserActionTypeEnum } from "@interfaces/user.interface"

import type { UseUserActionType } from "@customTypes/hooks"

/**
 * User action modal handler
 */
export const useUserAction = (): UseUserActionType => {

   const resetIsModalOpen = useResetRecoilState(isUserActionModalOpen)
   const resetModalActionData = useResetRecoilState(userActionData)
   
   const [isModalOpen, setIsModalOpen] = useRecoilState(isUserActionModalOpen)
   const [modalActionData, setModalActionData] = useRecoilState(userActionData)

   const handleUserActionModal = (type: UserActionTypeEnum, value: boolean, data: IUserAction | null): void => {

      setIsModalOpen({
         ...isModalOpen,
         [type]: value
      })
      
      setModalActionData(data)
   }

   const UserActionTypeMapping = React.useMemo(() => {
      return new Map([
         [UserActionTypeEnum.REVIEW_WITHDRAWAL, [colorDanger, "Credential Withdrawal"]],
         [UserActionTypeEnum.REVIEW_UPLOAD, [colorBrandBlue24, "Upload of Credentials"]],
      ])
   }, [])
   
   const handleUserActionData = React.useCallback((type: UserActionTypeEnum) => {
      return UserActionTypeMapping.has(type) ? UserActionTypeMapping.get(type) : undefined
   }, [UserActionTypeMapping])

   React.useEffect(() => {
      return () => {
         resetIsModalOpen()
         resetModalActionData()
      }
   }, [resetIsModalOpen, resetModalActionData])

   return [handleUserActionData, handleUserActionModal, isModalOpen, modalActionData]
}