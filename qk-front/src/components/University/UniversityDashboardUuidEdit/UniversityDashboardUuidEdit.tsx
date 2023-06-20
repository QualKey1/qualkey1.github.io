import React from "react"

import axios from "axios"
import classNames from "classnames/bind"
import moment from "moment/moment"
import { useRouter } from "next/router"

import { qualkeyFieldsMapping } from "@constants/qualkeyFieldsMapping"
import { apiUrl } from "@constants/urls"
import { FormDataType } from "@customTypes/common"
import { Button, Form, Heading, Input, Text } from "@lib/components"
import { compareObjects } from "@utils/compareObjects"
import { formatDate } from "@utils/formatDate"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { UniversityDashboardUuidEditType } from "@customTypes/components"

import styles from "./UniversityDashboardUuidEdit.module.scss"

const cx = classNames.bind(styles)

export const UniversityDashboardUuidEdit: React.FC<UniversityDashboardUuidEditType> = ({
   data,
   handleToggleIsEditOpen
}): JSX.Element => {

   const initialStringData = React.useMemo(() => {
      return {
         ["graduatedName"]: data.graduatedName ?? "",
         ["qualificationName"]: data.qualificationName ?? "",
         ["qualificationLevel"]: data.qualificationLevel ?? "",
         ["studyLanguage"]: data.studyLanguage ?? "",
         ["awardLevel"]: data.awardLevel ?? "",
         ["gpaFinalGrade"]: data.gpaFinalGrade ?? "",
         ["info"]: data.info ?? "",
      }
   }, [data])

   const initialDateData = React.useMemo(() => {
      return {
         ["expiresAt"]: formatDate("DD/MM/YYYY", data.expiresAt),
         ["graduatedAt"]: formatDate("DD/MM/YYYY", data.graduatedAt),
         ["studyEndedAt"]: formatDate("DD/MM/YYYY", data.studyEndedAt),
         ["studyStartedAt"]: formatDate("DD/MM/YYYY", data.studyStartedAt),
      }
   }, [data])

   const router = useRouter()

   const [stringData] = React.useState<{ [k: string]: string }>(initialStringData)

   const [dateData] = React.useState<({ [k: string]: Date | string | null })>(initialDateData)

   const [activeForm, setActiveForm] = React.useState<"strings" | "dates" | null>(null)

   const [loading, setLoading] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")
   const [success, setSuccess] = React.useState<string>("")

   const classNameHeader = cx(styles.header, { chosen: activeForm !== null })

   const handleFormSubmit = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()

      if (activeForm === "dates") {
         const difference = compareObjects(dateData, formData)

         if (Object.values(difference).length > 0) {
            for (const value of Object.values(difference)) {
               const date = moment(value, "DD/MM/YYYY")
               if (!date.isValid()) {
                  setError("Provided date is not valid, please try DD/MM/YYYY")

               } else {
                  setError("")
                  setLoading(true)
                  await axios.post(`${apiUrl}/credential/change`, {
                     uuid: data.uuid,
                     changedTo: Object.values(difference).map(value => moment(value, "DD/MM/YYYY").format()),
                     fieldName: Object.keys(difference)
                  }, { withCredentials: true })

                     .then(res => {
                        setLoading(false)
                        if (res.status === 200) {
                           setSuccess("Credential was successfully updated")
                           setTimeout(() => {
                              router.reload()
                           }, 1500)

                        } else {
                           setError("Unexpected response")
                        }
                     })

                     .catch(err => {
                        handleAxiosError(err as never, setError, null, setLoading)
                     })
               }
            }

         } else {
            setError("Credentials data was not updated")
         }
      }

      if (activeForm === "strings") {
         const difference = compareObjects(stringData, formData)

         if (Object.values(difference).length > 0) {
            setLoading(true)
            await axios.post(`${apiUrl}/credential/change`, {
               uuid: data.uuid,
               changedTo: Object.values(difference),
               fieldName: Object.keys(difference)
            }, { withCredentials: true })

               .then(res => {
                  setLoading(false)
                  if (res.status === 200) {
                     setSuccess("Credential was successfully updated")
                     setTimeout(() => {
                        router.reload()
                     }, 1500)

                  } else {
                     setError("Unexpected response")
                  }
               })

               .catch(err => {
                  handleAxiosError(err as never, setError, null, setLoading)
               })

         } else {
            setError("Credentials data was not updated")
         }
      }
   }

   return (
      <div className={styles.wrapper}>
         <div className={classNameHeader}>

            {activeForm !== null && <>
               <Button icon={<svg fill="none" height="10" viewBox="0 0 12 10"
                                  width="12"
                                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.6875 8.9375L0.75 5L4.6875 1.0625" stroke="#0880CE" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M11.25 5L0.75 5" stroke="#0880CE" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
               </svg>} loading={false} size="md"
                       variant="secondary"
                       onClick={(): void => setActiveForm(null)}>
                  Return
               </Button>
               <Heading color="800" component="p" size="sm">
                  Edit Credentials
               </Heading>
            </>}

            {activeForm === null && <>
               <Button loading={false} size="md" variant="primary"
                       onClick={(): void => setActiveForm("dates")}>
                  Edit Dates
               </Button>
               <Button loading={false} size="md" variant="primary"
                       onClick={(): void => setActiveForm("strings")}>
                  Edit Other Information
               </Button>
               <svg fill="none" height="27" style={{ cursor: "pointer", position: "absolute", right: "1.6rem", top: "1.6rem" }}
                    viewBox="0 0 27 27"
                    width="27"
                    xmlns="http://www.w3.org/2000/svg" onClick={handleToggleIsEditOpen}>
                  <path d="M22.1121 22.1122C26.7984 17.4259 26.7984 9.82796 22.1121 5.14167C17.4258 0.45538 9.82782 0.455381 5.14153 5.14167C0.45524 9.82796 0.45524 17.4259 5.14153 22.1122C9.82782 26.7985 17.4258 26.7985 22.1121 22.1122Z"
                     stroke="#A3A3A3" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M10.0938 17.1621L17.1648 10.091" stroke="#A3A3A3" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M10.0938 10.0918L17.1648 17.1629" stroke="#A3A3A3" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
               </svg>
            </>}
         </div>
         <div className={styles.content}>

            <div className={styles.readonly}>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("authenticatedBy")}
                  </Text>
                  <input disabled type="text" value={data.authenticatedBy}/>
               </div>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("authenticatedTitle")}
                  </Text>
                  <input disabled type="text" value={data.authenticatedTitle}/>
               </div>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("authenticatedDate")}
                  </Text>
                  <input disabled type="text" value={formatDate("DD/MM/YYYY", data.authenticatedAt) ?? ""}/>
               </div>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("awardingInstitution")}
                  </Text>
                  <input disabled type="text" value={data.awardingInstitution}/>
               </div>
            </div>

            {activeForm === "strings" && <Form editFunctionality activeFormSetter={setActiveForm}
                                               handleFormSubmit={handleFormSubmit}
                                               initialState={stringData}>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("graduatedName")}
                  </Text>
                  <Input name="graduatedName" type="text"/>
               </div>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("qualificationName")}
                  </Text>
                  <Input name="qualificationName" type="text"/>
               </div>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("qualificationLevel")}
                  </Text>
                  <Input name="qualificationLevel" type="text"/>
               </div>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("studyLanguage")}
                  </Text>
                  <Input name="studyLanguage" type="text"/>
               </div>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("awardLevel")}
                  </Text>
                  <Input name="awardLevel" type="text"/>
               </div>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("gpaFinalGrade")}
                  </Text>
                  <Input name="gpaFinalGrade" type="text"/>
               </div>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("info")}
                  </Text>
                  <Input name="info" type="text"/>
               </div>

               {<Button center error={error} icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                                        width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.25 6.75L9.75 17.25L4.5 12" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
               </svg>}
                        loading={loading}
                        size="lg"
                        success={success} type="submit"
                        variant="primary">
                  Confirm Changes
               </Button>}

            </Form>}

            {activeForm === "dates" && <Form editFunctionality activeFormSetter={setActiveForm}
                                             handleFormSubmit={handleFormSubmit}
                                             initialState={dateData}>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("expiresAt")}
                  </Text>
                  <Input name="expiresAt" type="text"/>
               </div>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("graduatedAt")}
                  </Text>
                  <Input name="graduatedAt" type="text"/>
               </div>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("studyEndedAt")}
                  </Text>
                  <Input name="studyEndedAt" type="text"/>
               </div>
               <div className={styles.item}>
                  <Text color="500" component="p" size="paragraph">
                     {qualkeyFieldsMapping.get("studyStartedAt")}
                  </Text>
                  <Input name="studyStartedAt" type="text"/>
               </div>

               <Button center error={error} icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                                       width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.25 6.75L9.75 17.25L4.5 12" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
               </svg>}
                       loading={loading}
                       size="lg"
                       success={success} type="submit"
                       variant="primary">
                  Confirm Changes
               </Button>
            </Form>}

         </div>


      </div>
   )
}