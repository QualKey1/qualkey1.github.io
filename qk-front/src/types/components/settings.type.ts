import type { IUserData } from "@interfaces/user.interface"

export enum SettingsViewEnum {
   ACCOUNT = "Account",
   CHANGE_PASSWORD = "Change Password",
   SECURITY_PRIVACY = "Security & Privacy",
   CURRENCY = "Currency"
}

export type SettingsType = {
   userData: IUserData
}