import type { ServerErrorMessageType } from "@customTypes/common"
import type { ICredential } from "@interfaces/credentials.interface"
import type { IUserAction, IUserData } from "@interfaces/user.interface"

export type DashboardPageType = {
   serverErrorMessage: ServerErrorMessageType
   credentialsData: [number, ICredential[]]
   userData: IUserData,
   actionData: IUserAction[]
}

export type DashboardUuidPageType = {
   serverErrorMessage: ServerErrorMessageType
   credentialsData: [ICredential]
   userData: IUserData,
   actionData: IUserAction[]
}