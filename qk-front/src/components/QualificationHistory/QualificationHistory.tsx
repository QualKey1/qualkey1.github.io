import React from "react"

import axios from "axios"
import classNames from "classnames/bind"
import { useRecoilState } from "recoil"

import { globalErrorModal } from "@atoms/globalErrorModal.atom"
import { QualificationHistoryCredentialChangeDetails } from "@components/QualificationHistory/QualificationHistoryCredentialChangeDetails"
import { QualificationHistoryCredentialShareDetails } from "@components/QualificationHistory/QualificationHistoryCredentialShareDetails"
import { QualificationHistoryItem } from "@components/QualificationHistory/QualificationHistoryItem"
import { apiUrl } from "@constants/urls"
import { Heading, Text } from "@lib/components"

import type { QualificationHistoryType } from "@customTypes/components"
import type { ICredentialShare } from "@interfaces/credentials.interface"

import styles from "./QualificationHistory.module.scss"

const cx = classNames.bind(styles)

export const QualificationHistory: React.FC<QualificationHistoryType> = ({
   data,
   isExpanded,
   isStudent,
   uuid
}): JSX.Element => {

   const classNameExpand = cx(styles.history, { active: isExpanded, isStudent: isStudent })

   const [, setErrorModal] = useRecoilState(globalErrorModal)

   const [historyItemId, setHistoryItemId] = React.useState<number | string | null>(null)
   const [isDataAvailable, setIsDataAvailable] = React.useState<boolean>(true)
   const [credentialShareHistory, setCredentialShareHistory] = React.useState<ICredentialShare[]>([])

   /**
    * Set history item id handler
    */
   const handleHistoryItem = (id: number | string): void => {
      setHistoryItemId(id)
   }

   /**
    * Check if data is available in UI
    */
   React.useEffect(() => {
      if (data && data.length > 0) {
         const credentialChange = data.filter(item => item.changedByUuid !== null)
         setIsDataAvailable(!!credentialChange.length)

         return () => {
            setHistoryItemId(null)
         }
      }
   }, [isExpanded, data])

   /**
    * Get shared data on expand handler
    */
   React.useEffect(() => {
      if (isExpanded && isStudent && uuid) {
         axios.get(`${apiUrl}/credential/share?credentialUuid=${uuid}`, { withCredentials: true })

            .then(res => {
               if (res.status === 200) {
                  if (res.data.length > 0) {
                     setIsDataAvailable(!!res.data.length)
                     setCredentialShareHistory(res.data)
                  }

               } else {
                  setErrorModal({
                     isShown: true,
                     error: "Unexpected response getting credential shares"
                  })
               }
            })

            .catch(err => {
               setErrorModal({
                  isShown: true,
                  error: `Unable to show credential shares: ${err.response.data.message}`
               })
            })
      }
   }, [uuid, isExpanded]) // eslint-disable-line react-hooks/exhaustive-deps

   return (
      <div className={classNameExpand}>
         <div className={styles.logs}>

            {isDataAvailable && <Heading color="800" component="h4" size="sm">
               Credentials History
            </Heading>}

            {!isDataAvailable && <Text color="500" component="p" size="paragraph"
                                       style={{ marginBottom: 0 }}>
               Empty
            </Text>}

            {(!credentialShareHistory.length && data && data.length) && data
               .filter(item => item.changedByUuid !== null)
               .map((item) => (
                  <QualificationHistoryItem key={item.id} data={item}
                                            handleHistoryItem={handleHistoryItem}
                                            id={historyItemId}
                                            isShare={false}/>
               ))}

            {(credentialShareHistory.length > 0 && data && data.length > 0) && [...credentialShareHistory, ...data]
               .sort((a, b) =>
                  new Date(b.createdAt as Date).valueOf() - new Date(a.createdAt as Date).valueOf())
               .filter(item => "changedByUuid" in item ? item.changedByUuid !== null : item)
               .map(item => {
                  if ("sharedBy" in item) return <QualificationHistoryItem key={item.uuid} data={item}
                                                      handleHistoryItem={handleHistoryItem}
                                                      id={historyItemId}
                                                      isShare={true}/>

                  else return <QualificationHistoryItem key={item.id} data={item}
                                                      handleHistoryItem={handleHistoryItem}
                                                      id={historyItemId}
                                                      isShare={false}/>
               })}

         </div>

         {historyItemId && <div className={styles.details}>
            <Heading color="800" component="h4" size="sm">
               Details
            </Heading>

            {(data && data.length > 0) && data
               .filter(item => item.id === historyItemId)
               .map(item => (
                  <QualificationHistoryCredentialChangeDetails key={item.id} data={item} id={historyItemId as number}/>
               ))}

            {<QualificationHistoryCredentialShareDetails data={credentialShareHistory} id={historyItemId as string}/>}

         </div>}

      </div>
   )
}