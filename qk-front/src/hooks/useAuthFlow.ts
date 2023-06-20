import React from "react"

import { AuthFlowStepsEnum } from "@customTypes/common"

import type { UseAuthFlowType } from "@customTypes/hooks"

/**
 * Login and forgot pages components data handler
 */
export const useAuthFlow = (mapping: Map<AuthFlowStepsEnum, (string | undefined)[]>): UseAuthFlowType => {
   const [authFlowStep, setAuthFlowStep] = React.useState<AuthFlowStepsEnum>(AuthFlowStepsEnum.FORM)

   const authFlowStepData: Array<string | undefined> | undefined = React.useMemo(() => {
      return mapping.has(authFlowStep) ? mapping.get(authFlowStep) : undefined
   }, [authFlowStep, mapping])

   return [authFlowStep, setAuthFlowStep, authFlowStepData]
}