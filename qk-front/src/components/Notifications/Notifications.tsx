import React from "react"

import { useUserAction } from "@hooks/useUserAction"
import { LayoutContext } from "@layouts/MainLayout/MainLayout"
import { Heading, Text } from "@lib/components"
import { formatDate } from "@utils/formatDate"

import styles from "./Notifications.module.scss"

export const Notifications: React.FC = (): JSX.Element => {

   const layoutContext = React.useContext(LayoutContext)
   const { actionData } = layoutContext

   const [handleUserActionData, handleUserActionModal] = useUserAction()

   return (
      <>
         <div className={styles.notification}>
            <div className={styles.heading}>
               <Heading color="800" component="p" size="sm">
                  Notifications
               </Heading>
            </div>
            {actionData && actionData.map(action => {
               const actionTypeData = handleUserActionData(action.type)

               return (
                  <div key={action.id} className={styles.item}
                       onClick={(): void => handleUserActionModal(action.type, true, action)}>
                     <svg fill="none" height="24" viewBox="0 0 25 24"
                          width="25" xmlns="http://www.w3.org/2000/svg">
                        <rect fill={actionTypeData && actionTypeData[0]} height="24" rx="12"
                              width="24" x="0.5"/>
                     </svg>
                     <Text bold color="800" component="p"
                           size="paragraph">
                        {actionTypeData && actionTypeData[1]}
                     </Text>
                     <Text color="500" component="p" size="label">
                        {formatDate("DD.MM.YYYY", action.createdAt)}
                     </Text>
                  </div>

               )
            })}
         </div>
      </>
   )
}