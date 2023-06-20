import type { ServerErrorMessageType } from "@customTypes/common"
import type { IUserAction, IUserData } from "@interfaces/user.interface"

export type SettingsPageType = {
   serverErrorMessage: ServerErrorMessageType
   userData: IUserData,
   actionData: IUserAction[]
}