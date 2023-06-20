import React from "react"

import { NavigationEnum } from "@customTypes/components/studentDashboardUuid.type"

import type { ICredential } from "@interfaces/credentials.interface"

export type DashboardUuidNavigationType = {
   data: ICredential
   isStudent: boolean
}

export type DashboardUuidNavigationItemType = {
   data: NavigationEnum
   navigation: NavigationEnum
   navigationSetter:  React.Dispatch<React.SetStateAction<NavigationEnum>>
}