import { IsEmail, IsNotEmpty } from "class-validator";

/**
 * Data Transfer Object with all Credentials data
 */
export class CredentialsDataDto {
  @IsNotEmpty()
  @IsEmail()
    email: string;
  institutionUuid?: string;

  certificateId?: string;
  graduatedName?: string;
  qualificationName?: string;
  majors?: string;
  minors?: string;
  awardingInstitution?: string;
  qualificationLevel?: string;
  awardLevel?: string;
  studyLanguage?: string;
  info?: string;
  gpaFinalGrade?: string;

  authenticatedAt?: Date;
  authenticatedTitle?: string;
  authenticatedBy?: string;

  studyStartedAt?: Date;
  studyEndedAt?: Date;
  graduatedAt?: Date;
  expiresAt?: Date;
}