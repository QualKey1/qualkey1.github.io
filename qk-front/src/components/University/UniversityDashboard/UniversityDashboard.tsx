import React from "react"

import axios from "axios"
import { useRouter } from "next/router"
import InfiniteScroll from "react-infinite-scroll-component"

import { DashboardNavigation } from "@components/DashboardNavigation/DashboardNavigation"
import { UniversityQualificationItem } from "@components/University/UniversityQualificationItem/UniversityQualificationItem"
import { apiUrl } from "@constants/urls"
import { ICredential } from "@interfaces/credentials.interface"
import { Modal, Text } from "@lib/components"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { DashboardType } from "@customTypes/components"

import styles from "./UniversityDashboard.module.scss"

export const UniversityDashboard: React.FC<DashboardType> = ({ data }): JSX.Element => {

   const { query } = useRouter()

   const [qualifications, setQualifications] = React.useState<ICredential[]>([])
   const [hasMore, setHasMore] = React.useState<boolean>(false)
   const [isErrorModalOpen, setIsErrorModalOpen] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")

   /**
    * Get qualifications on scroll handler
    */
   const getMoreQualifications = async (): Promise<void> => {
      await axios.get(`${apiUrl}/credential?offset=${qualifications.length}&limit=10`, {
         params: {
            filter: query.search ? query.search as string : undefined,
            dateCreatedFrom: query.from ? query.from as string : undefined,
            dateCreatedUntil: query.to ? query.to as string : undefined
         },
         withCredentials: true
      })

         .then(res => {
            if (!res.data[1].length) {
               setHasMore(false)
            }

            setQualifications([
               ...qualifications, ...res.data[1]
            ])
         })

         .catch(err => {
            setIsErrorModalOpen(true)
            handleAxiosError(err as never, setError, null)
         })
   }

   /**
    * hasMore loader handler
    */
   React.useEffect(() => {
      if (data[0] > 10) {
         setHasMore(true)

      } else {
         setHasMore(false)
      }

      setQualifications(data[1])
   }, [data])

   return (
      <div className={styles.dashboard}>

         <DashboardNavigation shownCredentials={qualifications.length} totalCredentials={data[0]}/>

         {data[0] > 0 && <>
            <InfiniteScroll dataLength={qualifications.length} hasMore={hasMore} loader={
               <svg className={styles.loading} fill="#fff"
                    viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="15" r="15">
                     <animate attributeName="r" begin="0s" calcMode="linear"
                              dur="0.8s" from="15"
                              repeatCount="indefinite" to="15"
                              values="15;9;15"/>
                     <animate attributeName="fill-opacity" begin="0s" calcMode="linear"
                              dur="0.8s" from="1"
                              repeatCount="indefinite" to="1"
                              values="1;.5;1"/>
                  </circle>
                  <circle cx="60" cy="15" fillOpacity="0.3"
                          r="9">
                     <animate attributeName="r" begin="0s" calcMode="linear"
                              dur="0.8s" from="9"
                              repeatCount="indefinite" to="9"
                              values="9;15;9"/>
                     <animate attributeName="fill-opacity" begin="0s" calcMode="linear"
                              dur="0.8s" from="0.5"
                              repeatCount="indefinite" to="0.5"
                              values=".5;1;.5"/>
                  </circle>
                  <circle cx="105" cy="15" r="15">
                     <animate attributeName="r" begin="0s" calcMode="linear"
                              dur="0.8s" from="15"
                              repeatCount="indefinite" to="15"
                              values="15;9;15"/>
                     <animate attributeName="fill-opacity" begin="0s" calcMode="linear"
                              dur="0.8s" from="1"
                              repeatCount="indefinite" to="1"
                              values="1;.5;1"/>
                  </circle>
               </svg>}
                            next={getMoreQualifications}>
               <div className={styles.qualification}>
                  {qualifications.map(item => (
                     <UniversityQualificationItem key={item.did} data={item}/>
                  ))}
               </div>
            </InfiniteScroll>
         </>}

         {data[0] === 0 && <Text color="500" component="p" size="paragraph"
                                 style={{ marginTop: "1.2rem" }}>
            No records found
         </Text>}

         {error && <Modal error={error}
                          handleCloseModal={(): void => setIsErrorModalOpen(false)} isOpen={isErrorModalOpen}/>}
      </div>
   )
}