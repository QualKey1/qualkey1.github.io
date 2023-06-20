import { AxiosError } from "axios"

import { capitalize } from "@utils/capitalize"

import type { ErrorSetterType, LoadingSetterType } from "@customTypes/common"
import type PinInput from "react-pin-input"

/**
 * Http request catch block handler
 */
export const handleAxiosError = (err: never, setError: ErrorSetterType, pinInput: PinInput | null, setLoading?: LoadingSetterType): void => {

   setLoading && setLoading(false)
   pinInput && pinInput.clear()

   const error = err as AxiosError
   const errorData = error.response?.data as AxiosError

   if (errorData === undefined) {
      setError(error.message)

   } else {
      if (Array.isArray(errorData.message)) {
         errorData.message.forEach((item: string) => {
            setError(capitalize(item))
         })

      } else {
         setError(`${capitalize(errorData.message)}`)
      }
   }
}