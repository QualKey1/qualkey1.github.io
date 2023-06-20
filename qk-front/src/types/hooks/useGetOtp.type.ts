import { AuthFlowStepsEnum } from "@customTypes/common"

export type AuthFlowStepSetterType = (value: (AuthFlowStepsEnum | ((prevState: AuthFlowStepsEnum) => AuthFlowStepsEnum))) => void

export type UseGetOtpType =  [
   {email: string, otpUuid: string},
   ((value: (((prevState: {email: string, otpUuid: string}) => {email: string, otpUuid: string}) | {email: string, otpUuid: string})) => void),
   ((email?: string) => void)
]