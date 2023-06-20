import type { FormDataType } from "@customTypes/common"

export const compareObjects = (compare: FormDataType, compareWith: FormDataType): {[k: string]: string} => {
   return Object.keys(compareWith).reduce((diff, key) => {
      if (compare[key] === compareWith[key]) return diff
      return {
         ...diff,
         [key]: compareWith[key]
      }
   }, {})
}