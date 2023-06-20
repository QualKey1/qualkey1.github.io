import type { ICredential } from "@interfaces/credentials.interface"

export type DashboardType = {
   data: [number, ICredential[]]
}

export type StudentDashboardType = {
   data: ICredential[]
   name: string
}