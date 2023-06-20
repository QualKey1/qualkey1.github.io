import { UserActionDecisionEnum } from "@interfaces/user.interface"

export type UseUserActionDecisionType = [
   boolean,
   boolean,
   ((decision: UserActionDecisionEnum) => Promise<void>)
]