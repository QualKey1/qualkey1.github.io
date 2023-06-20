import type { IUserAction, IUserData } from "@interfaces/user.interface"

export type PublicPageType = {
   userData: IUserData
   actionData: IUserAction[]
   shareId: string | string[]
}