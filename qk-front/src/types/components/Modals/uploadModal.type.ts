import type { IInstitution } from "@interfaces/institution.interface"

export enum FileExtensionEnum {
   CSV = "csv",
   XLS = "xls",
   XLSX = "xlsx"
}

export type UploadModalType = {
   isOpen: boolean
   handleCloseModal: () => void
   institutionData?: IInstitution
}