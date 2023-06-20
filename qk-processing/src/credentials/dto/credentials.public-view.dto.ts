/**
 * Data Transfer Object with all shared parameters for Credentials public view
 */
export class CredentialsPublicViewDto {
  constructor(
        public readonly did: string,
        public readonly smartContractId: string,
        public readonly certificateId?: string,

        public readonly graduatedName?: string,
        public readonly qualificationName?: string,
        public readonly majors?: string,
        public readonly minors?: string,
        public readonly awardingInstitution?: string,
        public readonly qualificationLevel?: string,
        public readonly awardLevel?: string,
        public readonly studyLanguage?: string,
        public readonly info?: string,
        public readonly gpaFinalGrade?: string,
        public readonly studyStartedAt?: Date,
        public readonly studyEndedAt?: Date,
        public readonly graduatedAt?: Date,

        public readonly expiresAt?: Date,

        public readonly authenticatedBy?: string,
        public readonly authenticatedTitle?: string,
        public readonly authenticatedAt?: Date,
        public readonly authenticatedBySignatureUrl?: string,

        public readonly institutionLogoUrl?: string,
        public readonly institutionStampUrl?: string,

        public readonly transactionId?: string,
  ) {
  }
}