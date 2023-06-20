export enum FaqCategoriesEnum {
   ALL = "all questions",
   STUDENTS = "for students",
   EDUCATORS = "for educators",
   EMPLOYERS = "for employers",
}

export type FaqQuestionType = {
   question: string
   answer: string
   categories: FaqCategoriesEnum[],
   isShown: boolean
}