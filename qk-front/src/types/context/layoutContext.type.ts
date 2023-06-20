import type { IUserAction, IUserData } from "@interfaces/user.interface"

export type LayoutContextType = {
   userData?: IUserData
   actionData?: IUserAction[]
   handleLogout?: () => Promise<void>
   shareId?: string | string[]
}