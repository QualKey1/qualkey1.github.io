import React from "react"

import axios from "axios"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useRouter } from "next/router"

import avatar from "@assets/images/avatar-placeholder.png"
import { apiUrl, authUrl } from "@constants/urls"
import { SettingsViewEnum } from "@customTypes/components"
import { DeleteAccountModalType } from "@customTypes/components/Modals"
import { CurrencyEnum, UserRoleEnum } from "@interfaces/user.interface"
import { Button, Checkbox, Form, Heading, Input, Select, Text } from "@lib/components"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { FormDataType } from "@customTypes/common"
import type { SettingsType } from "@customTypes/components"

import styles from "./SettingsComponent.module.scss"

const DeleteAccountModal = dynamic<DeleteAccountModalType>(() => import("@components/Modals").then(module => module.DeleteAccountModal))

const passwordFormInitialState = {
   oldPassword: "",
   newPassword: "",
   repeatNewPassword: ""
}

const securityPrivacyFormInitialState = { newsAndUpdates: false }

const currencyFormInitialState = { options: [] }

export const SettingsComponent: React.FC<SettingsType> = ({ userData }): JSX.Element => {

   const router = useRouter()

   const [isDeleteAccountModalShown, setIsDeleteAccountModalShown] = React.useState<boolean>(false)
   const [settingsView, setSettingsView] = React.useState<SettingsViewEnum>(SettingsViewEnum.ACCOUNT)
   const [loading, setLoading] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")
   const [success, setSuccess] = React.useState<string>("")

   const accountFormInitialState = React.useMemo(() => {
      return {
         fullName: userData.fullName,
         email: userData.email,
         organisation: userData.institution?.name
      }
   }, [userData])

   /**
    * Settings form submit handler
    */
   const handleFormSubmit = async (event: React.SyntheticEvent, formData: FormDataType): Promise<void> => {
      event.preventDefault()

      if (settingsView === SettingsViewEnum.CHANGE_PASSWORD) {
         const { oldPassword, newPassword, repeatNewPassword } = formData
         if (newPassword !== repeatNewPassword) {
            setError("Passwords do not match")
         } else if (oldPassword === newPassword) {
            setError("Same password not allowed")

         } else {
            setLoading(true)
            setError("")
            await axios.post(`${authUrl}/password-reset`, {
               oldPassword,
               newPassword
            }, { withCredentials: true })

               .then(res => {
                  setLoading(false)
                  setError("")
                  if (res.status === 200) {
                     setSuccess("Password has been changed!")
                     setTimeout(() => {
                        router.reload()
                     }, 1000)
                  } else {
                     setError("Unexpected response")
                  }
               })

               .catch(err => {
                  handleAxiosError(err as never, setError, null, setLoading)
               })
         }
      }

      if (settingsView === SettingsViewEnum.CURRENCY) {
         const { options } = formData
         if (!(options as string[]).length) {
            setError("Please select currency")

         } else {
            setLoading(true)
            setError("")
            await axios.patch(`${apiUrl}/user/setting`, {
               settingName: "currency",
               newValue: (options as string[])[0]
            }, { withCredentials: true })

               .then(res => {
                  setLoading(false)
                  setError("")
                  if (res.status === 200) {
                     setSuccess("Currency has been changed!")
                     setTimeout(() => {
                        router.reload()
                     }, 1000)
                  } else {
                     setError("Unexpected response")
                  }
               })

               .catch(err => {
                  handleAxiosError(err as never, setError, null, setLoading)
               })
         }
      }
   }

   /**
    * Remove error from UI on menu change handler
    */
   React.useEffect(() => {
      setError("")
   }, [settingsView])


   /**
    * Delete account modal handler
    */
   const showDeleteAccountModal = (): void => {
      setIsDeleteAccountModalShown(true)
   }

   return (
      <>
         <div className={styles.settings}>
            <div className={styles.menu}>
               <div className={styles.top}>
                  <Image alt={userData.fullName} className={styles.avatar} height={96}
                         quality={100} src={avatar} width={96}/>
                  <Heading color="800" component="p" size="sm">
                     {userData.fullName}
                  </Heading>
               </div>
               <div className={styles.wrapper}>

                  <div className={`${styles.menuItem} ${settingsView === SettingsViewEnum.ACCOUNT && styles.active}`}
                       onClick={(): void => setSettingsView(SettingsViewEnum.ACCOUNT)}>
                     <svg fill="none" height="24" viewBox="0 0 24 24"
                          width="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.75 16.5C11.4069 16.5 12.75 15.1569 12.75 13.5C12.75 11.8431 11.4069 10.5 9.75 10.5C8.09315 10.5 6.75 11.8431 6.75 13.5C6.75 15.1569 8.09315 16.5 9.75 16.5Z"
                           stroke="#262626" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M5.00625 19.5C5.43196 18.6022 6.1037 17.8436 6.94343 17.3124C7.78315 16.7813 8.75638 16.4993 9.75 16.4993C10.7436 16.4993 11.7168 16.7813 12.5566 17.3124C13.3963 17.8436 14.068 18.6022 14.4938 19.5H20.25C20.4489 19.5 20.6397 19.421 20.7803 19.2803C20.921 19.1397 21 18.9489 21 18.75V5.25C21 5.05109 20.921 4.86032 20.7803 4.71967C20.6397 4.57902 20.4489 4.5 20.25 4.5H3.75C3.55109 4.5 3.36032 4.57902 3.21967 4.71967C3.07902 4.86032 3 5.05109 3 5.25V18.75C3 18.9489 3.07902 19.1397 3.21967 19.2803C3.36032 19.421 3.55109 19.5 3.75 19.5H5.00625Z"
                           stroke="#262626" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M16.5 16.5H18V7.5H6V9" stroke="#262626" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                     </svg>
                     <Text color="800" component="p" size="paragraph">
                        {SettingsViewEnum.ACCOUNT}
                     </Text>
                  </div>

                  <div className={`${styles.menuItem} ${settingsView === SettingsViewEnum.CHANGE_PASSWORD && styles.active}`}
                     onClick={(): void => setSettingsView(SettingsViewEnum.CHANGE_PASSWORD)}>
                     <svg fill="none" height="24" viewBox="0 0 24 24"
                          width="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.75 5.25V18.75" stroke="#262626" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M9.75 9V12" stroke="#262626" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M6.90039 11.0723L9.75039 12.0004" stroke="#262626" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M7.9873 14.4281L9.7498 12" stroke="#262626" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M11.5125 14.4281L9.75 12" stroke="#262626" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M12.6 11.0723L9.75 12.0004" stroke="#262626" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M18.75 9V12" stroke="#262626" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M15.9004 11.0723L18.7504 12.0004" stroke="#262626" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M16.9873 14.4281L18.7498 12" stroke="#262626" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M20.5125 14.4281L18.75 12" stroke="#262626" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M21.6 11.0723L18.75 12.0004" stroke="#262626" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                     </svg>
                     <Text color="800" component="p" size="paragraph">
                        {SettingsViewEnum.CHANGE_PASSWORD}
                     </Text>
                  </div>

                  {userData.role === UserRoleEnum.STUDENT
                     && <>
                        <div className={`${styles.menuItem} ${settingsView === SettingsViewEnum.SECURITY_PRIVACY && styles.active}`}
                           onClick={(): void => setSettingsView(SettingsViewEnum.SECURITY_PRIVACY)}>
                           <svg fill="none" height="24" viewBox="0 0 24 24"
                                width="24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.75 11.25H20.25" stroke="#262626" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="1.5"/>
                              <path d="M3.75 14.25H20.25" stroke="#262626" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="1.5"/>
                              <path d="M3.75 17.25H20.25" stroke="#262626" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="1.5"/>
                              <path d="M19.5 8.25H4.5C4.08579 8.25 3.75 8.58579 3.75 9V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V9C20.25 8.58579 19.9142 8.25 19.5 8.25Z"
                                 stroke="#262626" strokeLinecap="round"
                                 strokeLinejoin="round" strokeWidth="1.5"/>
                              <path d="M8.625 8.25V4.875C8.625 3.97989 8.98058 3.12145 9.61351 2.48851C10.2465 1.85558 11.1049 1.5 12 1.5C12.8951 1.5 13.7535 1.85558 14.3865 2.48851C15.0194 3.12145 15.375 3.97989 15.375 4.875V8.25"
                                 stroke="#262626" strokeLinecap="round"
                                 strokeLinejoin="round" strokeWidth="1.5"/>
                           </svg>
                           <Text color="800" component="p" size="paragraph">
                              {SettingsViewEnum.SECURITY_PRIVACY}
                           </Text>
                        </div>

                        <div className={`${styles.menuItem} ${settingsView === SettingsViewEnum.CURRENCY && styles.active}`}
                           onClick={(): void => setSettingsView(SettingsViewEnum.CURRENCY)}>
                           <svg fill="none" height="24" viewBox="0 0 24 24"
                                width="24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5.25 12.375H12.75" stroke="#262626" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="1.5"/>
                              <path d="M17.25 19.5H5.25C6.14511 19.5 7.00355 19.1445 7.63649 18.5115C8.26942 17.8786 8.625 17.0201 8.625 16.125V7.87504C8.625 6.78102 9.0596 5.73181 9.83318 4.95822C10.6068 4.18463 11.656 3.75004 12.75 3.75004C13.292 3.74777 13.8289 3.85355 14.3296 4.0612C14.8302 4.26885 15.2844 4.5742 15.6656 4.95941"
                                 stroke="#262626" strokeLinecap="round"
                                 strokeLinejoin="round" strokeWidth="1.5"/>
                           </svg>
                           <Text color="800" component="p" size="paragraph">
                              {SettingsViewEnum.CURRENCY}
                           </Text>
                        </div>
                     </>}

               </div>
            </div>
            <div className={styles.preferences}>

               {settingsView === SettingsViewEnum.ACCOUNT
                  && <>
                     <Heading color="800" component="p" size="sm">
                        {SettingsViewEnum.ACCOUNT}
                     </Heading>

                     <Form handleFormSubmit={handleFormSubmit} initialState={accountFormInitialState}>
                        <Input disabled fullWidth label="Full Name"
                               name="fullName"
                               type="text"/>
                        <Input disabled fullWidth label="Email Address"
                               name="email"
                               type="email"/>

                        {userData.role === UserRoleEnum.INSTITUTION_REPRESENTATIVE
                           && <Input disabled fullWidth label="Organisation"
                                     name="organisation"
                                     type="text"/>}

                        <div className={styles.buttonWrapper}>
                           <Button disabled error={error}
                                   icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                              width="24"
                                              xmlns="http://www.w3.org/2000/svg">
                                      <path d="M20.25 6.75L9.75 17.25L4.5 12" stroke="white" strokeLinecap="round"
                                            strokeLinejoin="round" strokeWidth="1.5"/>
                                   </svg>}
                                   loading={loading} size="lg"
                                   success={success}
                                   type="submit"
                                   variant="primary">
                              Save Changes</Button>

                           {userData.role === UserRoleEnum.STUDENT && <Text thin color="500" component="p"
                                                                            size="paragraph"
                                                                            style={{
                                                                               textAlign: "center",
                                                                               margin: "1.2rem auto 0",
                                                                               cursor: "pointer",
                                                                               width: "fit-content"
                                                                            }}
                                                                            onClick={showDeleteAccountModal}>
                              Delete Account
                           </Text>}

                        </div>
                     </Form>
                  </>}

               {settingsView === SettingsViewEnum.CHANGE_PASSWORD
                  && <>
                     <Heading color="800" component="p" size="sm">
                        {SettingsViewEnum.CHANGE_PASSWORD}
                     </Heading>

                     <Form handleFormSubmit={handleFormSubmit} initialState={passwordFormInitialState}>
                        <Input fullWidth required label="Old Password"
                               name="oldPassword"
                               type="password"/>
                        <Input fullWidth required label="New Password"
                               name="newPassword"
                               type="password"/>
                        <Input fullWidth required label="Repeat New Password"
                               name="repeatNewPassword"
                               type="password"/>
                        <div className={styles.buttonWrapper}>
                           <Button error={error}
                                   icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                              width="24"
                                              xmlns="http://www.w3.org/2000/svg">
                                      <path d="M20.25 6.75L9.75 17.25L4.5 12" stroke="white" strokeLinecap="round"
                                            strokeLinejoin="round" strokeWidth="1.5"/>
                                   </svg>} loading={loading}
                                   size="lg"
                                   success={success}
                                   type="submit"
                                   variant="primary">
                              Save Changes</Button>
                        </div>
                     </Form>
                  </>}

               {userData.role === UserRoleEnum.STUDENT
                  && <>

                     {settingsView === SettingsViewEnum.SECURITY_PRIVACY
                        && <>
                           <Heading color="800" component="p" size="sm">
                              {SettingsViewEnum.SECURITY_PRIVACY}
                           </Heading>

                           <Form handleFormSubmit={handleFormSubmit} initialState={securityPrivacyFormInitialState}>
                              <div className={styles.checkboxWrapper}>
                                 <Checkbox disabled color="800" label="Receive news and other updates through email"
                                           name="newsAndUpdates"/>
                              </div>
                              <div className={styles.buttonWrapper}>
                                 <Button disabled error={error}
                                         icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                                    width="24"
                                                    xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.25 6.75L9.75 17.25L4.5 12" stroke="white" strokeLinecap="round"
                                                  strokeLinejoin="round" strokeWidth="1.5"/>
                                         </svg>}
                                         loading={loading} size="lg"
                                         success={success}
                                         type="submit"
                                         variant="primary">
                                    Save Changes</Button>
                              </div>
                           </Form>
                        </>}

                     {settingsView === SettingsViewEnum.CURRENCY
                        && <>
                           <Heading color="800" component="p" size="sm">
                              {SettingsViewEnum.CURRENCY}
                           </Heading>

                           <Form handleFormSubmit={handleFormSubmit} initialState={currencyFormInitialState}>
                              <div className={styles.selectWrapper}>
                                 <Select fullWidth defaultLabel="Change Currency" optionsList={
                                    Object.keys(CurrencyEnum).filter(currency => currency !== userData.currency)}
                                         selectIndex={0}
                                         selectKey="options"/>
                              </div>
                              <div className={styles.buttonWrapper}>
                                 <Button error={error} icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                                                  width="24"
                                                                  xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.25 6.75L9.75 17.25L4.5 12" stroke="white" strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth="1.5"/>
                                 </svg>} loading={loading}
                                         size="lg"
                                         success={success}
                                         type="submit"
                                         variant="primary">
                                    Save Changes</Button>
                              </div>
                           </Form>
                        </>}

                  </>}

            </div>
         </div>

         {isDeleteAccountModalShown &&
            <DeleteAccountModal handleCloseModal={(): void => setIsDeleteAccountModalShown(false)}
                                isOpen={isDeleteAccountModalShown}/>}
      </>
   )
}