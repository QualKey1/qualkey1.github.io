import React from "react"

import {
   ArcElement,
   BarElement,
   CategoryScale,
   Chart,
   Legend,
   LinearScale,
   LineElement,
   PointElement,
   Title,
   Tooltip
} from "chart.js"
import { useRouter } from "next/router"
import { Bar, Doughnut } from "react-chartjs-2"

import {
   colorBlack300,
   colorBrandBlue24,
   colorBrandBlue25,
   colorDanger,
   colorPending,
   colorSuccess
} from "@constants/styles"
import { Button, Form, Heading, Select, Text } from "@lib/components"
import { generateArrayOfYears } from "@utils/generateArrayOfYears"

import type { FormDataType } from "@customTypes/common"
import type { AnalyticsComponentType } from "@customTypes/components"

import styles from "./AnalyticsComponent.module.scss"

Chart.register(
   BarElement,
   ArcElement,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend
)

const statsFilterInitialState = {
   filter: [],
   from: [],
   to: []
}

export const AnalyticsComponent: React.FC<AnalyticsComponentType> = ({ statsData }): JSX.Element => {

   const router = useRouter()

   const handleCountPercent = (total: number, active: number): string => {
      const percent = active / total * 100
      if (!isNaN(percent)) return `${percent.toFixed(1)}%`
      return ""
   }

   const dataActivated = React.useMemo(() => {
      return {
         labels: [
            "Activated",
            "Pending"
         ],
         datasets: [{
            label: "Qualifications Activated",
            data: [statsData.activatedQualifications, (statsData.totalQualifications - statsData.activatedQualifications)],
            backgroundColor: [colorSuccess, colorBlack300],
            hoverOffset: 3
         }],
      }
   }, [statsData])

   const dataShared = React.useMemo(() => {
      return {
         labels: [
            "Shared",
            "Not Shared"
         ],
         datasets: [{
            label: "Qualifications Shared",
            data: [statsData.sharedQualifications, (statsData.totalQualifications - statsData.sharedQualifications)],
            backgroundColor: [colorBrandBlue24, colorBlack300],
            hoverOffset: 3
         }]
      }
   }, [statsData])

   const dataEdited = React.useMemo(() => {
      return {
         labels: [
            "Edited",
            "Unedited"
         ],
         datasets: [{
            label: "Qualifications Edited",
            data: [statsData.editedQualifications, (statsData.totalQualifications - statsData.editedQualifications)],
            backgroundColor: [colorPending, colorBlack300],
            hoverOffset: 3
         }]
      }
   }, [statsData])

   const dataWithdrawn = React.useMemo(() => {
      return {
         labels: [
            "Withdrawn",
            "Other"
         ],
         datasets: [{
            label: "Qualifications Withdrawn",
            data: [statsData.withdrawnQualifications, (statsData.totalQualifications - statsData.withdrawnQualifications)],
            backgroundColor: [colorDanger, colorBlack300],
            hoverOffset: 3
         }]
      }
   }, [statsData])

   const minutes = React.useMemo(() => {
      return statsData.sharedQualifications * 10
   }, [statsData])

   const hours = React.useMemo(() => {
      return minutes / 60
   }, [minutes])

   const days = React.useMemo(() => {
      return hours / 8
   }, [hours])

   const emails = React.useMemo(() => {
      return statsData.sharedQualifications * 3
   }, [statsData])

   const savedTimeData = React.useMemo(() => {
      return {
         labels: [
            "Minutes Saved",
            "Hours Saved",
            "Days Saved",
            "Email Prevented"
         ],
         datasets: [{
            axis: "y",
            label: "Saved Time",
            data: [
               minutes, hours, days, emails
            ],
            fill: true,
            backgroundColor: [
               colorBrandBlue24,
               "#EBC454",
               "#57D19E",
               colorBrandBlue25
            ]
         }]
      }
   }, [minutes, hours, days, emails])

   const handleFormSubmit = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()
      await router.push({
         pathname: "/analytics",
         query: {
            filter: formData.filter ? formData.filter as string : null,
            from: formData.from as string,
            to: formData.to as string,
         }
      })
   }

   /**
    * Reset search handler
    */
   const handleResetSearch = async (): Promise<void> => {
      await router.replace("/analytics")
   }

   return (
      <div className={styles.wrapper}>

         <Form resetValueOnQueryChange handleFormSubmit={handleFormSubmit} initialState={statsFilterInitialState}>
            <div className={styles.filter}>
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
               <Select resetValueOnQueryChange defaultLabel="Qualifications" optionsList={statsData.qualificationNames}
                       selectIndex={0}
                       selectKey="filter"/>
               {(router.query.from || router.query.to || router.query.filter) ?
                  <Button thin loading={false} size="lg"
                          style={{ marginTop: "0", backgroundColor: colorBrandBlue24 }} type="button"
                          variant="primary"
                          onClick={handleResetSearch}>
                     Reset
                  </Button> : <Button thin loading={false} size="lg"
                                      type="submit"
                                      variant="primary">
                     Search
                  </Button>}
            </div>

            {(router.query.from || router.query.to || router.query.filter) &&
               <Text color="800" component="p" size="paragraph"
                     style={{ marginBottom: "1.6rem" }}>
                  Search results for: {router.query.filter && ` “${router.query.filter}”`}
                  {router.query.from && ` from ${router.query.from}`}
                  {router.query.to && ` to ${router.query.to}`}
               </Text>}

         </Form>

         <div className={styles.data}>
            <Heading color="800" component="p" size="sm">
               Qualifications Data
            </Heading>
            <div className={styles.dataWrapper}>
               <div className={styles.dataItem}>
                  <Heading color="800" component="p" size="sm">
                     {statsData.totalQualifications}
                  </Heading>
                  <div>
                     <svg fill="none" height="49" viewBox="0 0 48 49"
                          width="48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M37.5 42.5H10.5C10.1022 42.5 9.72064 42.342 9.43934 42.0607C9.15804 41.7794 9 41.3978 9 41V8C9 7.60218 9.15804 7.22064 9.43934 6.93934C9.72064 6.65804 10.1022 6.5 10.5 6.5H28.5L39 17V41C39 41.3978 38.842 41.7794 38.5607 42.0607C38.2794 42.342 37.8978 42.5 37.5 42.5Z"
                           stroke="#16A34A" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M28.5 6.5V17H39" stroke="#16A34A" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M18.75 28.25L24 23L29.25 28.25" stroke="#16A34A" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M24 35V23" stroke="#16A34A" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                     </svg>
                     <Text color="500" component="p" size="paragraph">
                        Qualifications Uploaded
                     </Text>
                  </div>
               </div>
               <div className={styles.dataItem}>
                  <Heading color="800" component="p" size="sm">
                     {statsData.sharedQualifications}
                  </Heading>
                  <div>
                     <svg fill="none" height="49" viewBox="0 0 48 49"
                          width="48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 30.5C15.3137 30.5 18 27.8137 18 24.5C18 21.1863 15.3137 18.5 12 18.5C8.68629 18.5 6 21.1863 6 24.5C6 27.8137 8.68629 30.5 12 30.5Z"
                           stroke="#0880CE" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M33 44C36.3137 44 39 41.3137 39 38C39 34.6863 36.3137 32 33 32C29.6863 32 27 34.6863 27 38C27 41.3137 29.6863 44 33 44Z"
                           stroke="#0880CE" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M33 17C36.3137 17 39 14.3137 39 11C39 7.68629 36.3137 5 33 5C29.6863 5 27 7.68629 27 11C27 14.3137 29.6863 17 33 17Z"
                           stroke="#0880CE" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M27.9555 14.2437L17.043 21.2562" stroke="#0880CE" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M17.043 27.7437L27.9555 34.7561" stroke="#0880CE" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                     </svg>
                     <Text color="500" component="p" size="paragraph">
                        Qualifications Shared
                     </Text>
                  </div>
               </div>
               <div className={styles.dataItem}>
                  <Heading color="800" component="p" size="sm">
                     {statsData.editedQualifications}
                  </Heading>
                  <div>
                     <svg fill="none" height="49" viewBox="0 0 48 49"
                          width="48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 30.5H18V24.5L36 6.5L42 12.5L24 30.5Z" stroke="#EA580C" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M31.5 11L37.5 17" stroke="#EA580C" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M40.5 23V39.5C40.5 39.8978 40.342 40.2794 40.0607 40.5607C39.7794 40.842 39.3978 41 39 41H9C8.60218 41 8.22064 40.842 7.93934 40.5607C7.65804 40.2794 7.5 39.8978 7.5 39.5V9.5C7.5 9.10218 7.65804 8.72064 7.93934 8.43934C8.22064 8.15804 8.60218 8 9 8H25.5"
                           stroke="#EA580C" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                     </svg>
                     <Text color="500" component="p" size="paragraph">
                        Qualifications Edited
                     </Text>
                  </div>
               </div>
               <div className={styles.dataItem}>
                  <Heading color="800" component="p" size="sm">
                     {statsData.withdrawnQualifications}
                  </Heading>
                  <div>
                     <svg fill="none" height="49" viewBox="0 0 48 49"
                          width="48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M37.5 11L10.5 38" stroke="#D6193D" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M37.5 38L10.5 11" stroke="#D6193D" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                     </svg>
                     <Text color="500" component="p" size="paragraph">
                        Qualifications Withdrawn
                     </Text>
                  </div>
               </div>
            </div>
         </div>
         <div className={styles.chart}>
            <div className={styles.chartItem}>
               <Text color="800" component="p" size="paragraph">
                  Qualifications Activated
               </Text>
               <div style={{ position: "relative" }}>
                  <Doughnut data={dataActivated}/>
                  <Text thin color="800" component="p"
                        size="paragraph"
                        style={{
                           fontSize: "2.6rem",
                           position: "absolute",
                           top: "53%",
                           left: "50%",
                           transform: "translate(-50%, -50%)"
                        }}>
                     {handleCountPercent(statsData.totalQualifications, statsData.activatedQualifications)}
                  </Text>
               </div>
            </div>
            <div className={styles.chartItem}>
               <Text color="800" component="p" size="paragraph">
                  Qualifications Shared
               </Text>
               <div style={{ position: "relative" }}>
                  <Doughnut data={dataShared}/>
                  <Text thin color="800" component="p"
                        size="paragraph"
                        style={{
                           fontSize: "2.6rem",
                           position: "absolute",
                           top: "53%",
                           left: "50%",
                           transform: "translate(-50%, -50%)"
                        }}>
                     {handleCountPercent(statsData.totalQualifications, statsData.sharedQualifications)}
                  </Text>
               </div>
            </div>
            <div className={styles.chartItem}>
               <Text color="800" component="p" size="paragraph">
                  Qualifications Edited
               </Text>
               <div style={{ position: "relative" }}>
                  <Doughnut data={dataEdited}/>
                  <Text thin color="800" component="p"
                        size="paragraph"
                        style={{
                           fontSize: "2.6rem",
                           position: "absolute",
                           top: "53%",
                           left: "50%",
                           transform: "translate(-50%, -50%)"
                        }}>
                     {handleCountPercent(statsData.totalQualifications, statsData.editedQualifications)}
                  </Text>
               </div>
            </div>
            <div className={styles.chartItem}>
               <Text color="800" component="p" size="paragraph">
                  Qualifications Withdrawn
               </Text>
               <div style={{ position: "relative" }}>
                  <Doughnut data={dataWithdrawn}/>
                  <Text thin color="800" component="p"
                        size="paragraph"
                        style={{
                           fontSize: "2.6rem",
                           position: "absolute",
                           top: "53%",
                           left: "50%",
                           transform: "translate(-50%, -50%)"
                        }}>
                     {handleCountPercent(statsData.totalQualifications, statsData.withdrawnQualifications)}
                  </Text>
               </div>
            </div>
         </div>
         <div className={styles.productivity}>
            <Heading color="800" component="p" size="sm">
               Saved Productivity
            </Heading>
            <Bar data={savedTimeData}/>
         </div>
      </div>
   )
}