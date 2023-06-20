import React from "react"

import { getCookie } from "cookies-next"

import { UserRoleEnum } from "@interfaces/user.interface"

/**
 * Sidebar UI and routing handler
 */
export const useSidebarView = (view: UserRoleEnum, shareId?: string | string[]): Array<string[] | undefined> => {
   
   const publicShare = getCookie("publicShare")

   const [isPublicShare, setIsPublicShare] = React.useState<boolean>(false)

   React.useEffect(() => {
      if (publicShare) {
         setIsPublicShare(true)
      }
   }, [publicShare])

   const UserRoleViewMapping = React.useMemo(() => {
      return new Map([
         [UserRoleEnum.STUDENT, ["/dashboard", "Credentials Dashboard"]],
         [UserRoleEnum.INSTITUTION_REPRESENTATIVE, ["/dashboard", "University Dashboard"]],
         [UserRoleEnum.SHARED, [!isPublicShare ? `/share/${shareId}` : `/${shareId}`, "Shared Credentials"]],
      ])
   }, [shareId, isPublicShare])

   const sidebarViewData = React.useMemo(() => {
      return UserRoleViewMapping.has(view) ? UserRoleViewMapping.get(view) : undefined
   }, [view, UserRoleViewMapping])
   
   return [sidebarViewData]
}