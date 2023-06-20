import { atom } from "recoil"

import { qualkeyDataToShare } from "@constants/qualkeyDataToShare"

import type { QualkeyDataToShareType } from "@customTypes/constants"

/**
 * Share modal open global state
 */
export const isShareModalOpen = atom<boolean>({
   key: "isShareModalOpen",
   default: false
})

export const shareUuids = atom<string[]>({
   key: "shareUuids",
   default: []
})

export const dataToShareState = atom<QualkeyDataToShareType[]>({
   key: "dataToShare",
   default: qualkeyDataToShare
})