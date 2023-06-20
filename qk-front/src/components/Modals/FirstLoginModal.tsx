import React, { FormEvent } from "react"

import axios from "axios"
import { useRouter } from "next/router"

import { authUrl } from "@constants/urls"
import { Button, Heading, Input, Modal, Form } from "@lib/components"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { FormDataType } from "@customTypes/common"
import type { FirstLoginModalType } from "@customTypes/components/Modals"

const firstLoginFormInitialState = {
   oldPassword: "",
   newPassword: "",
   repeatPassword: ""
}

export const FirstLoginModal: React.FC<FirstLoginModalType> = ({ isOpen }): JSX.Element => {

   const router = useRouter()

   const [loading, setLoading] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")

   /**
    * First login password change form submit handler
    */
   const handleFormSubmit = async (event: FormEvent<HTMLFormElement>, formData: FormDataType): Promise<void> => {
      event.preventDefault()

      const { oldPassword, newPassword, repeatPassword } = formData

      if (newPassword === oldPassword) {
         setError("Same password not allowed")
      } else if (newPassword !== repeatPassword) {
         setError("Passwords do not match")

      } else {
         setLoading(true)
         await axios.post(`${authUrl}/password-reset`, {
            oldPassword,
            newPassword
         }, { withCredentials: true })
            .then(res => {
               setLoading(false)
               if (res.status === 200) {
                  setError("")
                  router.reload()
               } else {
                  setError("Unexpected response")
               }
            })
            .catch(err => {
               handleAxiosError(err as never, setError, null, setLoading)
            })
      }
   }
   
   return (
      <Modal handleCloseModal={(): void => void 0}
             isOpen={isOpen}>
         <Heading color="blue" component="h3" size="md">
            Please set a New Password
         </Heading>
         <Form handleFormSubmit={handleFormSubmit} initialState={firstLoginFormInitialState}>

            <Input fullWidth required name="oldPassword"
                   placeholder="Old Password"
                   type="password"/>
            <Input fullWidth required name="newPassword"
                   placeholder="New Password"
                   type="password"/>
            <Input fullWidth required name="repeatPassword"
                   placeholder="Repeat Password"
                   type="password"/>

            <Button fullWidth error={error} loading={loading}
                    size="lg"
                    type="submit" variant="primary">
               Submit
            </Button>
         </Form>
      </Modal>
   )
}