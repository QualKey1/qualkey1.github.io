import React from "react"

import classNames from "classnames/bind"

import { Text } from "@lib/components"
import { formatDate } from "@utils/formatDate"

import type { QualificationHistoryItemType } from "@customTypes/components"
import type { ICredentialShare } from "@interfaces/credentials.interface"

import styles from "./QualificationHistoryItem.module.scss"

const cx = classNames.bind(styles)

export const QualificationHistoryItem: React.FC<QualificationHistoryItemType> = ({
   data,
   id,
   handleHistoryItem,
   isShare
}): JSX.Element => {
   
   const className = cx(styles.logItem, {
      active: "id" in data
         ? data.id === id
         : "uuid" in data
            ? (data as ICredentialShare).uuid === id
            : false
   })

   /**
    * Set correct id handler
    */
   const handleItem = (): void => {
      if (!isShare && "id" in data) {
         handleHistoryItem(data.id)

      } else {
         handleHistoryItem((data as ICredentialShare).uuid)
      }
   }

   return (
      <div className={className} onClick={handleItem}>
         <Text color="500" component="p" size="paragraph">
            {formatDate("DD.MM.YYYY", data.createdAt)}
         </Text>
         <Text color="800" component="p" size="paragraph">

            {!isShare && "Credential Change"}
            {isShare && "Credential Share"}

         </Text>
         <svg fill="none" height="16" viewBox="0 0 8 16"
              width="8" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5416 0.613091L7.26348 7.43809C7.43223 7.66666 7.50098 7.88094 7.50098 8.06309C7.50098 8.24523 7.43163 8.49059 7.29198 8.65559L1.5416 15.5127C1.25723 15.8554 0.754102 15.8666 0.482227 15.5384C0.181445 15.2125 0.171664 14.6677 0.459768 14.3274L5.71348 8.06309L0.463477 1.7988C0.175383 1.45952 0.185165 0.913805 0.485936 0.587734C0.754102 0.25952 1.25723 0.270234 1.5416 0.613091Z"
                  fill="#737373"/>
         </svg>
      </div>
   )
}