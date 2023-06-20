import React from "react"

import classNames from "classnames/bind"
import Image from "next/image"
import Link from "next/link"

import { QualificationInformation } from "@components/QualificationInformation/QualificationInformation"
import { WithHover } from "@components/WithHover/WithHover"
import { url } from "@constants/urls"
import { Button, Text } from "@lib/components"
import { transformToAwsUrl } from "@utils/transformToAwsUrl"

import type { ShareItemType } from "@customTypes/components"

import styles from "./ShareItem.module.scss"

const cx = classNames.bind(styles)

export const ShareItem: React.FC<ShareItemType> = ({ data, length }): JSX.Element => {

   const [isExpanded, setIsExpanded] = React.useState<boolean>(false)

   const classNameWrapper = cx(styles.qualificationWrapper, { moreThanOne: length ? length > 1 : true, active: isExpanded })
   const classNameQualification = cx(styles.qualification, { active: isExpanded })
   const classNameActions = cx(styles.actions, { active: isExpanded })

   return (
      <>
         {data && <div className={classNameWrapper}>
            <div className={classNameQualification}>
               <div className={styles.logoWrapper}>
                  <div className={styles.uniLogo}>
                     <div className={styles.uniLogo__wrapper}>
                        <Image unoptimized alt={data?.awardingInstitution ?? "University"} layout="fill"
objectFit="contain"
                               src={transformToAwsUrl(data?.institutionLogoUrl ?? "")}/>
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
               <div className={classNameActions}>
                  <Link href={`${url}/${data.did}`}>
                     <a>
                        <WithHover height={33} label="View certificate." width={32}>
                           <svg fill="none" height="33" viewBox="0 0 32 33"
                                width="32" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 12.5H20" stroke="#262626" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="1.5"/>
                              <path d="M12 16.5H20" stroke="#262626" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="1.5"/>
                              <path d="M12 20.5H16" stroke="#262626" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="1.5"/>
                              <path d="M19.5875 27.5H6C5.73478 27.5 5.48043 27.3946 5.29289 27.2071C5.10536 27.0196 5 26.7652 5 26.5V6.5C5 6.23478 5.10536 5.98043 5.29289 5.79289C5.48043 5.60536 5.73478 5.5 6 5.5H26C26.2652 5.5 26.5196 5.60536 26.7071 5.79289C26.8946 5.98043 27 6.23478 27 6.5V20.0875C27.0005 20.2174 26.9753 20.346 26.926 20.4661C26.8766 20.5862 26.8041 20.6955 26.7125 20.7875L20.2875 27.2125C20.1955 27.3041 20.0862 27.3766 19.9661 27.426C19.846 27.4753 19.7174 27.5005 19.5875 27.5V27.5Z"
                                    stroke="#262626" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="1.5"/>
                              <path d="M26.9125 20.5H20V27.4125" stroke="#262626" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="1.5"/>
                           </svg>
                        </WithHover>
                     </a>
                  </Link>
                  <Button icon={<svg fill="none" height="25" viewBox="0 0 24 25"
                                     width="24" xmlns="http://www.w3.org/2000/svg">
                     <path d="M23.5885 8.87046L12.972 17.771C12.6165 18.0335 12.2831 18.1405 11.9998 18.1405C11.7165 18.1405 11.3348 18.0326 11.0782 17.8154L0.411623 8.87046C-0.121481 8.42811 -0.138814 7.64548 0.371624 7.22257C0.878562 6.75469 1.72605 6.73947 2.25549 7.18763L11.9998 15.36L21.7441 7.1934C22.2719 6.74526 23.1208 6.76047 23.628 7.22834C24.1385 7.64548 24.1219 8.42811 23.5885 8.87046Z"
                        fill="#fff"/>
                  </svg>
                  } loading={false} size="lg"
                          style={{ marginTop: "0" }}
                          variant="primary"
                          onClick={(): void => setIsExpanded(prevState => !prevState)}>
                     View Credentials</Button>
                  <Text color="500" component="p" size="label">
                     Actions
                  </Text>
               </div>
            </div>
            <QualificationInformation data={data}/>
         </div>}
      </>
   )
}