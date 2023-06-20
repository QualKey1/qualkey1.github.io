import React from "react"

import classNames from "classnames/bind"

import { Text } from "@lib/components"

import type { FaqItemType } from "@customTypes/components"

import styles from "./FaqItem.module.scss"

const cx = classNames.bind(styles)

export const FaqItem: React.FC<FaqItemType> = ({ isShown, question, answer, index, handleExpandOne }): JSX.Element => {

   const classNameIcon = cx(styles.icon, { active: isShown })
   const classNameItem = cx(styles.item, { active: isShown })

   return (
      <div className={styles.wrapper} onClick={(): void => handleExpandOne(index)}>
         <div className={classNameItem}>
            <Text bold color="800" component="p"
                  size="paragraph">
               {question}
            </Text>
            <svg className={classNameIcon} fill="none" height="10"
                 viewBox="0 0 17 10"
                 width="17" xmlns="http://www.w3.org/2000/svg">
               <path d="M2.42857 0L8.5 6.25L14.5714 0L17 1.25L8.5 10L0 1.25L2.42857 0Z" fill="#262626"/>
            </svg>
         </div>
         {isShown ? <div className={styles.answer}>
            <Text color="800" component="p" size="paragraph">
               {answer}
            </Text>
         </div> : null}
      </div>
   )
}