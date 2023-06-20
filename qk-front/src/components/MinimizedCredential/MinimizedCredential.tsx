import React from "react"

import { useGetTransactionId } from "@hooks/useGetTransactionId"
import { Heading, Text, Modal } from "@lib/components"
import { formatDate } from "@utils/formatDate"

import type { MinimizedCredentialType } from "@customTypes/components"

import styles from "./MinimizedCredential.module.scss"

export const MinimizedCredential: React.FC<MinimizedCredentialType> = ({ data, ...props }): JSX.Element => {
   
   const [isDataExpanded, setIsDataExpanded] = React.useState<boolean>(false)

   const hederaData = useGetTransactionId(data.credentialChanges)

   return (
      <>
         <div className={styles.preview} {...props} onClick={(): void => setIsDataExpanded(true)}>

            <div className={styles.item}>
               <svg fill="none" height="37" viewBox="0 0 38 37"
                 width="38" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 7V22" stroke="#262626" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M5.1626 35.4999C6.66346 33.1979 8.71493 31.3067 11.1312 29.9976C13.5474 28.6885 16.252 28.0029 19.0001 28.0029C21.7482 28.0029 24.4528 28.6885 26.869 29.9976C29.2853 31.3067 31.3367 33.1979 32.8376 35.4999"
                  stroke="#262626" strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M37 7L19 13L1 7L19 1L37 7Z" stroke="#262626" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M26.7438 10.4121C28.1197 11.9147 29.0288 13.7851 29.3602 15.7954C29.6916 17.8057 29.4309 19.869 28.6101 21.7337C27.7892 23.5984 26.4436 25.184 24.7372 26.2973C23.0308 27.4105 21.0374 28.0033 19 28.0033C16.9626 28.0033 14.9692 27.4105 13.2628 26.2973C11.5564 25.184 10.2108 23.5984 9.38993 21.7337C8.56907 19.869 8.30844 17.8057 8.63983 15.7954C8.97122 13.7851 9.8803 11.9147 11.2563 10.4121"
                  stroke="#262626" strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth="1.5"/>
               </svg>
               <Text bold color="800" component="p"
                  size="paragraph">
                  {data.graduatedName}
               </Text>
            </div>

            <div className={styles.item}>
               <svg fill="none" height="41" viewBox="0 0 48 41"
                 width="48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.49219 13L23.878 1L46.2638 13L23.878 25L1.49219 13Z" stroke="#262626" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M35.0708 40V19L23.8779 13" stroke="#262626" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M41.0407 15.7939V26.0314C41.0394 26.35 40.9345 26.6595 40.7422 26.9127C39.4923 28.6002 34.1944 34.7502 23.8783 34.7502C13.5621 34.7502 8.26417 28.6002 7.0143 26.9127C6.82196 26.6595 6.71716 26.35 6.71582 26.0314V15.7939"
                  stroke="#262626" strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth="1.5"/>
               </svg>
               <Text bold color="800" component="p"
                  size="paragraph">
                  {data.qualificationName}
               </Text>
            </div>

         </div>

         {isDataExpanded && <Modal handleCloseModal={(): void => setIsDataExpanded(false)} isOpen={isDataExpanded}>
            <Heading color="800" component="h3" size="md">
               Credential Information
            </Heading>

            <div className={styles.block__wrapper}>
               <div className={styles.block}>
                  <div className={styles.block__item}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Authenticated by:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.authenticatedBy}
                     </Text>
                  </div>
                  <div className={styles.block__item}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Authenticated title:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.authenticatedTitle}
                     </Text>
                  </div>
                  <div className={styles.block__item}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Date authenticated:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.authenticatedAt && formatDate("DD.MM.YYYY", data.authenticatedAt)}
                     </Text>
                  </div>
               </div>

               <div className={styles.block}>
                  <div className={styles.block__item}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Awarding institution:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.awardingInstitution}
                     </Text>
                  </div>
                  <div className={styles.block__item}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Name of qualification:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.qualificationName}
                     </Text>
                  </div>
                  <div className={styles.block__item}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Level of qualification:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.qualificationLevel}
                     </Text>
                  </div>
               </div>

               <div className={styles.block}>
                  <div className={styles.block__item}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Award level:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.awardLevel}
                     </Text>
                  </div>
               </div>

               <div className={styles.block}>
                  <div className={styles.block__item}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Study start date:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.studyStartedAt && formatDate("DD.MM.YYYY", data.studyStartedAt)}
                     </Text>
                  </div>
                  <div className={styles.block__item}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Study end date:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.studyEndedAt && formatDate("DD.MM.YYYY", data.studyEndedAt)}
                     </Text>
                  </div>
                  <div className={styles.block__item}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Graduation date:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.graduatedAt && formatDate("DD.MM.YYYY", data.graduatedAt)}
                     </Text>
                  </div>
                  <div className={styles.block__item}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Language of study:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.studyLanguage}
                     </Text>
                  </div>
               </div>

               <div className={styles.block}>
                  <div className={styles.block__item}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Credentials expiry date:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.expiresAt && formatDate("DD.MM.YYYY", data.expiresAt)}
                     </Text>
                  </div>
                  <div className={styles.block__item}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Other information:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.info}
                     </Text>
                  </div>
               </div>

               <div className={styles.block}>
                  <div className={styles.block__item}>
                     <Text color="blue" component="p"
                           size="paragraph">
                        Certificate ID:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.uuid}
                     </Text>
                  </div>

                  {hederaData && <div className={`${styles.block__item} ${styles.did}`}>
                     <Text color="blue" component="p"
                              size="paragraph">
                           Hedera Hashgraph Transaction Hash:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {hederaData.transactionHash}
                     </Text>
                  </div>}

               </div>
            </div>

         </Modal>}
      </>
   )
}