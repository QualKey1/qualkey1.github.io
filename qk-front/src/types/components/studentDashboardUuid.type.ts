import type { ICredential } from "@interfaces/credentials.interface"

export type StudentDashboardUuidType = {
   data: ICredential
   name?: string
}

export enum NavigationEnum {
   INFO = "Credential Information",
   HISTORY = "Credential History"
}