import { atom } from "recoil"

/**
 * Withdraw credential modal open global state
 */
export const isWithdrawCredentialModalOpen = atom<boolean>({
   key: "isWithdrawCredentialModalOpen",
   default: false
})