import React from "react"

import type { IUserAction, IUserData } from "@interfaces/user.interface"

export type MainLayoutType = {
   userData: IUserData
   actionData?: IUserAction[]
   shareId?: string | string[]
   children: React.ReactNode
}