import { atom } from "recoil"

/**
 * Burger menu open global state
 */
export const isBurgerMenuOpen = atom<boolean>({
   key: "isBurgerMenuOpen",
   default: false
})