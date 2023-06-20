import React from "react"

import { WithHover } from "@components/WithHover/WithHover"
import { useGetTransactionId } from "@hooks/useGetTransactionId"
import { Button, Text } from "@lib/components"
import { formatDate } from "@utils/formatDate"
import { getDragonGlassLink } from "@utils/getDragonGlassLink"

import type { QualificationInformationType } from "@customTypes/components"

import styles from "./QualificationInformation.module.scss"

export const QualificationInformation: React.FC<QualificationInformationType> = ({ data }): JSX.Element => {

   const hederaData = useGetTransactionId("credentialChanges" in data ? data.credentialChanges : undefined)

   return (
      <div className={styles.info}>
         <div className={styles.infoWrapper}>
            <div className={styles.column}>

               <div className={styles.block}>
                  <div className={styles.blockItem}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Authenticated by:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.authenticatedBy}
                     </Text>
                  </div>
                  <div className={styles.blockItem}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Authenticated title:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.authenticatedTitle}
                     </Text>
                  </div>
                  <div className={styles.blockItem}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Date authenticated:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {formatDate("DD/MM/YYYY", data.authenticatedAt)}
                     </Text>
                  </div>
               </div>

               <div className={styles.block}>
                  <div className={styles.blockItem}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Awarding institution:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.awardingInstitution}
                     </Text>
                  </div>
                  <div className={styles.blockItem}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Name of qualification:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.qualificationName}
                     </Text>
                  </div>
                  <div className={styles.blockItem}>
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
                  <div className={styles.blockItem}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Award level:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.awardLevel}
                     </Text>
                  </div>
                  <div className={styles.blockItem}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        GPA final grade:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.gpaFinalGrade}
                     </Text>
                  </div>
               </div>

            </div>
            <div className={styles.column}>

               <div className={styles.block}>
                  <div className={styles.blockItem}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Study start date:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {formatDate("DD/MM/YYYY", data.studyStartedAt)}
                     </Text>
                  </div>
                  <div className={styles.blockItem}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Study end date:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {formatDate("DD/MM/YYYY", data.studyEndedAt)}
                     </Text>
                  </div>
                  <div className={styles.blockItem}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Graduation date:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {formatDate("DD/MM/YYYY", data.graduatedAt)}
                     </Text>
                  </div>
                  <div className={styles.blockItem}>
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
                  <div className={styles.blockItem}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Credentials expiry date:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {formatDate("DD/MM/YYYY", data.expiresAt)}
                     </Text>
                  </div>
                  <div className={styles.blockItem}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Other information:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.info}
                     </Text>
                  </div>
                  <div className={styles.blockItem}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Minors:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.minors}
                     </Text>
                  </div>
                  <div className={styles.blockItem}>
                     <Text thin color="500" component="p"
                           size="paragraph">
                        Majors:
                     </Text>
                     <Text color="800" component="p" size="paragraph">
                        {data.majors}
                     </Text>
                  </div>
               </div>

            </div>

         </div>

         <div className={styles.block}>

            {"credentialChanges" in data &&
               <div className={styles.blockItem} style={{ display: "flex", alignItems: "center" }}>
                  <Text color="blue" component="p"
                        size="paragraph">
                     Certificate ID:
                  </Text>
                  <Text color="800" component="p" size="paragraph">
                     {data.uuid}
                  </Text>
               </div>}

            {hederaData && <>
               <div className={styles.blockItem} style={{ display: "flex", alignItems: "center" }}>
                  <Text color="blue" component="p"
                        size="paragraph">
                     Hedera Hashgraph Transaction Hash:
                  </Text>
                  <Text color="800" component="p" size="paragraph"
                        style={{ maxWidth: "38ch", overflowX: "scroll" }}>
                     {hederaData.transactionHash}
                  </Text>
               </div>

            </>}
         </div>

         <WithHover height={42} label="Find out more about verification in our Help & FAQ section."
                    style={{ margin: "0 auto" }}
                    width={236}>
            <a href={getDragonGlassLink(hederaData && hederaData.transactionId)} rel="noreferrer"
               target="_blank">
               <Button center icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                         width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.75 10.7531V5.25C3.75 5.05109 3.82902 4.86032 3.96967 4.71967C4.11032 4.57902 4.30109 4.5 4.5 4.5H19.5C19.6989 4.5 19.8897 4.57902 20.0303 4.71967C20.171 4.86032 20.25 5.05109 20.25 5.25V10.7531C20.25 18.6281 13.5656 21.2344 12.2344 21.675C12.0831 21.731 11.9169 21.731 11.7656 21.675C10.4344 21.2344 3.75 18.6281 3.75 10.7531Z"
                     stroke="#0880CE" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M16.125 9.75L10.6219 15L7.875 12.375" stroke="#0880CE" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
               </svg>} loading={false}
                       size="md"
                       style={{ marginTop: "0" }}
                       variant="secondary">
                  Verify Hedera ID
               </Button>
            </a>
         </WithHover>

      </div>
   )
}