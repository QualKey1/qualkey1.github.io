export type SelectType = {
   defaultLabel: string
   fullWidth?: boolean
   optionsList: string[]
   selectKey: string,
   selectIndex: number,
   clearable?: boolean
   disabled?: boolean
   controlledState?: boolean
   state?: string[]
   resetValueOnQueryChange?: boolean
   handleGetStateOutside?: (value: string) => void
}