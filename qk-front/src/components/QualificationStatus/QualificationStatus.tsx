import React from "react"

import axios from "axios"
import { setCookie } from "cookies-next"
import { useRouter } from "next/router"
import { useRecoilState } from "recoil"

import { globalErrorModal } from "@atoms/globalErrorModal.atom"
import { globalLoading } from "@atoms/globalLoading.atom"
import { paymentDataState } from "@atoms/payment.atom"
import { WithHover } from "@components/WithHover/WithHover"
import { apiUrl } from "@constants/urls"
import { useQualificationStatus } from "@hooks/useQualificationStatus"
import { CredentialStatusEnum } from "@interfaces/credentials.interface"
import { Text } from "@lib/components"

import type { QualificationStatusType } from "@customTypes/components"

import stylesS from "../Student/StudentQualificationItem/StudentQualificationItem.module.scss"
import styles from "../University/UniversityQualificationItem/UniversityQualificationItem.module.scss"

export const QualificationStatus: React.FC<QualificationStatusType> = ({ isStudent, status, data }): JSX.Element => {

   const router = useRouter()

   const [qualificationStatus] = useQualificationStatus(status, !!isStudent)
   const [, setErrorModal] = useRecoilState(globalErrorModal)
   const [, setGlobalCredential] = useRecoilState(paymentDataState)
   const [, setLoading] = useRecoilState(globalLoading)

   /**
    * Credential activation handler
    */
   const handleActivateCredentials = async (): Promise<void> => {
      if (isStudent && status === CredentialStatusEnum.UPLOADED_TO_BLOCKCHAIN && data) {
         setLoading(true)
         setGlobalCredential(data)

         await axios.post(`${apiUrl}/payment`, { credentialUuids: [data.uuid] }, { withCredentials: true })

            .then(res => {
               setCookie("credentialActivation", data.uuid)
               setLoading(false)
               router.push(res.data)
            })

            .catch(err => {
               setLoading(false)
               setErrorModal({
                  isShown: true,
                  error: `Unable to activate credentials, error: ${err.response.data.message}`
               })
            })
      } else {
         setErrorModal({
            isShown: true,
            error: "Unable to activate credentials, please contact support"
         })
      }
   }

   return (
      <>
         <div className={isStudent ? stylesS.item : styles.item}>
            <WithHover isCenter height={30} label={qualificationStatus ? qualificationStatus[2] : ""}
                       width={30}>

               {(isStudent && status === CredentialStatusEnum.UPLOADED_TO_BLOCKCHAIN)
                  ? <svg fill="none" height="32" viewBox="0 0 33 32"
                         width="33"
                         xmlns="http://www.w3.org/2000/svg" onClick={handleActivateCredentials}>
                     <path d="M16.5 13V18" stroke={qualificationStatus && qualificationStatus[0]} strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                     <path d="M14.7758 5.00032L3.77577 24.0003C3.60053 24.3038 3.50812 24.6481 3.50781 24.9986C3.5075 25.349 3.5993 25.6934 3.774 25.9973C3.9487 26.3011 4.20018 26.5537 4.50324 26.7297C4.8063 26.9058 5.15029 26.9991 5.50077 27.0003H27.5008C27.8512 26.9991 28.1952 26.9058 28.4983 26.7297C28.8014 26.5537 29.0528 26.3011 29.2275 25.9973C29.4022 25.6934 29.494 25.349 29.4937 24.9986C29.4934 24.6481 29.401 24.3038 29.2258 24.0003L18.2258 5.00032C18.0518 4.6964 17.8007 4.44383 17.4978 4.26817C17.1949 4.09251 16.8509 4 16.5008 4C16.1506 4 15.8067 4.09251 15.5037 4.26817C15.2008 4.44383 14.9497 4.6964 14.7758 5.00032V5.00032Z"
                        stroke={qualificationStatus && qualificationStatus[0]} strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
                     <path d="M16.5 23.75C17.1904 23.75 17.75 23.1904 17.75 22.5C17.75 21.8096 17.1904 21.25 16.5 21.25C15.8096 21.25 15.25 21.8096 15.25 22.5C15.25 23.1904 15.8096 23.75 16.5 23.75Z"
                        fill={qualificationStatus && qualificationStatus[0]}/>
                  </svg>
                  : <svg fill="none" height="30" viewBox="0 0 30 30"
                         width="30" xmlns="http://www.w3.org/2000/svg">
                     <path d="M15.0003 28.3337C22.3641 28.3337 28.3337 22.3641 28.3337 15.0003C28.3337 7.63653 22.3641 1.66699 15.0003 1.66699C7.63653 1.66699 1.66699 7.63653 1.66699 15.0003C1.66699 22.3641 7.63653 28.3337 15.0003 28.3337Z"
                        stroke={qualificationStatus && qualificationStatus[0]} strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="2"/>
                     <path d="M15 20.3333V15" stroke={qualificationStatus && qualificationStatus[0]}
                           strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="2"/>
                     <path d="M15 9.66699H15.0133" stroke={qualificationStatus && qualificationStatus[0]}
                           strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="2"/>
                  </svg>
               }

            </WithHover>
            <Text bold color="000" component="p"
                  size="paragraph"
                  style={{ color: qualificationStatus && qualificationStatus[0] }}>
               {qualificationStatus && qualificationStatus[1]}
            </Text>
            <Text color="500" component="p" size="label">
               Status
            </Text>
         </div>
      </>
   )
}