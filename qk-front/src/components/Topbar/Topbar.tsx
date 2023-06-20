import React from "react"

import classNames from "classnames/bind"
import { getCookie } from "cookies-next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useRecoilState } from "recoil"

import avatar from "@assets/images/avatar-placeholder.png"
import { isBurgerMenuOpen } from "@atoms/isBurgerMenuOpen.atom"
import { Notifications } from "@components/Notifications/Notifications"
import { TopbarMenu } from "@components/Topbar/TopbarMenu"
import { useUrlTitle } from "@hooks/useUrlTitle"
import { UserRoleEnum } from "@interfaces/user.interface"
import { LayoutContext } from "@layouts/MainLayout/MainLayout"
import { Burger, Text } from "@lib/components"
import { formatFullname } from "@utils/formatFullname"
import { transformToAwsUrl } from "@utils/transformToAwsUrl"

import styles from "./Topbar.module.scss"

const cx = classNames.bind(styles)

export const Topbar: React.FC = (): JSX.Element => {

   const layoutContext = React.useContext(LayoutContext)
   const { userData, actionData, shareId } = layoutContext

   const { pathname } = useRouter()
   const [currentUrlTitle] = useUrlTitle(pathname)

   const [isBurgerOpen, setIsBurgerOpen] = useRecoilState(isBurgerMenuOpen)

   const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false)
   const [isNotificationsOpen, setIsNotificationsOpen] = React.useState<boolean>(false)

   const classNameToggleMenuIcon = cx(styles.menuIcon, { active: isMenuOpen })

   const isPublicShare = getCookie("publicShare")

   /**
    * Toggle menu handler
    */
   const handleToggleMenu = (): void => {
      setIsMenuOpen(prevState => !prevState)
   }

   /**
    * Toggle burger menu handler
    */
   const handleToggleBurger = (): void => {
      setIsBurgerOpen(prevState => !prevState)
   }

   /**
    * Toggle notifications handler
    */
   const handleToggleNotifications = (): void => {
      setIsNotificationsOpen(prevState => !prevState)
   }

   /**
    * Remove burger menu active state on mount handler
    */
   React.useEffect(() => {
      return () => {
         setIsBurgerOpen(false)
      }
   }, [setIsBurgerOpen])

   return (
      <div className={styles.topbar}>
         <div className={styles.history}>

            {userData?.role !== UserRoleEnum.PUBLIC
            && userData?.role !== UserRoleEnum.SHARED
            && pathname !== "/dashboard"
            && currentUrlTitle
               ? <>
                  <Link passHref href="/dashboard">
                     <Text thin underline color="400"
                           component="a"
                           size="paragraph">
                        Dashboard
                     </Text>
                  </Link>
                  <svg fill="none" height="17" viewBox="0 0 10 17"
                       width="10" xmlns="http://www.w3.org/2000/svg">
                     <path d="M0 14.3998L6 8.3998L0 2.3998L1.2 -0.000196457L9.6 8.3998L1.2 16.7998L0 14.3998Z"
                           fill="#262626"/>
                  </svg>
                  <Text color="800" component="p"
                        size="paragraph">
                     {currentUrlTitle[0]}
                  </Text>
               </>
               : null}

            {userData?.role == UserRoleEnum.SHARED
            && !pathname.includes("/share/")
            && currentUrlTitle
               ? <>
                  <Link passHref href={!isPublicShare ? `/share/${shareId}` : `/${shareId}`}>
                     <Text thin underline color="400"
                           component="a"
                           size="paragraph">
                        Shared Credentials
                     </Text>
                  </Link>
                  <svg fill="none" height="17" viewBox="0 0 10 17"
                       width="10" xmlns="http://www.w3.org/2000/svg">
                     <path d="M0 14.3998L6 8.3998L0 2.3998L1.2 -0.000196457L9.6 8.3998L1.2 16.7998L0 14.3998Z"
                           fill="#262626"/>
                  </svg>
                  <Text color="800" component="p"
                        size="paragraph">
                     {currentUrlTitle[0]}
                  </Text>
               </>
               : null}

         </div>

         <Burger isOpen={isBurgerOpen} onClick={handleToggleBurger}/>

         {userData?.role !== UserRoleEnum.PUBLIC && userData?.role !== UserRoleEnum.SHARED ?
            <div className={styles.profile}>
               <div className={styles.profile__wrapper}>

                  {userData?.role === UserRoleEnum.INSTITUTION_REPRESENTATIVE && <div className={styles.bell__wrapper}>
                     <div className={styles.bell} onClick={handleToggleNotifications}>
                        <svg fill="none" height="27" viewBox="0 0 24 27"
                             width="24"
                             xmlns="http://www.w3.org/2000/svg">
                           <path d="M3.02538 10.0001C3.02372 8.81461 3.25662 7.64047 3.71067 6.54534C4.16472 5.45021 4.83094 4.45573 5.67098 3.61918C6.51102 2.78263 7.50826 2.12054 8.60527 1.67105C9.70228 1.22156 10.8774 0.993543 12.0629 1.00014C17.0129 1.03764 20.9754 5.15014 20.9754 10.1126V11.0001C20.9754 15.4751 21.9129 18.0751 22.7379 19.5001C22.8255 19.6519 22.8717 19.824 22.8719 19.9993C22.872 20.1745 22.8261 20.3467 22.7388 20.4986C22.6514 20.6505 22.5257 20.7768 22.3742 20.8648C22.2226 20.9529 22.0506 20.9995 21.8754 21.0001H2.12538C1.95015 20.9995 1.77815 20.9529 1.62662 20.8648C1.47509 20.7768 1.34935 20.6505 1.262 20.4986C1.17465 20.3467 1.12875 20.1745 1.12891 19.9993C1.12906 19.824 1.17526 19.6519 1.26288 19.5001C2.08788 18.0751 3.02538 15.4751 3.02538 11.0001V10.0001Z"
                                 stroke="#737373" strokeLinecap="round"
                                 strokeLinejoin="round" strokeWidth="1.5"/>
                           <path d="M8 21V22C8 23.0609 8.42143 24.0783 9.17157 24.8284C9.92172 25.5786 10.9391 26 12 26C13.0609 26 14.0783 25.5786 14.8284 24.8284C15.5786 24.0783 16 23.0609 16 22V21"
                                 stroke="#737373" strokeLinecap="round"
                                 strokeLinejoin="round" strokeWidth="1.5"/>
                        </svg>

                        {actionData && actionData.length ? <Text color="000" component="p" size="label">
                           {actionData.length > 9
                              ? "9"
                              : actionData.length}
                        </Text> : null}
                     </div>

                     {isNotificationsOpen && <Notifications/>}

                  </div>}

                  {userData?.institution?.logoUrl && <div className={styles.uniLogo}>
                     <div className={styles.uniLogo__wrapper}>
                        <Image unoptimized alt={userData?.institution.name ?? "University"} layout="fill"
                               objectFit="contain"
                               src={transformToAwsUrl(userData?.institution.logoUrl)}/>
                     </div>
                  </div>}
               </div>

               <div className={styles.avatar} onClick={handleToggleMenu}>
                  <Image alt={userData?.fullName ?? "Student"} className={styles.avatar__image} height={48}
                         objectFit="contain" src={avatar}
                         width={48}/>
                  <Text bold color="800" component="p"
                        size="paragraph">
                     {formatFullname(userData?.fullName)}
                  </Text>
                  <svg className={classNameToggleMenuIcon} fill="none" height="10"
                       viewBox="0 0 17 10"
                       width="17" xmlns="http://www.w3.org/2000/svg">
                     <path d="M2.4 0L8.4 6L14.4 0L16.8 1.2L8.4 9.6L0 1.2L2.4 0Z" fill="#737373"/>
                  </svg>

                  {isMenuOpen && <TopbarMenu/>}

               </div>
            </div> : null}

      </div>
   )
}