import React from "react"

import { getCookie, setCookie } from "cookies-next"

import { Button, Heading, Modal, Text } from "@lib/components"

import styles from "./CookiesConsent.module.scss"

export const CookiesConsent: React.FC = (): JSX.Element => {

   const [isOpen, setIsOpen] = React.useState<boolean>(false)

   const handleAcceptCookies = (): void => {
      setCookie("qualkey", true)

      const rootCookie = getCookie("qualkey")
      if (rootCookie) {
         setIsOpen(false)
      }
   }

   React.useEffect(() => {
      const rootCookie = getCookie("qualkey")
      if (!rootCookie) {
         setIsOpen(true)
      }
   }, [])

   return (
      <Modal handleCloseModal={(): void => setIsOpen(false)} isOpen={isOpen}>
         <Heading color="blue" component="h3" size="md">
            Cookies & privacy
         </Heading>
         <Text color="800" component="p" size="paragraph"
               style={{ marginBottom: "3.6rem" }}>
            When you visit any website, it may store or retrieve information on your browser, mostly in the form of
            cookies. This information might be about you, your preferences or your device and is mostly used to make the
            site work as you expect it to.
         </Text>
         <div className={styles.item}>
            <Text color="800" component="p" size="paragraph">
               Strictly necessary cookies
            </Text>
            <Text color="500" component="p" size="paragraph">
               Always active
            </Text>
         </div>
         <div className={styles.buttons}>
            <Button loading={false} size="lg" variant="primary"
                    onClick={handleAcceptCookies}>
               Allow
            </Button>
            <Button loading={false} size="lg" variant="secondary"
                    onClick={(): void => setIsOpen(false)}>
               Reject
            </Button>
         </div>
      </Modal>
   )
}