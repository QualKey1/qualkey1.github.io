import React from "react"

import { ShareModalAdjustDataItem } from "@components/Modals/ShareModal/ShareModalAdjustDataItem"
import { qualkeyDataToShare } from "@constants/qualkeyDataToShare"

import styles from "./ShareModalAdjustData.module.scss"

export const ShareModalAdjustData: React.FC = (): JSX.Element => {

   return (
      <div className={styles.selection}>
         {qualkeyDataToShare.map(item => (
            <ShareModalAdjustDataItem key={item.value} name={item.title} value={item.value}/>
         ))}
      </div>
   )
}