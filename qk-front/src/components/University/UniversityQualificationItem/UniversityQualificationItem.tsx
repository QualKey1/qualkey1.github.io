import React, { useState } from "react"

import classNames from "classnames/bind"
import dynamic from "next/dynamic"
import Link from "next/link"

import { QualificationStatus } from "@components/QualificationStatus/QualificationStatus"
import { WithHover } from "@components/WithHover/WithHover"
import { Text } from "@lib/components"
import { formatDate } from "@utils/formatDate"

import type { QualificationHistoryType, QualificationItemType } from "@customTypes/components"

import styles from "./UniversityQualificationItem.module.scss"

const cx = classNames.bind(styles)

const QualificationHistory = dynamic<QualificationHistoryType>(() => import("@components/QualificationHistory/QualificationHistory").then(module => module.QualificationHistory))

export const UniversityQualificationItem: React.FC<QualificationItemType> = ({ data }): JSX.Element => {

   const [isQualificationExpanded, setIsQualificationExpanded] = useState<boolean>(false)

   /**
    * Expand qualification data handler
    */
   const handleExpandQualification = (): void => {
      setIsQualificationExpanded(prevState => !prevState)
   }

   const className = cx(styles.qualification, { active: isQualificationExpanded })
   const classNameActions = cx(styles.actions, { active: isQualificationExpanded })

   return (
      <div className={styles.qualificationWrapper}>
         <div className={className}>
            <div className={styles.item}>
               <svg fill="none" height="37" viewBox="0 0 38 37"
                    width="38" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 7V22" stroke="#262626" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M5.16211 35.4999C6.66298 33.1979 8.71444 31.3067 11.1307 29.9976C13.5469 28.6885 16.2515 28.0029 18.9996 28.0029C21.7477 28.0029 24.4523 28.6885 26.8686 29.9976C29.2848 31.3067 31.3362 33.1979 32.8371 35.4999"
                     stroke="#262626" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M37 7L19 13L1 7L19 1L37 7Z" stroke="#262626" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M26.7438 10.4126C28.1197 11.9152 29.0288 13.7856 29.3602 15.7959C29.6916 17.8062 29.4309 19.8694 28.6101 21.7342C27.7892 23.5989 26.4436 25.1845 24.7372 26.2978C23.0308 27.411 21.0374 28.0037 19 28.0037C16.9626 28.0037 14.9692 27.411 13.2628 26.2978C11.5564 25.1845 10.2108 23.5989 9.38993 21.7342C8.56907 19.8694 8.30844 17.8062 8.63983 15.7959C8.97122 13.7856 9.8803 11.9152 11.2563 10.4126"
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
                  Qualification
               </Text>
            </div>
            <QualificationStatus status={data.status}/>
            <div className={styles.date}>
               <Text bold color="800" component="p"
                     size="paragraph">
                  {formatDate("HH:mm DD/MM/YYYY", data.updatedAt)}
               </Text>
               <Text color="500" component="p" size="label">
                  Last Modified
               </Text>
            </div>
            <div className={classNameActions}>
               <Link href={`dashboard/${data.uuid}`}>
                  <a>
                     <WithHover height={28} label="View credentials."
                                width={30}>
                        <svg fill="none" height="28" viewBox="0 0 30 28"
                             width="30" xmlns="http://www.w3.org/2000/svg">
                           <path d="M27.5 16.5H2.5C1.80964 16.5 1.25 17.0596 1.25 17.75V25.25C1.25 25.9404 1.80964 26.5 2.5 26.5H27.5C28.1904 26.5 28.75 25.9404 28.75 25.25V17.75C28.75 17.0596 28.1904 16.5 27.5 16.5Z"
                              stroke="#262626" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                           <path d="M27.5 1.5H2.5C1.80964 1.5 1.25 2.05964 1.25 2.75V10.25C1.25 10.9404 1.80964 11.5 2.5 11.5H27.5C28.1904 11.5 28.75 10.9404 28.75 10.25V2.75C28.75 2.05964 28.1904 1.5 27.5 1.5Z"
                              stroke="#262626" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                           <path d="M23.125 8.0625C23.9879 8.0625 24.6875 7.36294 24.6875 6.5C24.6875 5.63706 23.9879 4.9375 23.125 4.9375C22.2621 4.9375 21.5625 5.63706 21.5625 6.5C21.5625 7.36294 22.2621 8.0625 23.125 8.0625Z"
                              fill="#262626"/>
                           <path d="M23.125 23.0625C23.9879 23.0625 24.6875 22.3629 24.6875 21.5C24.6875 20.6371 23.9879 19.9375 23.125 19.9375C22.2621 19.9375 21.5625 20.6371 21.5625 21.5C21.5625 22.3629 22.2621 23.0625 23.125 23.0625Z"
                              fill="#262626"/>
                        </svg>
                     </WithHover>
                  </a>
               </Link>
               <WithHover height={30} label="Expand credential history."
                          width={32}>
                  <svg fill="none" height="30" viewBox="0 0 32 16"
                       width="32"
                       xmlns="http://www.w3.org/2000/svg" onClick={handleExpandQualification}>
                     <path d="M30.8998 3.33223L17.2498 14.776C16.7927 15.1135 16.3641 15.251 15.9998 15.251C15.6355 15.251 15.1448 15.1123 14.8148 14.833L1.10053 3.33223C0.415097 2.76348 0.392812 1.75723 1.0491 1.21348C1.70088 0.611914 2.79052 0.592352 3.47124 1.16856L15.9998 11.676L28.5284 1.17598C29.2069 0.59979 30.2984 0.619353 30.9505 1.2209C31.6069 1.75723 31.5855 2.76348 30.8998 3.33223Z"
                        fill="#262626"/>
                  </svg>
               </WithHover>
               <Text color="500" component="p" size="label">
                  Actions
               </Text>
            </div>
         </div>
         <QualificationHistory data={data.credentialChanges} isExpanded={isQualificationExpanded}/>
      </div>
   )
}