import { ICredentialSharePage } from "@interfaces/credentials.interface"

import type { ServerErrorMessageType } from "@customTypes/common"
import type { IUserData } from "@interfaces/user.interface"

export type SharedUuidPageType = {
   serverErrorMessage: ServerErrorMessageType
   userData: IUserData
   shareData?: ICredentialSharePage[]
   shareId: string
}
