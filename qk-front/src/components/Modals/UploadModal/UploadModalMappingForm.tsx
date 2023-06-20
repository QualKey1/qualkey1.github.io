import React from "react"

import axios from "axios"

import { qualkeyUploadMapping } from "@constants/qualkeyUploadMapping"
import { apiUrl } from "@constants/urls"
import { Button, Form, Select, Text } from "@lib/components"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { FormDataType } from "@customTypes/common"
import type { UploadModalMappingFormType } from "@customTypes/components/Modals"

import styles from "./UploadModalMappingForm.module.scss"

export const UploadModalMappingForm: React.FC<UploadModalMappingFormType> = ({
   fields,
   handleNextStep,
   selectedFile,
   handleCloseModal
}): JSX.Element => {

   const [mappingFormInitialState, setMappingFormInitialState] = React.useState<{ [k: string]: string[] }>({})
   const [loading, setLoading] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")

   /**
    * Submit mapping form handler
    */
   const handleFormSubmit = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      const { originalKeys } = formData
      event.preventDefault()

      const originalKeysMapping = (originalKeys as string[]).join(",")

      if (selectedFile) {
         setLoading(true)
         const formData = new FormData()
         formData.append("file", selectedFile)
         formData.append("mapping", originalKeysMapping)

         await axios.post(`${apiUrl}/upload`, formData, { withCredentials: true })

            .then(res => {
               setLoading(false)
               if (res.status === 201) {
                  handleNextStep()
               } else {
                  setError("Unexpected response")
               }
            })

            .catch(err => {
               handleAxiosError(err as never, setError, null, setLoading)
            })

      } else {
         setError("File is lost, please contact support")
      }
   }

   /**
    * Controlled state implementation for Select component
    */
   React.useEffect(() => {
      if (fields) {
         const initialState = fields.map(item => qualkeyUploadMapping.get(item.originalKey) ?? item.originalKey)
         const originalKeys = fields.map(item => item.originalKey)
         setMappingFormInitialState({
            ...mappingFormInitialState,
            mapping: initialState,
            originalKeys
         })
      }
   }, [fields]) // eslint-disable-line react-hooks/exhaustive-deps

   return (
      <div className={styles.wrapper}>
         <div className={styles.titles}>
            <Text color="500" component="p" size="label">
               Column Title
            </Text>
            <Text color="500" component="p" size="label">
               Value
            </Text>
         </div>
         <Form handleFormSubmit={handleFormSubmit} initialState={mappingFormInitialState}>
            <div className={styles.form}>
               {fields && fields.map((item, index) => (
                  <div key={item.key} className={styles.item}>
                     <Text color="800" component="p" size="paragraph">
                        {item.key}
                     </Text>
                     <Select controlledState disabled fullWidth
                             defaultLabel="Select"
                             optionsList={Array.from(qualkeyUploadMapping.values())}
                             selectIndex={index}
                             selectKey="mapping"
                             state={mappingFormInitialState.mapping}/>
                  </div>
               ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.6rem" }}>
               <Button center loading={false} size="lg"
                       type="button"
                       variant="secondary"
                       onClick={handleCloseModal}>
                  Close
               </Button>
               <Button center error={error} loading={loading}
                       size="lg"
                       type="submit"
                       variant="primary">
                  Complete Upload
               </Button>
            </div>
         </Form>
      </div>
   )
}