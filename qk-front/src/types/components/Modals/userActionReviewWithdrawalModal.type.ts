import type { IUserAction } from "@interfaces/user.interface"

export type UserActionReviewWithdrawalModalType = {
   data: IUserAction | null
   handleCloseModal:  () => void
   isOpen: boolean
}