import React from "react"

import { useRecoilState } from "recoil"

import { dataToShareState } from "@atoms/shareModal.atom"
import styles from "@components/Modals/ShareModal/ShareModalAdjustDataItem.module.scss"
import { CheckboxRounded, Text } from "@lib/components"

import type { ShareModalAdjustDataItemType } from "@customTypes/components/Modals"

export const ShareModalAdjustDataItem: React.FC<ShareModalAdjustDataItemType> = ({ name, value }): JSX.Element => {

   const [, setIsCheckboxChecked] = React.useState<boolean>(true)
   const [dataToShare, setDataToShare] = useRecoilState(dataToShareState)

   /**
    * Checkbox value handler
    */
   const handleCheckboxChange = (event: React.SyntheticEvent): void => {
      const target = event.target as HTMLInputElement
      setIsCheckboxChecked(target.checked)
      if (target.checked) {
         setDataToShare(prevState => (
            [...prevState, {
               title: name,
               value: value
            }]
         ))

      } else {
         const removeItem = dataToShare.filter(item => item.value !== value)
         setDataToShare(removeItem)
      }
   }

   return (
      <div className={styles.item}>
         <Text color="blue" component="p" size="paragraph">
            {name}
         </Text>
         <CheckboxRounded handleCheckboxValue={handleCheckboxChange}
                          isChecked={dataToShare.some(item => item.value === value)} isForm={false}
                          name={name}/>
      </div>
   )
}