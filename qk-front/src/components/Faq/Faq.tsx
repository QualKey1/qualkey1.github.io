import React from "react"

import { FaqItem } from "@components/Faq/FaqItem"
import { allCategories, faqQuestions } from "@constants/faq"
import { FaqCategoriesEnum } from "@customTypes/constants"
import { Button, CheckboxRounded, Text } from "@lib/components"

import type { FaqQuestionType } from "@customTypes/constants"

import styles from "./Faq.module.scss"

export const FaqComponent: React.FC = (): JSX.Element => {

   const [faqFilter, setFaqFilter] = React.useState<FaqCategoriesEnum>(FaqCategoriesEnum.ALL)
   const [isFaqExpanded, setIsFaqExpanded] = React.useState<boolean>(false)
   const [questions, setQuestions] = React.useState<FaqQuestionType[]>(faqQuestions)

   /**
    * Filter category handler
    */
   const handleFilterFaq = (name: FaqCategoriesEnum): void => {
      setFaqFilter(name)
      setIsFaqExpanded(false)
      const filteredData = faqQuestions.filter(data => data.categories.includes(name))
      setQuestions(filteredData)
   }

   /**
    * Expand All questions - checkbox value and state handler
    */
   const handleExpandAll = React.useCallback((event: React.SyntheticEvent): void => {
      const target = event.target as HTMLInputElement
      const questionsCopy = [...questions]

      const newQuestionCopy = questionsCopy.map(item => {
         return { ...item, isShown: target.checked }
      })
      setQuestions(newQuestionCopy)
      setIsFaqExpanded(target.checked)
   }, [questions])

   /**
    * Expand one question - state handler
    */
   const handleExpandOne = React.useCallback((index: number): void => {
      const questionsCopy = [...questions]
      questionsCopy[index] = { ...questions[index], isShown: !questionsCopy[index].isShown }
      setQuestions(questionsCopy)
   }, [questions])

   return (
      <div className={styles.faq}>
         <div className={styles.top}>
            <div className={styles.buttons}>
               {allCategories.map(name => (
                  <Button key={name} thin active={faqFilter === name}
                          loading={false}
                          size="xs"
                          variant="filter" onClick={(): void => handleFilterFaq(name)}>
                     {name}
                  </Button>
               ))}
            </div>
            <div className={styles.expand}>
               <Text color="800" component="p" size="paragraph">
                  Expand All
               </Text>
               <CheckboxRounded handleCheckboxValue={handleExpandAll} isChecked={isFaqExpanded} isForm={false}
                                name="expandAll"/>
            </div>
         </div>
         <div className={styles.content}>
            {questions
               .map((item, index) => (
                  <FaqItem key={item.question} answer={item.answer} handleExpandOne={handleExpandOne}
                           index={index}
                           isShown={item.isShown}
                           question={item.question}/>
               ))}
         </div>
      </div>
   )
}