export type InstitutionMappingType = {
   qualkeyName: string
   originalColumnName: string
}

export enum InstitutionStatusEnum {
   ACTIVE = "ACTIVE",
   CLOSED = "CLOSED"
}

export type InstitutionRepresentatives = {
   fullName: string
   signatureUrl: string
   title: string
}

export interface IInstitution {
   uuid: string
   status: InstitutionStatusEnum
   emailDomain: string
   logoUrl?: string
   stampUrl?: string
   name: string
   representatives: InstitutionRepresentatives[]
   mapping: InstitutionMappingType[]
   createdAt: Date
   updatedAt: Date
}