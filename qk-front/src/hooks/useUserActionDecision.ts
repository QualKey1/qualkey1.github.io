import React from "react"

import axios from "axios"

import { apiUrl } from "@constants/urls"
import { UserActionDecisionEnum } from "@interfaces/user.interface"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { UseUserActionDecisionType } from "@customTypes/hooks"
import type { IUserAction } from "@interfaces/user.interface"

/**
 * User action decision handler
 */
export const useUserActionDecision = (
   data: IUserAction | null, setActiveStep:  React.Dispatch<React.SetStateAction<number>>, totalSteps: number, setError: React.Dispatch<React.SetStateAction<string>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>
): UseUserActionDecisionType => {

   const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false)
   const [isDeclined, setIsDeclined] = React.useState<boolean>(false)

   const handleRequest = async (decision: UserActionDecisionEnum): Promise<void> => {
      setLoading(true)
      await axios.post(`${apiUrl}/action`, {
         actionId: data?.id.toString(),
         subjectUuid: data?.subjectUuid,
         type: data?.type,
         decision: decision
      }, { withCredentials: true })

         .then(res => {
            setLoading(false)
            if (res.status === 200) {
               setActiveStep(totalSteps)
               decision === UserActionDecisionEnum.APPROVE && setIsConfirmed(true)
               decision === UserActionDecisionEnum.REJECT && setIsDeclined(true)

            } else {
               setError("Unexpected response")
            }

         })
         .catch(err => {
            handleAxiosError(err as never, setError, null, setLoading)
         })
   }
   
   return [isConfirmed, isDeclined, handleRequest]
}