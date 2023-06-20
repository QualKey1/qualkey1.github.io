import React from "react"

import { Button, Form, Heading, Input, Select, Text, Textarea } from "@lib/components"

import type { MessageFormType } from "@customTypes/components"

import styles from "./MessageForm.module.scss"

export const MessageForm: React.FC<MessageFormType> = ({
   handleFormSubmit,
   isFeedback,
   isCredentialShare,
   formInitialState,
   selectOptions,
   selectLabel,
   error,
   loading,
   success
}): JSX.Element => {

   return (
      <div className={styles.message}>

         <div className={styles.contact}>
            <Heading color="800" component="p" size="sm">
               Contact Information
            </Heading>
            <div className={styles.info}>

               {!isCredentialShare && <div className={styles.infoItem}>
                  <a href="mailto:info@qualkey.org">
                     <svg fill="none" height="48" viewBox="0 0 48 48"
                          width="48" xmlns="http://www.w3.org/2000/svg">
                        <rect fill="#0880CE" height="48" rx="24"
                              width="48"/>
                        <path d="M11.5 15H35.5V32C35.5 32.2652 35.3946 32.5196 35.2071 32.7071C35.0196 32.8946 34.7652 33 34.5 33H12.5C12.2348 33 11.9804 32.8946 11.7929 32.7071C11.6054 32.5196 11.5 32.2652 11.5 32V15Z"
                           stroke="white" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="2"/>
                        <path d="M35.5 15L23.5 26L11.5 15" stroke="white" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="2"/>
                     </svg>
                     <Text color="800" component="p" size="paragraph">
                        info@qualkey.org
                     </Text>
                  </a>
               </div>}

               <div className={styles.infoItem}>
                  <a href="https://twitter.com/qualkey" rel="noreferrer" target="_blank">
                     <svg fill="none" height="48" viewBox="0 0 48 48"
                          width="48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 0C10.7464 0 0 10.7464 0 24C0 37.2536 10.7464 48 24 48C37.2536 48 48 37.2536 48 24C48 10.7464 37.2536 0 24 0ZM35.5339 18.0911C35.55 18.3429 35.55 18.6054 35.55 18.8625C35.55 26.7268 29.5607 35.7857 18.6161 35.7857C15.2411 35.7857 12.1125 34.8054 9.47679 33.1179C9.95893 33.1714 10.4196 33.1929 10.9125 33.1929C13.6982 33.1929 16.2589 32.25 18.3 30.6536C15.6857 30.6 13.4893 28.8857 12.7393 26.5286C13.6554 26.6625 14.4804 26.6625 15.4232 26.4214C14.0771 26.1479 12.8672 25.4169 11.999 24.3524C11.1308 23.2879 10.658 21.9557 10.6607 20.5821V20.5071C11.4482 20.9518 12.375 21.225 13.3446 21.2625C12.5295 20.7193 11.861 19.9833 11.3985 19.1198C10.9359 18.2563 10.6935 17.2921 10.6929 16.3125C10.6929 15.2036 10.9821 14.1911 11.5018 13.3125C12.9959 15.1518 14.8603 16.6561 16.9739 17.7277C19.0875 18.7992 21.4029 19.414 23.7696 19.5321C22.9286 15.4875 25.95 12.2143 29.5821 12.2143C31.2964 12.2143 32.8393 12.9321 33.9268 14.0893C35.2714 13.8375 36.5571 13.3339 37.7036 12.6589C37.2589 14.0357 36.3268 15.1982 35.0893 15.9321C36.2893 15.8036 37.4464 15.4714 38.5179 15.0054C37.7089 16.1946 36.6964 17.25 35.5339 18.0911Z"
                           fill="#0880CE"/>
                     </svg>
                     <Text color="800" component="p" size="paragraph">
                        @Qualkey
                     </Text>
                  </a>
               </div>
               <div className={styles.infoItem}>
                  <a href="https://www.linkedin.com/company/qualkey/" rel="noreferrer" target="_blank">
                     <svg fill="none" height="48" viewBox="0 0 48 48"
                          width="48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 0C10.745 0 0 10.745 0 24C0 37.255 10.745 48 24 48C37.255 48 48 37.255 48 24C48 10.745 37.255 0 24 0ZM18.125 33.9475H13.265V18.3075H18.125V33.9475ZM15.665 16.3875C14.13 16.3875 13.1375 15.3 13.1375 13.955C13.1375 12.5825 14.16 11.5275 15.7275 11.5275C17.295 11.5275 18.255 12.5825 18.285 13.955C18.285 15.3 17.295 16.3875 15.665 16.3875ZM35.875 33.9475H31.015V25.28C31.015 23.2625 30.31 21.8925 28.5525 21.8925C27.21 21.8925 26.4125 22.82 26.06 23.7125C25.93 24.03 25.8975 24.48 25.8975 24.9275V33.945H21.035V23.295C21.035 21.3425 20.9725 19.71 20.9075 18.305H25.13L25.3525 20.4775H25.45C26.09 19.4575 27.6575 17.9525 30.28 17.9525C33.4775 17.9525 35.875 20.095 35.875 24.7V33.9475Z"
                           fill="#0880CE"/>
                     </svg>
                     <Text color="800" component="p" size="paragraph">
                        Qualkey
                     </Text>
                  </a>
               </div>
            </div>
         </div>

         <div className={styles.send}>
            <Heading color="800" component="p" size="sm">

               {!isFeedback && "Send us an email message"}
               {isFeedback && "Send us your feedback"}

            </Heading>
            <Form handleFormSubmit={handleFormSubmit} initialState={formInitialState}>

               {isCredentialShare && <>
                  <Input fullWidth required label="Your email"
                         name="email"
                         type="email"/>
                  <Input fullWidth required label="Your name"
                         name="name"
                         type="text"/>
               </>}

               {!isFeedback && selectOptions && selectLabel ? <div className={styles.wrapper}>
                  <Select fullWidth defaultLabel={selectLabel} optionsList={selectOptions}
                          selectIndex={0} selectKey="options"/>
               </div> : null}
               {isFeedback &&
                  <Text thin color="500" component="p"
                        size="paragraph">Your feedback is incredibly important to us as it
                     helps improve service and your experience.</Text>}

               <Textarea fullWidth name="message" placeholder="Start typing your message here..."/>
               <Button error={error} icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                                width="24"
                                                xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.7147 3.36572L2.23971 8.28759C2.09095 8.32826 1.95835 8.4138 1.85996 8.53255C1.76157 8.65131 1.70219 8.79751 1.68989 8.95123C1.67759 9.10496 1.71298 9.25873 1.79124 9.39162C1.86949 9.52451 1.98681 9.63004 2.12721 9.69384L10.1522 13.4907C10.3094 13.5635 10.4357 13.6898 10.5085 13.847L14.3053 21.872C14.3691 22.0124 14.4747 22.1297 14.6076 22.2079C14.7404 22.2862 14.8942 22.3216 15.0479 22.3093C15.2017 22.297 15.3479 22.2376 15.4666 22.1392C15.5854 22.0408 15.6709 21.9082 15.7116 21.7595L20.6335 4.28447C20.6708 4.15695 20.6731 4.02174 20.6401 3.89302C20.6072 3.7643 20.5403 3.64681 20.4463 3.55286C20.3524 3.45891 20.2349 3.39197 20.1062 3.35904C19.9774 3.32611 19.8422 3.32842 19.7147 3.36572V3.36572Z"
                     stroke="white" strokeLinecap="round" strokeLinejoin="round"
                     strokeWidth="1.5"/>
                  <path d="M10.3965 13.6027L14.634 9.36523" stroke="white" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
               </svg>} loading={loading}
                       size="lg"
                       success={success}
                       type="submit"
                       variant="primary">
                  Send Message</Button>
            </Form>
         </div>

      </div>
   )
}