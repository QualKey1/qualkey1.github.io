import type { IInstitution } from "@interfaces/institution.interface"

export enum UserRoleEnum {
   INSTITUTION_REPRESENTATIVE = "INSTITUTION_REPRESENTATIVE",
   STUDENT = "STUDENT",
   SHARED = "SHARED",
   PUBLIC = "PUBLIC"
}

export enum UserStatusEnum {
   ACTIVE = "ACTIVE",
   CLOSED = "CLOSED",
   BANNED = "BANNED"
}

export enum CurrencyEnum {
   GBP = "GBP",
   EUR = "EUR",
   USD = "USD"
}

export interface IUserData {
   uuid: string
   email: string
   password: string
   role: UserRoleEnum
   status: UserStatusEnum
   createdAt: Date
   updatedAt: Date
   lastLoginAt?: Date
   fullName?: string
   currency: CurrencyEnum
   stripeCustomerId?: string
   signatureUrl?: string
   title?: string
   institutionUuid?: string
   institution?: IInstitution
}

export enum UserActionDecisionEnum {
   APPROVE = "approve",
   REJECT = "reject"
}

export enum UserActionStatusEnum {
   ACTIVE = "ACTIVE",
   DECISION_MADE = "DECISION_MADE"
}

export enum UserActionTypeEnum {
   REVIEW_UPLOAD = "REVIEW_UPLOAD",
   REVIEW_WITHDRAWAL = "REVIEW_WITHDRAWAL",
}

export interface IUserAction {
   id: number
   status: UserActionStatusEnum
   userUuid: string
   initiatorName: string
   type: UserActionTypeEnum
   subjectUuid: string
   credentialsUuid?: string
   createdAt: Date
}