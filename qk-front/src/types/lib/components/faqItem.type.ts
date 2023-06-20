export type FaqItemType = {
   isShown: boolean
   question: string
   answer: string
   index: number
   handleExpandOne: ((index: number) => void)
}