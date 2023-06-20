import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"

import type { ICredential } from "@interfaces/credentials.interface"

const { persistAtom } = recoilPersist()

/**
 * Credential data global payment state
 */
export const paymentDataState = atom<ICredential | null>({
   key: "paymentDataState",
   default: null,
   effects_UNSTABLE: [persistAtom]
})