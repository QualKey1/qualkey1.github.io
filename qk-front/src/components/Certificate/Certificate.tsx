import React from "react"

import Image from "next/image"
import QRCode from "react-qr-code"

import logoText from "@assets/images/logo-blue-text.svg"
import { colorBlack300, colorBrandBlue24 } from "@constants/styles"
import { CertificateType } from "@customTypes/components"
import { useGetTransactionId } from "@hooks/useGetTransactionId"
import { Heading, Text } from "@lib/components"
import { formatDate } from "@utils/formatDate"
import { getDragonGlassLink } from "@utils/getDragonGlassLink"
import { transformToAwsUrl } from "@utils/transformToAwsUrl"

import styles from "./Certificate.module.scss"


export const Certificate: React.FC<CertificateType> = ({ data, showQR }): JSX.Element => {

   const hederaData = useGetTransactionId("credentialChanges" in data ? data.credentialChanges : undefined)

   return (
      <div className={styles.wrapper}>
         <div className={styles.top}>
            <div className={styles.imageWrapper}>

               {"institution" in data &&
                  <Image unoptimized alt={data?.institution.name ?? "University"} layout="fill"
                         objectFit="contain"
                         src={transformToAwsUrl(data?.institution.logoUrl ?? "")}/>}

               {"institutionLogoUrl" in data &&
                  <Image unoptimized alt={data?.awardingInstitution ?? "University"} layout="fill"
                         objectFit="contain"
                         src={transformToAwsUrl(data.institutionLogoUrl ?? "")}/>}

            </div>
            <div className={styles.qr}>

               {(showQR && "credentialChanges" in data) &&
                  <QRCode size={90} value={getDragonGlassLink(hederaData && hederaData.transactionId)}/>}
               {(showQR && "transactionId" in data) && <QRCode size={90}
                                                               value={getDragonGlassLink(data.transactionId && data.transactionId.replace(/[^a-zA-Z0-9]/g, ""))}/>}
               
               {!showQR && <div style={{ backgroundColor: colorBlack300, width: "100%", height: "100%" }}></div>}

            </div>
         </div>
         <div className={styles.content}>
            <div>
               <div className={styles.item}>
                  <Text thin color="500" component="p"
                        size="paragraph"
                        style={{ textTransform: "uppercase" }}>
                     This is to certify that
                  </Text>
                  <Heading color="800" component="p" size="sm">
                     {data.graduatedName}
                  </Heading>
               </div>
               <div className={styles.item}>
                  <Text thin color="500" component="p"
                        size="paragraph"
                        style={{ textTransform: "uppercase" }}>
                     Was awarded the qualification of
                  </Text>
                  <Heading color="800" component="p" size="sm"
                           style={{ maxWidth: "20ch" }}>
                     {data.qualificationName}
                  </Heading>
               </div>
               <div className={styles.item}>
                  <Text thin color="500" component="p"
                        size="paragraph"
                        style={{ textTransform: "uppercase" }}>
                     Graduation date
                  </Text>
                  <Heading color="800" component="p" size="sm">
                     {formatDate("MMMM Do, YYYY", data.graduatedAt)}
                  </Heading>
               </div>
            </div>
            <div style={{ justifySelf: "end" }}>

               {"institution" in data && <div className={styles.item}>
                  {data.institution.representatives[0].signatureUrl &&
                     <Image unoptimized alt={data.institution.representatives[0].fullName} height={80}
                            objectFit="contain"
                            quality={100}
                            src={transformToAwsUrl(data.institution.representatives[0].signatureUrl ?? "")}
                            width={100}/>}
                  <Text color="800" component="p" size="paragraph">
                     {data.institution.representatives[0].title}
                  </Text>
                  <Text color="800" component="p" size="paragraph">
                     {data.institution.representatives[0].fullName}
                  </Text>
               </div>}

               {"authenticatedBySignatureUrl" in data && <div className={styles.item}>
                  {data.authenticatedBySignatureUrl &&
                     <Image unoptimized alt={data.authenticatedBy} height={80}
                            objectFit="contain"
                            quality={100}
                            src={transformToAwsUrl(data.authenticatedBySignatureUrl ?? "")}
                            width={100}/>}
                  <Text color="800" component="p" size="paragraph">
                     {data.authenticatedTitle}
                  </Text>
                  <Text color="800" component="p" size="paragraph">
                     {data.authenticatedBy}
                  </Text>
               </div>}

            </div>
         </div>
         <div className={styles.bottom}>

            {"institution" in data && <div className={styles.bottomImages}>
               <Image unoptimized alt={data.institution.name} height={70}
                      objectFit="contain"
                      quality={100} src={transformToAwsUrl(data.institution.stampUrl ?? "")} width={90}/>
               <Image unoptimized alt="Qualkey | Qualifications protected" height={53}
                      objectFit="contain"
                      quality={100} src={logoText} width={78}/>
            </div>}

            {"institutionStampUrl" in data && <div className={styles.bottomImages}>
               <Image unoptimized alt={data.awardingInstitution} height={70}
                      objectFit="contain"
                      quality={100} src={transformToAwsUrl(data.institutionStampUrl ?? "")} width={90}/>
               <Image unoptimized alt="Qualkey | Qualifications protected" height={53}
                      objectFit="contain"
                      quality={100} src={logoText} width={78}/>
            </div>}

            <Text thin color="500" component="p"
                  size="label"
                  style={{ maxWidth: "45ch" }}>
               This certificate has been generated by <span style={{ color: colorBrandBlue24 }}>QualKey</span> using the
               authenticated credentials of the issuing
               Academic institution. This is not the original certificate issued by the Academic institution.
            </Text>
         </div>
      </div>

   )
}