import React from "react"

import classNames from "classnames/bind"

import { colorBlack800 } from "@constants/styles"
import { Text } from "@lib/components"

import type { UploadModalValidationItemType } from "@customTypes/components/Modals"

import styles from "./UploadModalValidationItem.module.scss"

const cx = classNames.bind(styles)

export const UploadModalValidationItem: React.FC<UploadModalValidationItemType> = ({
   columnName,
   errors
}): JSX.Element => {

   const [isItemExpanded, setIsItemExpanded] = React.useState<boolean>(false)

   const className = cx(styles.item, { active: isItemExpanded })
   const classNameIcon = cx(styles.expand, { active: isItemExpanded })
   const classNameData = cx(styles.data, { active: isItemExpanded })

   return (
      <div className={styles.wrapper}>
         <div className={className}>
            <div className={styles.left}>
               <Text color={errors.length > 0 ? "danger" : "800"} component="p" size="paragraph">
                  {columnName}
               </Text>

               {errors.length > 0
                  ? <svg fill="none" height="24" viewBox="0 0 24 24"
                         width="24" xmlns="http://www.w3.org/2000/svg">
                     <path d="M18.75 5.25L5.25 18.75" stroke="#D6193D" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                     <path d="M18.75 18.75L5.25 5.25" stroke="#D6193D" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                  </svg>
                  : <svg fill="none" height="24" viewBox="0 0 24 24"
                         width="24" xmlns="http://www.w3.org/2000/svg">
                     <path d="M20.25 6.75L9.75 17.25L4.5 12" stroke="#16A34A" strokeLinecap="round"
                           strokeLinejoin="round" strokeWidth="1.5"/>
                  </svg>}

            </div>

            {errors.length > 0 && <svg className={classNameIcon} fill="none" height="12"
                                       viewBox="0 0 25 12"
                                       width="25"
                                       xmlns="http://www.w3.org/2000/svg"
                                       onClick={(): void => setIsItemExpanded(prevState => !prevState)}>
               <path d="M24.5514 2.36948L13.9349 11.2701C13.5794 11.5326 13.246 11.6395 12.9627 11.6395C12.6794 11.6395 12.2977 11.5316 12.041 11.3144L1.37451 2.36948C0.84141 1.92713 0.824077 1.1445 1.33451 0.721588C1.84145 0.253712 2.68894 0.238498 3.21838 0.686653L12.9627 8.85899L22.707 0.692423C23.2348 0.244282 24.0837 0.259498 24.5909 0.727359C25.1014 1.1445 25.0848 1.92713 24.5514 2.36948Z"
                  fill="#D6193D"/>
            </svg>}

         </div>

         {errors.length > 0 && <div className={classNameData}>

            {errors.map(error => (
               <Text key={error} color="danger" component="p"
                     size="paragraph">
                  <span style={{ color: colorBlack800 }}>&ldquo;{columnName}&rdquo;</span> is {error}
               </Text>
            ))}

         </div>}

      </div>
   )
} 