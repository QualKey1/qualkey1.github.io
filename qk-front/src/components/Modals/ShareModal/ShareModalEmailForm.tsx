import React from "react"

import axios from "axios"
import { useRecoilValue } from "recoil"

import { dataToShareState, shareUuids } from "@atoms/shareModal.atom"
import styles from "@components/Modals/ShareModal/ShareModalEmailForm.module.scss"
import { apiUrl } from "@constants/urls"
import { Button, Form, Input, Select, Text } from "@lib/components"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { FormDataType } from "@customTypes/common"
import type { ShareModalEmailFormType } from "@customTypes/components/Modals"

const shareFormInitialState = {
   email: "",
   name: "",
   expiresIn: []
}

const expiresInOptionsList = ["48 Hours", "14 Days", "Never"]

const expiresInMapping = new Map([
   ["48 Hours", [172800000, "This link will expire in 48 hours."]],
   ["14 Days", [1209600000, "This link will expire in 14 days."]],
   ["Never", [1577847600000, "This link will never expire."]],
])

export const ShareModalEmailForm: React.FC<ShareModalEmailFormType> = ({
   name,
   activeStepSetter,
   isPublicShare
}): JSX.Element => {

   const sharedUuids = useRecoilValue(shareUuids)
   const dataToShare = useRecoilValue(dataToShareState)

   const [expirationText, setExpirationText] = React.useState<string>("")

   const [loading, setLoading] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")

   /**
    * Share form submit handler
    */
   const handleFormSubmit = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()
      const { name, email, expiresIn } = formData

      if (!isPublicShare) {
         if ((expiresIn as string[]).length === 0) {
            setError("Select expiration date")

         } else {
            setError("")
            const expirationDate = expiresInMapping.get((expiresIn as string[])[0])

            if (expirationDate) {
               setLoading(true)
               const expirationIsoDate = new Date(Date.now() + (expirationDate[0] as number)).toISOString()
               await axios.post(`${apiUrl}/credential/share`, {
                  uuids: sharedUuids,
                  recipientEmails: [email],
                  sharedFields: dataToShare.map(item => item.value),
                  recipientName: name,
                  expiresAt: expirationIsoDate
               }, { withCredentials: true })

                  .then(res => {
                     setLoading(false)
                     setError("")
                     if (res.status === 200) {
                        activeStepSetter(prevState => prevState + 1)
                     } else {
                        setError("Unexpected response")
                     }

                  })
                  .catch(err => {
                     handleAxiosError(err as never, setError, null, setLoading)
                  })

            } else {
               setError("Unable to set expiration date")
            }
         }

      } else {
         const neverExpires = expiresInMapping.get("Never")
         if (neverExpires) {
            const expirationIsoDate = new Date(Date.now() + (neverExpires[0] as number)).toISOString()

            await axios.post(`${apiUrl}/credential/share`, {
               uuids: sharedUuids,
               recipientEmails: [email],
               sharedFields: dataToShare.map(item => item.value),
               recipientName: name,
               expiresAt: expirationIsoDate,
               isPublic: true
            }, { withCredentials: true })

               .then(res => {
                  setLoading(false)
                  setError("")
                  if (res.status === 200) {
                     activeStepSetter(prevState => prevState + 1)
                  } else {
                     setError("Unexpected response")
                  }

               })
               .catch(err => {
                  handleAxiosError(err as never, setError, null, setLoading)
               })

         } else {
            setError("Unable to create email")
         }
      }

   }

   /**
    * Get select state outside to preview in mail component
    */
   const handleGetStateOutside = (value: string): void => {
      const expirationText = expiresInMapping.get(value)
      if (expirationText) {
         setExpirationText(expirationText[1] as string)

      } else {
         setError("Unable to set expiration date")
      }
   }

   return (
      <div style={{ marginTop: "3.2rem" }}>
         <Form handleFormSubmit={handleFormSubmit} initialState={shareFormInitialState}>
            <Input fullWidth required name="email"
                   placeholder="Email:" type="email"/>
            <div className={styles.mail}>
               <div className={styles.dear}>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     Dear,
                  </Text>
                  <Input required name="name" placeholder="Recipient's name:"
                         type="text"/>
               </div>
               <Text thin color="800" component="p"
                     size="paragraph"
                     style={{ marginTop: "1.2rem", maxWidth: "55ch" }}>
                  <span style={{ fontWeight: "600" }}>{name}</span> has chosen to share their certificate with you.
                  <br/><br/>
                  QualKey uses hashgraph technology to provide secure and instant credential verification.
                  <br/><br/>
                  Please follow the link below to view the certificate. {expirationText && expirationText}
               </Text>
               <div className={styles.button}>

                  {!isPublicShare && <p>Link to shared credentials</p>}
                  {isPublicShare && <p>Link to certificate</p>}

               </div>
               <Text color="800" component="p" size="paragraph">
                  Kind Regards,
               </Text>
               <Text color="blue" component="p" size="paragraph">
                  Qualkey
               </Text>
            </div>

            {!isPublicShare && <div className={styles.adjust}>
               <div className={styles.expires}>
                  <Text color="800" component="p" size="paragraph">
                     Expires in
                  </Text>
                  <Select defaultLabel="Choose" handleGetStateOutside={handleGetStateOutside}
                          optionsList={expiresInOptionsList}
                          selectIndex={0}
                          selectKey="expiresIn"/>
               </div>
            </div>}

            <Button center error={error} loading={loading}
                    size="lg"
                    type="submit"
                    variant="primary">

               {!isPublicShare && "Share Credentials"}
               {isPublicShare && "Share Certificate"}

            </Button>
         </Form>
      </div>
   )
}