import React from "react"

import classNames from "classnames/bind"
import Image from "next/image"
import Link from "next/link"
import { useRecoilState } from "recoil"

import logoText from "@assets/images/logo-white-text.svg"
import { isBurgerMenuOpen } from "@atoms/isBurgerMenuOpen.atom"
import { isUploadModalOpen } from "@atoms/isUploadModalOpen.atom"
import { SidebarItem } from "@components/Sidebar/SidebarItem"
import { useSidebarView } from "@hooks/useSidebarView"
import { UserRoleEnum } from "@interfaces/user.interface"
import { LayoutContext } from "@layouts/MainLayout/MainLayout"
import { Burger } from "@lib/components"

import styles from "./Sidebar.module.scss"

const cx = classNames.bind(styles)

export const Sidebar: React.FC = (): JSX.Element => {

   const layoutContext = React.useContext(LayoutContext)
   const { userData, shareId, handleLogout } = layoutContext

   const [sidebarView] = useSidebarView(userData?.role ?? UserRoleEnum.PUBLIC, shareId)
   const [isBurgerOpen, setIsBurgerOpen] = useRecoilState(isBurgerMenuOpen)
   const [, setIsUploadModalActive] = useRecoilState(isUploadModalOpen)

   const className = cx(styles.sidebar, { active: isBurgerOpen })

   /**
    * Toggle burger menu handler
    */
   const handleToggleBurger = (): void => {
      setIsBurgerOpen(prevState => !prevState)
   }

   const handleToggleUploadModal = (): void => {
      setIsUploadModalActive(prevState => !prevState)
   }

   return (
      <div className={className}>

         <div className={styles.burgerWrapper}>
            <Burger isOpen={isBurgerOpen} onClick={handleToggleBurger}/>
         </div>

         <div className={styles.logoWrapper}>
            <Link href={sidebarView ? sidebarView[0] : "/dashboard"}>
               <a>
                  <Image priority alt="Qualkey | Qualifications protected" height={104}
                         objectFit="cover"
                         src={logoText} width={147}/>
               </a>
            </Link>
         </div>
         <div className={styles.hrWrapper}>
            <hr className={styles.hr}/>
         </div>
         <div className={styles.content}>

            <div className={styles.contentTop}>

               {userData?.role !== UserRoleEnum.PUBLIC
                  ? sidebarView && <SidebarItem isLink
                                                href={sidebarView[0]}
                                                icon={
                                                   <svg fill="none" height="32" viewBox="0 0 32 32"
                                                        width="32" xmlns="http://www.w3.org/2000/svg">
                                                      <path d="M4 8V18" stroke="white" strokeLinecap="round"
                                                            strokeLinejoin="round" strokeWidth="1.5"/>
                                                      <path d="M6.77539 26.9999C7.77597 25.4653 9.14361 24.2045 10.7544 23.3317C12.3653 22.459 14.1683 22.002 16.0004 22.002C17.8324 22.002 19.6355 22.459 21.2464 23.3317C22.8572 24.2045 24.2248 25.4653 25.2254 26.9999"
                                                         stroke="white" strokeLinecap="round"
                                                         strokeLinejoin="round" strokeWidth="1.5"/>
                                                      <path d="M28 8L16 12L4 8L16 4L28 8Z" stroke="white"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round" strokeWidth="1.5"/>
                                                      <path d="M21.1625 10.2754C22.0798 11.2771 22.6859 12.5241 22.9068 13.8643C23.1277 15.2044 22.954 16.58 22.4067 17.8231C21.8595 19.0663 20.9624 20.1233 19.8248 20.8655C18.6872 21.6077 17.3583 22.0028 16 22.0028C14.6417 22.0028 13.3128 21.6077 12.1752 20.8655C11.0376 20.1233 10.1405 19.0663 9.59329 17.8231C9.04604 16.58 8.87229 15.2044 9.09322 13.8643C9.31414 12.5241 9.9202 11.2771 10.8375 10.2754"
                                                         stroke="white" strokeLinecap="round"
                                                         strokeLinejoin="round" strokeWidth="1.5"/>
                                                   </svg>}
                                                text={sidebarView[1]}/>
                  : null}

               {userData?.role === UserRoleEnum.INSTITUTION_REPRESENTATIVE && <>
                  <SidebarItem icon={
                     <svg fill="none" height="32" viewBox="0 0 32 32"
                          width="32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 28H7C6.73478 28 6.48043 27.8946 6.29289 27.7071C6.10536 27.5196 6 27.2652 6 27V5C6 4.73478 6.10536 4.48043 6.29289 4.29289C6.48043 4.10536 6.73478 4 7 4H19L26 11V27C26 27.2652 25.8946 27.5196 25.7071 27.7071C25.5196 27.8946 25.2652 28 25 28Z"
                           stroke="white" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M19 4V11H26" stroke="white" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M12.5 18.5L16 15L19.5 18.5" stroke="white" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                        <path d="M16 23V15" stroke="white" strokeLinecap="round"
                              strokeLinejoin="round" strokeWidth="1.5"/>
                     </svg>} isLink={false}
                               text="Upload"
                               onClick={handleToggleUploadModal}/>

                  <SidebarItem isLink
                               href="/analytics"
                               icon={
                                  <svg fill="none" height="32" viewBox="0 0 32 32"
                                       width="32" xmlns="http://www.w3.org/2000/svg">
                                     <path d="M28.5 26H3.5" stroke="#E5E5E5" strokeLinecap="round"
                                           strokeLinejoin="round" strokeWidth="1.5"/>
                                     <path d="M12.5 26V11H19.5" stroke="#E5E5E5" strokeLinecap="round"
                                           strokeLinejoin="round" strokeWidth="1.5"/>
                                     <path d="M26.5 5H19.5V26H26.5V5Z" stroke="#E5E5E5" strokeLinecap="round"
                                           strokeLinejoin="round" strokeWidth="1.5"/>
                                     <path d="M5.5 26V17H12.5" stroke="white" strokeLinecap="round"
                                           strokeLinejoin="round" strokeWidth="1.5"/>
                                  </svg>
                               }
                               text="Analytics"/>
               </>}

            </div>

            <div className={styles.contentBottom}>
               <div className={styles.hrWrapper}>
                  <hr className={styles.hr}/>
               </div>

               <SidebarItem isLink isSecondary href="/faq"
                            icon={
                               <svg fill="none" height="24" viewBox="0 0 24 24"
                                    width="24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                                     stroke="white" strokeLinecap="round" strokeLinejoin="round"
                                     strokeWidth="1.5"/>
                                  <path d="M12 17.8125C12.5178 17.8125 12.9375 17.3928 12.9375 16.875C12.9375 16.3572 12.5178 15.9375 12 15.9375C11.4822 15.9375 11.0625 16.3572 11.0625 16.875C11.0625 17.3928 11.4822 17.8125 12 17.8125Z"
                                     fill="white"/>
                                  <path d="M12 13.5V12.75C12.5192 12.75 13.0267 12.596 13.4584 12.3076C13.8901 12.0192 14.2265 11.6092 14.4252 11.1295C14.6239 10.6499 14.6758 10.1221 14.5746 9.61289C14.4733 9.10369 14.2233 8.63596 13.8562 8.26885C13.489 7.90173 13.0213 7.65173 12.5121 7.55044C12.0029 7.44915 11.4751 7.50114 10.9955 7.69982C10.5158 7.8985 10.1058 8.23495 9.81739 8.66663C9.52895 9.09831 9.375 9.60583 9.375 10.125"
                                     stroke="white" strokeLinecap="round" strokeLinejoin="round"
                                     strokeWidth="1.5"/>
                               </svg>}
                            text="Help & FAQ"/>

               <SidebarItem isLink isSecondary href="/contact"
                            icon={
                               <svg fill="none" height="24" viewBox="0 0 24 24"
                                    width="24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12.3751 20.25H4.47194C4.37679 20.2513 4.28236 20.2334 4.1942 20.1976C4.10605 20.1618 4.02597 20.1087 3.95869 20.0414C3.8914 19.9741 3.83828 19.894 3.80244 19.8059C3.76661 19.7177 3.7488 19.6233 3.75006 19.5281V11.625C3.75006 9.33751 4.65877 7.14371 6.27627 5.5262C7.89377 3.9087 10.0876 3 12.3751 3V3C13.5077 3 14.6293 3.22309 15.6757 3.65654C16.7221 4.08999 17.673 4.7253 18.4739 5.5262C19.2748 6.32711 19.9101 7.27792 20.3435 8.32436C20.777 9.37079 21.0001 10.4923 21.0001 11.625V11.625C21.0001 12.7577 20.777 13.8792 20.3435 14.9256C19.9101 15.9721 19.2748 16.9229 18.4739 17.7238C17.673 18.5247 16.7221 19.16 15.6757 19.5935C14.6293 20.0269 13.5077 20.25 12.3751 20.25V20.25Z"
                                     stroke="#E5E5E5" strokeLinecap="round"
                                     strokeLinejoin="round" strokeWidth="1.5"/>
                                  <path d="M12.375 12.9375C12.8928 12.9375 13.3125 12.5178 13.3125 12C13.3125 11.4822 12.8928 11.0625 12.375 11.0625C11.8572 11.0625 11.4375 11.4822 11.4375 12C11.4375 12.5178 11.8572 12.9375 12.375 12.9375Z"
                                     fill="#E5E5E5"/>
                                  <path d="M16.875 12.9375C17.3928 12.9375 17.8125 12.5178 17.8125 12C17.8125 11.4822 17.3928 11.0625 16.875 11.0625C16.3572 11.0625 15.9375 11.4822 15.9375 12C15.9375 12.5178 16.3572 12.9375 16.875 12.9375Z"
                                     fill="#E5E5E5"/>
                                  <path d="M7.875 12.9375C8.39277 12.9375 8.8125 12.5178 8.8125 12C8.8125 11.4822 8.39277 11.0625 7.875 11.0625C7.35723 11.0625 6.9375 11.4822 6.9375 12C6.9375 12.5178 7.35723 12.9375 7.875 12.9375Z"
                                     fill="#E5E5E5"/>
                               </svg>}
                            text="Contact Us"/>

               <SidebarItem isLink isSecondary href="/about"
                            icon={
                               <svg fill="none" height="24" viewBox="0 0 24 24"
                                    width="24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8.7375 11.5125C8.41238 10.7149 8.24676 9.86131 8.25 9C8.25 7.66498 8.64588 6.35994 9.38758 5.2499C10.1293 4.13987 11.1835 3.27471 12.4169 2.76382C13.6503 2.25292 15.0075 2.11925 16.3169 2.3797C17.6262 2.64015 18.829 3.28303 19.773 4.22703C20.717 5.17104 21.3599 6.37377 21.6203 7.68314C21.8808 8.99252 21.7471 10.3497 21.2362 11.5831C20.7253 12.8165 19.8601 13.8707 18.7501 14.6124C17.6401 15.3541 16.335 15.75 15 15.75C14.1387 15.7532 13.2851 15.5876 12.4875 15.2625V15.2625L11.25 16.5H9V18.75H6.75V21H3V17.25L8.7375 11.5125Z"
                                     stroke="#E5E5E5" strokeLinecap="round"
                                     strokeLinejoin="round" strokeWidth="1.5"/>
                                  <path d="M16.875 8.0625C17.3928 8.0625 17.8125 7.64277 17.8125 7.125C17.8125 6.60723 17.3928 6.1875 16.875 6.1875C16.3572 6.1875 15.9375 6.60723 15.9375 7.125C15.9375 7.64277 16.3572 8.0625 16.875 8.0625Z"
                                     fill="#E5E5E5"/>
                               </svg>}
                            text="About Us"/>

               <SidebarItem isLink isSecondary href="/policy"
                            icon={
                               <svg fill="none" height="24" viewBox="0 0 24 24"
                                    width="24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3.75 10.7531V5.25C3.75 5.05109 3.82902 4.86032 3.96967 4.71967C4.11032 4.57902 4.30109 4.5 4.5 4.5H19.5C19.6989 4.5 19.8897 4.57902 20.0303 4.71967C20.171 4.86032 20.25 5.05109 20.25 5.25V10.7531C20.25 18.6281 13.5656 21.2344 12.2344 21.675C12.0831 21.731 11.9169 21.731 11.7656 21.675C10.4344 21.2344 3.75 18.6281 3.75 10.7531Z"
                                     stroke="#E5E5E5" strokeLinecap="round"
                                     strokeLinejoin="round" strokeWidth="1.5"/>
                                  <path d="M12 9V12.75" stroke="#E5E5E5" strokeLinecap="round"
                                        strokeLinejoin="round" strokeWidth="1.5"/>
                                  <path d="M12 17.0625C12.5178 17.0625 12.9375 16.6428 12.9375 16.125C12.9375 15.6072 12.5178 15.1875 12 15.1875C11.4822 15.1875 11.0625 15.6072 11.0625 16.125C11.0625 16.6428 11.4822 17.0625 12 17.0625Z"
                                     fill="#E5E5E5"/>
                               </svg>}
                            text="Privacy Policy"/>

               {userData?.role === UserRoleEnum.STUDENT || userData?.role == UserRoleEnum.INSTITUTION_REPRESENTATIVE
                  ?
                  <SidebarItem isSecondary icon={<svg fill="none" height="24" viewBox="0 0 24 24"
                                                      width="24" xmlns="http://www.w3.org/2000/svg">
                     <path d="M7.6875 15.9375L3.75 12L7.6875 8.0625" stroke="white" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                     <path d="M14.25 12L3.75 12" stroke="white" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                     <path d="M14.25 3.75H19.5C19.6989 3.75 19.8897 3.82902 20.0303 3.96967C20.171 4.11032 20.25 4.30109 20.25 4.5L20.25 19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0303C19.8897 20.171 19.6989 20.25 19.5 20.25H14.25"
                        stroke="white" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="1.5"/>
                  </svg>}
                               isLink={false} text="Logout"
                               onClick={handleLogout}/>
                  : <SidebarItem isLink isSecondary
                                 href="/login"
                                 icon={<svg fill="none" height="24" viewBox="0 0 25 24"
                                            width="25" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.8125 8.0625L20.75 12L16.8125 15.9375" stroke="white"
                                          strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth="1.5"/>
                                    <path d="M10.25 12L20.75 12" stroke="white" strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth="1.5"/>
                                    <path d="M10.25 20.25H5C4.80109 20.25 4.61032 20.171 4.46967 20.0303C4.32902 19.8897 4.25 19.6989 4.25 19.5L4.25 4.5C4.25 4.30109 4.32902 4.11032 4.46967 3.96967C4.61032 3.82902 4.80109 3.75 5 3.75L10.25 3.75"
                                       stroke="white" strokeLinecap="round"
                                       strokeLinejoin="round" strokeWidth="1.5"/>
                                 </svg>}
                                 text="Login"/>}

            </div>

         </div>
      </div>
   )
}