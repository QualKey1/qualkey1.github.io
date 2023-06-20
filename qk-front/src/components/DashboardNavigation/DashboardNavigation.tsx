import React from "react"

import classNames from "classnames/bind"
import { useRouter } from "next/router"
import { useRecoilState, useRecoilValue } from "recoil"

import { isShareModalOpen, shareUuids } from "@atoms/shareModal.atom"
import { Button, Form, Input, Select, Text } from "@lib/components"
import { generateArrayOfYears } from "@utils/generateArrayOfYears"

import type { FormDataType } from "@customTypes/common"
import type { DashboardNavigationType } from "@customTypes/components"

import styles from "./DashboardNavigation.module.scss"

const cx = classNames.bind(styles)

const searchCredentialsInitialState = {
   from: [],
   to: [],
   search: ""
}

export const DashboardNavigation: React.FC<DashboardNavigationType> = ({
   isStudent,
   totalCredentials,
   shownCredentials
}): JSX.Element => {

   const router = useRouter()
   const { query } = router

   const className = cx(styles.navigation, { isStudent: isStudent })

   const sharedUuids = useRecoilValue(shareUuids)
   const [, setIsShareModalOpen] = useRecoilState(isShareModalOpen)

   /**
    * Search and filter form submit handler
    */
   const handleFormSubmit = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()
      await router.push({
         pathname: "/dashboard",
         query: {
            search: formData.search ? formData.search as string : null,
            from: formData.from as string,
            to: formData.to as string,
         }
      })
   }

   /**
    * Reset search handler
    */
   const handleResetSearch = async (): Promise<void> => {
      await router.replace("/dashboard")
   }

   /**
    * Open share modal handler
    */
   const handleOpenShareModal = (): void => {
      setIsShareModalOpen(true)
   }

   return (
      <div className={className}>

         {!isStudent && <Text color="500" component="p" size="paragraph">
            Showing <span>{shownCredentials}</span> from <span>{totalCredentials}</span> results
         </Text>}

         {isStudent && <Button disabled={!sharedUuids.length} icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                                                         width="24"
                                                                         xmlns="http://www.w3.org/2000/svg">
            <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z"
               stroke="white" strokeLinecap="round" strokeLinejoin="round"
               strokeWidth="1.5"/>
            <path d="M16.5 21.75C18.1569 21.75 19.5 20.4069 19.5 18.75C19.5 17.0931 18.1569 15.75 16.5 15.75C14.8431 15.75 13.5 17.0931 13.5 18.75C13.5 20.4069 14.8431 21.75 16.5 21.75Z"
               stroke="white" strokeLinecap="round" strokeLinejoin="round"
               strokeWidth="1.5"/>
            <path d="M16.5 8.25C18.1569 8.25 19.5 6.90685 19.5 5.25C19.5 3.59315 18.1569 2.25 16.5 2.25C14.8431 2.25 13.5 3.59315 13.5 5.25C13.5 6.90685 14.8431 8.25 16.5 8.25Z"
               stroke="white" strokeLinecap="round" strokeLinejoin="round"
               strokeWidth="1.5"/>
            <path d="M13.9777 6.87207L8.52148 10.3783" stroke="white" strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth="1.5"/>
            <path d="M8.52148 13.6221L13.9777 17.1283" stroke="white" strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth="1.5"/>
         </svg>} loading={false}
                               size="lg"
                               variant="primary"
                               onClick={handleOpenShareModal}>Share Selected</Button>}

         <div className={styles.search}>
            <Form resetValueOnQueryChange handleFormSubmit={handleFormSubmit}
                  initialState={searchCredentialsInitialState}>

               {!isStudent && <>
                  <Text thin color="500" component="p"
                        size="paragraph">
                     Date from
                  </Text>
                  <Select resetValueOnQueryChange defaultLabel="Choose" optionsList={generateArrayOfYears()}
                          selectIndex={0}
                          selectKey="from"/>
                  <Text thin color="500" component="p"
                        size="paragraph">
                     to
                  </Text>
                  <Select resetValueOnQueryChange defaultLabel="Choose" optionsList={generateArrayOfYears()}
                          selectIndex={0}
                          selectKey="to"/>
               </>}

               <Input name="search" placeholder="Search..." type="text"/>

               {!isStudent && <Button thin loading={false} size="lg"
                                      variant="primary">
                  Search
               </Button>}

            </Form>
            {!isStudent && (query.from || query.to || query.search) &&
               <Button thin loading={false} size="lg"
                       variant="primary"
                       onClick={handleResetSearch}>
                  Reset
               </Button>}
         </div>

         {!isStudent && (query.from || query.to || query.search) &&
            <Text color="800" component="p" size="paragraph">
               Search results for: {query.search && ` “${query.search}”`}
               {query.from && ` from ${query.from}`}
               {query.to && ` to ${query.to}`}
            </Text>}
      </div>
   )
}