import { atom } from "recoil"

/**
 * Unexpected error modal global state
 */
export const globalErrorModal = atom<{isShown: boolean, error: string}>({
   key: "globalErrorModal",
   default: {
      isShown: false,
      error: ""
   }
})