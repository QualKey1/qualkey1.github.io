import { AuthFlowStepsEnum } from "@customTypes/common"

export type UseAuthFlowType = [
   AuthFlowStepsEnum,
   ((value: (((prevState: AuthFlowStepsEnum) => AuthFlowStepsEnum) | AuthFlowStepsEnum)) => void),
   Array<string | undefined> | undefined
]