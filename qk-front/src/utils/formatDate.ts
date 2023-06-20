import moment from "moment/moment"

/**
 * Local date formatter
 */
export const formatDate = (format: string, date?: Date): string | null => {
   if (!date) return null
   return moment.utc(date).local().format(format)
}