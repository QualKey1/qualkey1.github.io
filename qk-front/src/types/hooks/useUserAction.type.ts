import { UserActionTypeEnum } from "@interfaces/user.interface"

import type { HEX } from "@customTypes/constants"
import type { IUserAction } from "@interfaces/user.interface"


export type UseUserActionType = [
   (type: UserActionTypeEnum) => (HEX | string)[] | undefined,
   (type: UserActionTypeEnum, value: boolean, data: IUserAction | null) => void,
   ActionModalInitialStateType,
      IUserAction | null
]

export type ActionModalInitialStateType = {
   [key in UserActionTypeEnum]: boolean
}