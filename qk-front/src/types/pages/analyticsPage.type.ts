import type { ServerErrorMessageType } from "@customTypes/common"
import type { IStats } from "@interfaces/stats.interface"
import type { IUserAction, IUserData } from "@interfaces/user.interface"

export type AnalyticsPageType = {
   userData: IUserData
   actionData: IUserAction[]
   statsData?: IStats
   serverErrorMessage: ServerErrorMessageType
}