import React from "react"

import Image from "next/image"
import Link from "next/link"

import logoText from "@assets/images/logo-white-text.svg"
import { Heading, Text } from "@lib/components"

import type { IndexLayoutType } from "@customTypes/layouts"

import styles from "./IndexLayout.module.scss"

export const IndexLayout: React.FC<IndexLayoutType> = ({ header, subheader, children }): JSX.Element => {
   return (
      <div className={styles.wrapper}>

         <div className={styles.layout}>

            <div className={styles.content}>
               <div className={styles.content__wrapper}>
                  {header && <Heading color="blue" component="h2" size="lg"
                                      style={{
                                         marginBottom:
                                            !subheader
                                               ? "3.6rem"
                                               : "1rem"
                                      }}>{header}</Heading>}
                  {subheader && <Text thin color="500" component="p"
                                      size="paragraph"
                                      style={{ marginBottom: "2.4rem" }}>{subheader}</Text>}
                  {children}
                  <div className="auth__terms">
                     <Text thin color="400" component="p"
                           size="label">
                        Copyright © 2021 <span>QualKey</span> Limited All rights reserved.
                     </Text>
                     <Link passHref href="/policy">
                        <Text underline color="400"
                              component="a" size="label">
                           Terms & Conditions
                        </Text>
                     </Link>
                  </div>
               </div>
            </div>
            <div className={styles.logo}>
               <Image priority alt="Qualkey | Qualifications protected" height={272}
                      objectFit="contain" quality={100}
                      src={logoText} width={395}/>
               <Heading color="000" component="h1" size="md">
                  Quickly, easily and securely authenticate your credentials
               </Heading>

            </div>

         </div>
      </div>
   )
}