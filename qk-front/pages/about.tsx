import React from "react"

import axios from "axios"
import { getCookie } from "cookies-next"
import dynamic from "next/dynamic"
import Head from "next/head"
import Image from "next/image"

import about from "@assets/images/aboutImage.png"
import hans from "@assets/images/Hans-Winkler.jpeg"
import phil from "@assets/images/Phil-Whetstone.jpeg"
import { apiUrl } from "@constants/urls"
import { Button, Heading, Loading, Text } from "@lib/components"

import type { MainLayoutType } from "@customTypes/layouts"
import type { PublicPageType } from "@customTypes/pages"
import type { GetServerSideProps, NextPage } from "next"

const MainLayout = dynamic<MainLayoutType>(() => import("@layouts/MainLayout/MainLayout")
   .then(module => module.MainLayout), { loading: () => <Loading isOpen={true}/> })

const AboutUs: NextPage<PublicPageType> = ({ userData, actionData, shareId }): JSX.Element => {

   const [readMore, setReadMore] = React.useState<boolean>(false)

   /**
    * Read more handler
    */
   const handleToggleReadMore = (): void => {
      setReadMore(prevState => !prevState)
   }

   return (
      <>
         <Head>
            <title>About Us | QualKey</title>
         </Head>

         <MainLayout actionData={actionData} shareId={shareId} userData={userData}>
            <Heading color="blue" component="h1" size="lg">
               About Us
            </Heading>

            <div className="about">

               {!readMore && <>
                  <Image alt="Qualkey | Qualifications protected" height={264} quality={100}
                         src={about}
                         width={1012}/>
                  <div className="about__content">
                     <div className="about__left">
                        <div className="about__wrapper">
                           <div className="about__left--item">
                              <Image alt="Hans Winkler" className="about__left--image" height={124}
                                     src={hans} width={124}/>
                              <Heading color="800" component="p" size="sm">
                                 Hans Winkler
                              </Heading>
                              <Text color="400" component="p" size="paragraph">
                                 Co-founder
                              </Text>
                              <a href="https://www.linkedin.com/in/winklerhans/" rel="noreferrer" target="_blank">
                                 <svg fill="none" height="48" viewBox="0 0 49 48"
                                      width="49" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24.5 0C11.245 0 0.5 10.745 0.5 24C0.5 37.255 11.245 48 24.5 48C37.755 48 48.5 37.255 48.5 24C48.5 10.745 37.755 0 24.5 0ZM18.625 33.9475H13.765V18.3075H18.625V33.9475ZM16.165 16.3875C14.63 16.3875 13.6375 15.3 13.6375 13.955C13.6375 12.5825 14.66 11.5275 16.2275 11.5275C17.795 11.5275 18.755 12.5825 18.785 13.955C18.785 15.3 17.795 16.3875 16.165 16.3875ZM36.375 33.9475H31.515V25.28C31.515 23.2625 30.81 21.8925 29.0525 21.8925C27.71 21.8925 26.9125 22.82 26.56 23.7125C26.43 24.03 26.3975 24.48 26.3975 24.9275V33.945H21.535V23.295C21.535 21.3425 21.4725 19.71 21.4075 18.305H25.63L25.8525 20.4775H25.95C26.59 19.4575 28.1575 17.9525 30.78 17.9525C33.9775 17.9525 36.375 20.095 36.375 24.7V33.9475Z"
                                       fill="#0880CE"/>
                                 </svg>
                              </a>
                           </div>
                           <div className="about__left--item">
                              <Image alt="Philip Whetstone" className="about__left--image" height={124}
                                     src={phil} width={124}/>
                              <Heading color="800" component="p" size="sm">
                                 Philip Whetstone
                              </Heading>
                              <Text color="400" component="p" size="paragraph">
                                 Co-founder
                              </Text>
                              <a href="https://www.linkedin.com/in/philwhetstone/" rel="noreferrer" target="_blank">
                                 <svg fill="none" height="48" viewBox="0 0 49 48"
                                      width="49" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24.5 0C11.245 0 0.5 10.745 0.5 24C0.5 37.255 11.245 48 24.5 48C37.755 48 48.5 37.255 48.5 24C48.5 10.745 37.755 0 24.5 0ZM18.625 33.9475H13.765V18.3075H18.625V33.9475ZM16.165 16.3875C14.63 16.3875 13.6375 15.3 13.6375 13.955C13.6375 12.5825 14.66 11.5275 16.2275 11.5275C17.795 11.5275 18.755 12.5825 18.785 13.955C18.785 15.3 17.795 16.3875 16.165 16.3875ZM36.375 33.9475H31.515V25.28C31.515 23.2625 30.81 21.8925 29.0525 21.8925C27.71 21.8925 26.9125 22.82 26.56 23.7125C26.43 24.03 26.3975 24.48 26.3975 24.9275V33.945H21.535V23.295C21.535 21.3425 21.4725 19.71 21.4075 18.305H25.63L25.8525 20.4775H25.95C26.59 19.4575 28.1575 17.9525 30.78 17.9525C33.9775 17.9525 36.375 20.095 36.375 24.7V33.9475Z"
                                       fill="#0880CE"/>
                                 </svg>
                              </a>
                           </div>
                        </div>
                     </div>
                     <div className="about__right">
                        <Text thin color="800" component="p"
                              size="paragraph">
                           After meeting whilst studying for their MBA, Hans and Phil are on a mission to make it easier
                           for people to prove their qualifications are genuine.
                           <br/>
                           We want to create a standard in education where individuals have full autonomy of their data
                           and
                           their privacy guaranteed.
                        </Text>
                        <Button center icon={<svg fill="none" height="12" viewBox="0 0 24 12"
                                                  width="24" xmlns="http://www.w3.org/2000/svg">
                           <path d="M23.5885 2.36948L12.972 11.2701C12.6165 11.5326 12.2831 11.6395 11.9998 11.6395C11.7165 11.6395 11.3348 11.5316 11.0782 11.3144L0.411623 2.36948C-0.121481 1.92713 -0.138814 1.1445 0.371624 0.721588C0.878562 0.253712 1.72605 0.238498 2.25549 0.686653L11.9998 8.85899L21.7441 0.692423C22.2719 0.244282 23.1208 0.259498 23.628 0.727359C24.1385 1.1445 24.1219 1.92713 23.5885 2.36948Z"
                              fill="white"/>
                        </svg>} loading={false}
                                size="lg"
                                variant="primary"
                                onClick={handleToggleReadMore}>
                           Read More</Button>
                     </div>
                  </div>
               </>}

               {readMore && <>
                  <div className="readmore__top">
                     <Image alt="Hans Winkler" className="about__left--image" height={124}
                            src={hans} width={124}/>
                     <Image alt="Philip Whetstone" className="about__left--image" height={124}
                            src={phil} width={124}/>
                  </div>
                  <Heading color="800" component="p" size="sm">
                     Our story
                  </Heading>
                  <Text thin color="800" component="p"
                        size="paragraph">
                     QualKey was founded by Hans and Phil, two friends who met whilst studying.
                     They discovered that when applying for jobs or continuance of study,
                     employers and educational institutions wanted candidates to prove their
                     qualification was genuine, often needing to see the original certificate as
                     emailed PDFs could be easily forged.
                     <br/>
                     Hans and Phil found the process of verifying a qualification was stressful, time consuming and
                     inefficient for all parties involved. Sometimes people had to wait weeks and months for their
                     certificates. Verifying authenticity involved manual workflows, multiple emails, calls and
                     unanswered messages. Surely in the 21 st century, there must be an easier way to prove a
                     qualification is authentic.
                     <br/>
                     The result, QualKey was born.
                     QualKey improves the speed, ease, and security in how qualifications are authenticated with
                     employers,
                     educational institutions and other third parties. QualKey provides digital credentials for your
                     qualification
                     that be shared instantly. We create a standard in education where individuals have full autonomy
                     of their data and their privacy guaranteed. It’s your qualification, so you should be in control of
                     what information you share, with whom, and how often.
                     Hans and Phil are on a mission. In addition to making the process of qualification authentication
                     painless
                     and efficient, we aim to eliminate all fake qualifications in the world by 2030. If you see a
                     qualification
                     that carries the QualKey stamp of approval, you can trust its authenticity.
                  </Text>
                  <Button center icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                            width="24" xmlns="http://www.w3.org/2000/svg">
                     <path d="M0.411457 15.6305L11.028 6.72993C11.3835 6.46743 11.7169 6.36049 12.0002 6.36049C12.2835 6.36049 12.6652 6.46836 12.9218 6.6856L23.5884 15.6305C24.1215 16.0729 24.1388 16.8555 23.6284 17.2784C23.1214 17.7463 22.2739 17.7615 21.7445 17.3133L12.0002 9.14101L2.25588 17.3076C1.72811 17.7557 0.879229 17.7405 0.372013 17.2726C-0.138536 16.8555 -0.12187 16.0729 0.411457 15.6305Z"
                        fill="white"/>
                  </svg>} loading={false}
                          size="lg"
                          variant="primary"
                          onClick={handleToggleReadMore}>
                     Go back</Button>
               </>}

            </div>
         </MainLayout>
      </>
   )
}

export default AboutUs

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const { req, res } = ctx

   res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
   )

   const shareId = getCookie("credentialShare", ctx)

   if (shareId) {
      return {
         props:
            { userData: { role: "SHARED" }, shareId }
      }
   }

   try {
      const userResponse = await axios.get(`${apiUrl}/user/me`, {
         withCredentials: true,
         headers: { Cookie: req.headers.cookie || "" }
      })
      const { data: userData } = userResponse

      const actionResponse = await axios.get(`${apiUrl}/action`, {
         withCredentials: true,
         headers: { Cookie: req.headers.cookie || "" }
      })
      const { data: actionData } = actionResponse

      return { props: { userData, actionData } }

   } catch (err) {
      if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
         return { props: { serverErrorMessage: "Network error, connection refused" } }
      }
      if (err.response.status === 401) {
         return { props: { userData: { role: "PUBLIC" } } }
      }
      return { props: {} }
   }
}