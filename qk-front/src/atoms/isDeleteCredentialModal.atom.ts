import { atom } from "recoil"

/**
 * Delete credential modal open global state
 */
export const isDeleteCredentialModalOpen = atom<boolean>({
   key: "isDeleteCredentialModalOpen",
   default: false
})