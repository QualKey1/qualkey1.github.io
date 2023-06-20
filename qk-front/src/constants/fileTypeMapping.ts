import { FileTypeEnum } from "@customTypes/components/Modals"

export const FileTypeMapping = new Map([
   [FileTypeEnum.TEXT_CSV, ["csv"]],
   [FileTypeEnum.APP_CSV, ["csv"]],
   [FileTypeEnum.APPX_XLSX, ["xlsx"]],
   [FileTypeEnum.APP_XLSX, ["xlsx"]],
])