import React from "react"

import { TopbarItem } from "@components/Topbar/TopbarItem"
import { LayoutContext } from "@layouts/MainLayout/MainLayout"

import styles from "./TopbarMenu.module.scss"

export const TopbarMenu: React.FC = (): JSX.Element => {

   const layoutContext = React.useContext(LayoutContext)
   const { handleLogout } = layoutContext
   
   return (
      <div className={styles.menu}>
         <TopbarItem isLink href="/dashboard"
                     icon={
                        <svg fill="none" height="24" viewBox="0 0 24 24"
                             width="24" xmlns="http://www.w3.org/2000/svg">
                           <path d="M1.6875 9.25L12 3.75L22.3125 9.25L12 14.75L1.6875 9.25Z" stroke="#262626"
                                 strokeLinecap="round"
                                 strokeLinejoin="round" strokeWidth="1.5"/>
                           <path d="M17.1562 21.625V12L12 9.25" stroke="#262626" strokeLinecap="round"
                                 strokeLinejoin="round" strokeWidth="1.5"/>
                           <path d="M19.9062 10.5301V15.2223C19.9056 15.3683 19.8574 15.5101 19.7687 15.6262C19.193 16.3996 16.7523 19.2184 12 19.2184C7.24766 19.2184 4.80703 16.3996 4.23125 15.6262C4.14265 15.5101 4.09437 15.3683 4.09375 15.2223V10.5301"
                                 stroke="#262626" strokeLinecap="round"
                                 strokeLinejoin="round" strokeWidth="1.5"/>
                        </svg>}
                     text="Dashboard"/>
         <TopbarItem isLink href="/feedback"
                     icon={
                        <svg fill="none" height="24" viewBox="0 0 24 24"
                             width="24" xmlns="http://www.w3.org/2000/svg">
                           <path d="M12.3751 20.25H4.47194C4.37679 20.2513 4.28236 20.2334 4.1942 20.1976C4.10605 20.1618 4.02597 20.1087 3.95869 20.0414C3.8914 19.9741 3.83828 19.894 3.80244 19.8059C3.76661 19.7177 3.7488 19.6233 3.75006 19.5281V11.625C3.75006 9.33751 4.65877 7.14371 6.27627 5.5262C7.89377 3.9087 10.0876 3 12.3751 3V3C13.5077 3 14.6293 3.22309 15.6757 3.65654C16.7221 4.08999 17.673 4.7253 18.4739 5.5262C19.2748 6.32711 19.9101 7.27792 20.3435 8.32436C20.777 9.37079 21.0001 10.4923 21.0001 11.625V11.625C21.0001 12.7577 20.777 13.8792 20.3435 14.9256C19.9101 15.9721 19.2748 16.9229 18.4739 17.7238C17.673 18.5247 16.7221 19.16 15.6757 19.5935C14.6293 20.0269 13.5077 20.25 12.3751 20.25V20.25Z"
                                 stroke="#262626" strokeLinecap="round"
                                 strokeLinejoin="round" strokeWidth="1.5"/>
                           <path d="M9.375 10.5H15" stroke="#262626" strokeLinecap="round"
                                 strokeLinejoin="round" strokeWidth="1.5"/>
                           <path d="M9.375 13.5H15" stroke="#262626" strokeLinecap="round"
                                 strokeLinejoin="round" strokeWidth="1.5"/>
                        </svg>
                     }
                     text="Give Feedback"/>
         <TopbarItem isLink href="/settings"
                     icon={
                        <svg fill="none" height="24" viewBox="0 0 24 24"
                             width="24" xmlns="http://www.w3.org/2000/svg">
                           <path d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z"
                                 stroke="#262626" strokeLinecap="round"
                                 strokeLinejoin="round" strokeWidth="1.5"/>
                           <path d="M17.2223 6.10352C17.4598 6.32227 17.6848 6.54727 17.8973 6.77852L20.4566 7.14414C20.8737 7.86836 21.1951 8.64357 21.4129 9.45039L19.8566 11.5223C19.8566 11.5223 19.8848 12.1598 19.8566 12.4785L21.4129 14.5504C21.1961 15.3576 20.8746 16.1329 20.4566 16.8566L17.8973 17.2223C17.8973 17.2223 17.4566 17.6816 17.2223 17.8973L16.8566 20.4566C16.1324 20.8737 15.3572 21.1951 14.5504 21.4129L12.4785 19.8566C12.1604 19.8848 11.8404 19.8848 11.5223 19.8566L9.45039 21.4129C8.64322 21.1961 7.86789 20.8746 7.14414 20.4566L6.77852 17.8973C6.54727 17.6785 6.32227 17.4535 6.10352 17.2223L3.54414 16.8566C3.12712 16.1324 2.8057 15.3572 2.58789 14.5504L4.14414 12.4785C4.14414 12.4785 4.11602 11.841 4.14414 11.5223L2.58789 9.45039C2.80469 8.64322 3.12617 7.86789 3.54414 7.14414L6.10352 6.77852C6.32227 6.54727 6.54727 6.32227 6.77852 6.10352L7.14414 3.54414C7.86836 3.12712 8.64357 2.8057 9.45039 2.58789L11.5223 4.14414C11.8404 4.11601 12.1604 4.11601 12.4785 4.14414L14.5504 2.58789C15.3576 2.80469 16.1329 3.12617 16.8566 3.54414L17.2223 6.10352Z"
                                 stroke="#262626" strokeLinecap="round"
                                 strokeLinejoin="round" strokeWidth="1.5"/>
                        </svg>}
                     text="Settings"/>
         <TopbarItem icon={
            <svg fill="none" height="24" viewBox="0 0 24 24"
                 width="24" xmlns="http://www.w3.org/2000/svg">
               <path d="M7.6875 15.9375L3.75 12L7.6875 8.0625" stroke="#262626" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
               <path d="M14.25 12L3.75 12" stroke="#262626" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
               <path d="M14.25 3.75H19.5C19.6989 3.75 19.8897 3.82902 20.0303 3.96967C20.171 4.11032 20.25 4.30109 20.25 4.5L20.25 19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0303C19.8897 20.171 19.6989 20.25 19.5 20.25H14.25"
                     stroke="#262626" strokeLinecap="round"
                     strokeLinejoin="round" strokeWidth="1.5"/>
            </svg>} isLink={false}
                     text="Logout"
                     onClick={handleLogout}/>
      </div>
   )
}