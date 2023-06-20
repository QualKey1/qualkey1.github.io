import { atom } from "recoil"

/**
 * Global loading state
 */
export const globalLoading = atom<boolean>({
   key: "globalLoading",
   default: false
})