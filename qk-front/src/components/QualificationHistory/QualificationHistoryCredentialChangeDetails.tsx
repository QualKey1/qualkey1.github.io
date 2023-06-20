import React from "react"

import { useCredentialChangeDisplay } from "@hooks/useCredentialChangeDisplay"
import { Text } from "@lib/components"
import { formatDate } from "@utils/formatDate"

import type { QualificationHistoryCredentialChangeDetailsType, } from "@customTypes/components"

import styles from "./QualificationHistoryDetails.module.scss"

export const QualificationHistoryCredentialChangeDetails: React.FC<QualificationHistoryCredentialChangeDetailsType> = ({ data, id }): JSX.Element => {

   const changedData = useCredentialChangeDisplay(data, id)
   
   return (
      <>
         <div className={styles.detailsItem}>
            <Text thin color="500" component="p"
                  size="paragraph">
               Date: <span>{formatDate("DD.MM.YYYY HH:mm", data.createdAt)}</span>
            </Text>
         </div>

         {changedData.map((data, index) => (
            <div key={data.fieldName + index} className={styles.detailsItem}>
               <Text color="800" component="p" size="paragraph">
                  {data.fieldName}
               </Text>
               <Text thin color="500" component="p"
                     size="paragraph">
                  <span>{data.changedFrom}</span> changed to <span>{data.changedTo}</span>
               </Text>
            </div>
         ))}
      </>
   )
}