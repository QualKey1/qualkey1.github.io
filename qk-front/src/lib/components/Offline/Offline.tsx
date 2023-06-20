import React from "react"

import Image from "next/image"
import { useRouter } from "next/router"

import logoText from "@assets/images/logo-white-text.svg"
import { Button, Text } from "@lib/components"

import styles from "./Offline.module.scss"

export const Offline: React.FC = (): JSX.Element => {

   const router = useRouter()

   const handleReloadPage = (): void => {
      router.reload()
   }

   return (
      <div className={styles.offline}>
         <Image alt="Qualkey | Qualifications protected" height={94} objectFit="contain"
                src={logoText}
                width={182}/>
         <Text color="000" component="p" size="paragraph"
               style={{ marginTop: "1.2rem" }}>
            No internet connection.
         </Text>
         <Button loading={false} size="lg" variant="danger"
                 onClick={handleReloadPage}>
            Try again
         </Button>
      </div>
   )
}