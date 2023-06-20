/**
 * Topbar fullname formatter
 */
export const formatFullname = (fullname?: string): string => {
   if (fullname) {
      const firstLetter = fullname[0]
      const surname = fullname.split(" ")[1]

      return `${firstLetter}. ${surname}`
   }

   return "Full Name"
}