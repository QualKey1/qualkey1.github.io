import React from "react"

import { colorBlack300, colorBrandBlue24, colorDanger, colorPending, colorSuccess } from "@constants/styles"
import { CredentialStatusEnum } from "@interfaces/credentials.interface"

/**
 * Sidebar UI and routing handler
 */
export const useQualificationStatus = (status: CredentialStatusEnum, isStudent: boolean): Array<string[] | undefined> => {

   const CredentialStatusMapping = React.useMemo(() => {
      return new Map([
         [CredentialStatusEnum.NEW, [
            colorBrandBlue24,
            "New",
            "Credentials data has been uploaded to QualKey. Blockchain upload is now being processed."
         ]],
         [CredentialStatusEnum.UPLOADING_TO_BLOCKCHAIN, [
            colorBrandBlue24,
            "New",
            "Credentials data has been uploaded to QualKey. Blockchain upload is now being processed."
         ]],
         [CredentialStatusEnum.UPLOADED_TO_BLOCKCHAIN, [
            colorPending,
            "Uploaded",
            "Credentials have been uploaded. Ready to be activated by the student."
         ]],
         [CredentialStatusEnum.ACTIVATED, [
            colorSuccess,
            "Activated",
            "Certification is active."]],
         [CredentialStatusEnum.WITHDRAWN, [
            colorDanger,
            "Withdrawn",
            "Certification has been withdrawn by the institution."
         ]],
         [CredentialStatusEnum.EXPIRED, [
            colorBlack300,
            "Expired",
            "Certification expired."
         ]],
      ])
   }, [])

   const CredentialStatusMappingStudent = React.useMemo(() => {
      return new Map([
         [CredentialStatusEnum.NEW, [
            colorBrandBlue24,
            "New",
            "Credentials data has been uploaded to QualKey. Blockchain upload is now being processed."
         ]],
         [CredentialStatusEnum.UPLOADING_TO_BLOCKCHAIN, [
            colorBrandBlue24,
            "New",
            "Credentials data has been uploaded to QualKey. Blockchain upload is now being processed."
         ]],
         [CredentialStatusEnum.UPLOADED_TO_BLOCKCHAIN, [
            colorPending,
            "Activate Credentials",
            "Please submit a payment to activate your qualification."
         ]],
         [CredentialStatusEnum.ACTIVATED, [
            colorSuccess,
            "Activated",
            "Your qualification has been activated and can be shared."]],
         [CredentialStatusEnum.WITHDRAWN, [
            colorDanger,
            "Withdrawn",
            "Certification has been withdrawn by the institution."
         ]],
         [CredentialStatusEnum.EXPIRED, [
            colorBlack300,
            "Expired",
            "Your qualification has expired. Please contact awarding institution."
         ]],
      ])
   }, [])

   const credentialStatus = React.useMemo(() => {
      if (isStudent) {
         return CredentialStatusMappingStudent.has(status) ? CredentialStatusMappingStudent.get(status) : undefined
      }
      return CredentialStatusMapping.has(status) ? CredentialStatusMapping.get(status) : undefined
   }, [status, isStudent, CredentialStatusMapping, CredentialStatusMappingStudent])

   return [credentialStatus]
}