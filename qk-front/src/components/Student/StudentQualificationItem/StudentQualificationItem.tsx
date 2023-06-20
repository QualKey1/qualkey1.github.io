import React from "react"

import classNames from "classnames/bind"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { useRecoilState } from "recoil"

import { isShareModalOpen, shareUuids } from "@atoms/shareModal.atom"
import { QualificationStatus } from "@components/QualificationStatus/QualificationStatus"
import { WithHover } from "@components/WithHover/WithHover"
import { CredentialStatusEnum } from "@interfaces/credentials.interface"
import { Text } from "@lib/components"
import { transformToAwsUrl } from "@utils/transformToAwsUrl"

import type { QualificationHistoryType, QualificationItemType } from "@customTypes/components"

import styles from "./StudentQualificationItem.module.scss"

const cx = classNames.bind(styles)

const QualificationHistory = dynamic<QualificationHistoryType>(() => import("@components/QualificationHistory/QualificationHistory").then(module => module.QualificationHistory))

export const StudentQualificationItem: React.FC<QualificationItemType> = ({ data, length }): JSX.Element => {

   const [isQualificationExpanded, setIsQualificationExpanded] = React.useState<boolean>(false)

   const handleExpandQualification = (): void => {
      setIsQualificationExpanded(prevState => !prevState)
   }

   const className = cx(styles.qualification, { active: isQualificationExpanded })
   const classNameActions = cx(styles.actions, {
      active: isQualificationExpanded,
      disabled: data.status !== CredentialStatusEnum.ACTIVATED
   })
   const classNameLabel = cx(styles.label, { disabled: data.status !== CredentialStatusEnum.ACTIVATED })

   const classNameWrapper = cx(styles.qualificationWrapper, { moreThanOne: length ? length > 1 : true })

   const [, setShareModalOpen] = useRecoilState(isShareModalOpen)
   const [isCheckboxChecked, setIsCheckboxChecked] = React.useState<boolean>(false)
   const [sharedUuids, setSharedUuids] = useRecoilState(shareUuids)

   /**
    * Checkbox value handler
    */
   const handleCheckboxChange = (event: React.SyntheticEvent): void => {
      if (data.status === CredentialStatusEnum.ACTIVATED) {
         const target = event.target as HTMLInputElement
         setIsCheckboxChecked(target.checked)
         if (target.checked) {
            setSharedUuids(prevState => (
               [...prevState, data.uuid]
            ))

         } else {
            const removeItem = sharedUuids.filter(id => id !== data.uuid)
            setSharedUuids(removeItem)
         }
      }
   }

   /**
    * Share one credential handler
    */
   const handleShareOne = (): void => {
      if (data.status === CredentialStatusEnum.ACTIVATED) {
         setSharedUuids(prevState => (
            [...prevState, data.uuid]
         ))
         setShareModalOpen(true)
      }
   }

   /**
    * Reset credentials checkbox state handler
    */
   React.useEffect(() => {
      if (sharedUuids.length === 0) {
         setIsCheckboxChecked(false)
      }
   }, [sharedUuids])

   return (
      <div className={classNameWrapper}>
         <div className={className}>
            <label className={classNameLabel}>
               <input checked={isCheckboxChecked} type="checkbox" onChange={handleCheckboxChange}/>
               <span className={styles.checkmark} tabIndex={0}></span>
            </label>
            <div className={styles.logoWrapper}>
               <div className={styles.uniLogo}>
                  <div className={styles.uniLogo__wrapper}>
                     <Image unoptimized alt={data?.institution.name ?? "University"} layout="fill"
                            objectFit="contain"
                            src={transformToAwsUrl(data?.institution.logoUrl ?? "")}/>
                  </div>
                  <Text color="500" component="p" size="label">
                     School Name
                  </Text>
               </div>
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
            <QualificationStatus isStudent data={data} status={data.status}/>
            <div className={classNameActions}>
               <WithHover height={34} label="Share your credentials." width={30}>
                  <svg fill="none" height="34" viewBox="0 0 30 34"
                       width="30"
                       xmlns="http://www.w3.org/2000/svg" onClick={handleShareOne}>
                     <path d="M6 22C8.76142 22 11 19.7614 11 17C11 14.2386 8.76142 12 6 12C3.23858 12 1 14.2386 1 17C1 19.7614 3.23858 22 6 22Z"
                        stroke="#262626" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
                     <path d="M23.5 33.25C26.2614 33.25 28.5 31.0114 28.5 28.25C28.5 25.4886 26.2614 23.25 23.5 23.25C20.7386 23.25 18.5 25.4886 18.5 28.25C18.5 31.0114 20.7386 33.25 23.5 33.25Z"
                        stroke="#262626" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
                     <path d="M23.5 10.75C26.2614 10.75 28.5 8.51142 28.5 5.75C28.5 2.98858 26.2614 0.75 23.5 0.75C20.7386 0.75 18.5 2.98858 18.5 5.75C18.5 8.51142 20.7386 10.75 23.5 10.75Z"
                        stroke="#262626" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
                     <path d="M19.2969 8.45312L10.2031 14.2969" stroke="#262626" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                     <path d="M10.2031 19.7031L19.2969 25.5469" stroke="#262626" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                  </svg>
               </WithHover>
               <Link href={`dashboard/${data.uuid}`}>
                  <a>
                     <WithHover height={28} label="View your credentials."
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
         <QualificationHistory isStudent data={data.credentialChanges} isExpanded={isQualificationExpanded}
                               uuid={data.uuid}/>
      </div>
   )
}