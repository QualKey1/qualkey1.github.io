import React from "react"

/**
 * Topbar history handler
 */
export const useUrlTitle = (path: string): Array<string[] | undefined> => {

   const UrlMapping = React.useMemo(() => {
      return new Map([
         ["/dashboard/[uuid]", ["View Credentials"]],
         ["/analytics", ["Analytics"]],
         ["/faq", ["Help & FAQ"]],
         ["/contact", ["Contact Us"]],
         ["/about", ["About Us"]],
         ["/policy", ["Privacy Policy"]],
         ["/feedback", ["Give Feedback"]],
         ["/settings", ["Settings"]]
      ])
   }, [])

   const currentUrlTitle = React.useMemo(() => {
      return UrlMapping.has(path) ? UrlMapping.get(path) : undefined
   }, [path, UrlMapping])

   return [currentUrlTitle]
}