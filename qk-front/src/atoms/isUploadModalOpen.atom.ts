import { atom } from "recoil"

/**
 * Upload modal open global state
 */
export const isUploadModalOpen = atom<boolean>({
   key: "isUploadModalOpen",
   default: false
})