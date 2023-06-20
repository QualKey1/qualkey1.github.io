/**
 * Array of years generator
 */
export const generateArrayOfYears = (): string[] => {
   const maxYear = new Date().getFullYear()
   const minYear = maxYear - 50
   const years = []

   for (let i = maxYear; i > minYear; i--) {
      years.push(i)
   }

   return years as unknown as string[]
}