import { atom } from "recoil"

import { IUserAction } from "@interfaces/user.interface"

import type { ActionModalInitialStateType } from "@customTypes/hooks"

const modalInitialState = {
   REVIEW_UPLOAD: false,
   REVIEW_WITHDRAWAL: false
}

/**
 * Notification modal global state
 */
export const isUserActionModalOpen = atom<ActionModalInitialStateType>({
   key: "isUserActionModalOpen",
   default: modalInitialState
})

/**
 * Data to show inside notification modal global state
 */
export const userActionData = atom<IUserAction | null>({
   key: "userActionData",
   default: null
})