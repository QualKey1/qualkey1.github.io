import React, { useCallback, useEffect } from "react"

import axios from "axios"
import { useRouter } from "next/router"

import { authUrl } from "@constants/urls"
import { handleAxiosError } from "@utils/handleAxiosError"

import type { UseLogoutType } from "@customTypes/hooks"

/**
 * Logout handler
 */
export const useLogout = (): UseLogoutType => {
   const router = useRouter()
   const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)
   const [error, setError] = React.useState<string>("")
   
   useEffect(() => {
      if (error) {
         setIsModalOpen(true)
      }
   }, [error])

   useEffect(() => {
      if (!isModalOpen) {
         setError("")
      }
   }, [isModalOpen])
   
   const handleLogout = useCallback(async (): Promise<void> => {
      await axios.post(`${authUrl}/logout`, {}, { withCredentials: true })

         .then(res => {
            if (res.status === 200) {
               router.replace("/login")
            } else {
               setError("Unexpected response")
            }

         })
         .catch(err => {
            handleAxiosError(err as never, setError, null)
         })

   }, [router])
   
   return [isModalOpen, setIsModalOpen, error, handleLogout]
}