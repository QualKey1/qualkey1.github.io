import { IUserAction } from "@interfaces/user.interface"

export enum FileTypeEnum  {
   TEXT_CSV = "text/csv",
   APP_CSV = "application/csv",
   APPX_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
   APP_XLSX = "application/xlsx"
}

export type UserActionReviewUploadType = {
   data: IUserAction | null
   handleCloseModal:  () => void
   isOpen: boolean
}