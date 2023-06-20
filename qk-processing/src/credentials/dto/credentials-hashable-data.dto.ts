import { Credential } from "@prisma/client";

import { CredentialsDataDto } from "./credentials-data.dto";

/**
 * Data Transfer Object with all hashable parameters for CredentialsChange
 */
export class CredentialsHashableDataDto {
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

  studyStartedAt?: Date;
  studyEndedAt?: Date;
  graduatedAt?: Date;
  expiresAt?: Date;

  static fromCredentials(credentials: Credential): CredentialsHashableDataDto {
    const dto = new CredentialsHashableDataDto();
    dto.institutionUuid = ("" === credentials.institutionUuid) ? undefined : credentials.institutionUuid;
    dto.certificateId = ("" === credentials.certificateId) ? undefined : credentials.certificateId;
    dto.graduatedName = ("" === credentials.graduatedName) ? undefined : credentials.graduatedName;
    dto.qualificationName = ("" === credentials.qualificationName) ? undefined : credentials.qualificationName;
    dto.majors = ("" === credentials.majors) ? undefined : credentials.majors;
    dto.minors = ("" === credentials.minors) ? undefined : credentials.minors;
    dto.awardingInstitution = ("" === credentials.awardingInstitution) ? undefined : credentials.awardingInstitution;
    dto.qualificationLevel = ("" === credentials.qualificationLevel) ? undefined : credentials.qualificationLevel;
    dto.awardLevel = ("" === credentials.awardLevel) ? undefined : credentials.awardLevel;
    dto.studyLanguage = ("" === credentials.studyLanguage) ? undefined : credentials.studyLanguage;
    dto.info = ("" === credentials.info) ? undefined : credentials.info;
    dto.gpaFinalGrade = ("" === credentials.gpaFinalGrade) ? undefined : credentials.gpaFinalGrade;

    dto.studyStartedAt = credentials.studyStartedAt ?? undefined;
    dto.studyEndedAt = credentials.studyEndedAt  ?? undefined;
    dto.graduatedAt = credentials.graduatedAt ?? undefined;
    dto.expiresAt = credentials.expiresAt ?? undefined;

    return dto;
  }

  static fromCredentialsData(credentialsData: CredentialsDataDto): CredentialsHashableDataDto {
    const dto = new CredentialsHashableDataDto();
    dto.institutionUuid = (null === credentialsData.institutionUuid || "" === credentialsData.institutionUuid) ? undefined : credentialsData.institutionUuid;
    dto.certificateId = (null === credentialsData.certificateId || "" === credentialsData.certificateId) ? undefined : credentialsData.certificateId;
    dto.graduatedName = (null === credentialsData.graduatedName || "" === credentialsData.graduatedName) ? undefined : credentialsData.graduatedName;
    dto.qualificationName = (null === credentialsData.qualificationName || "" === credentialsData.qualificationName) ? undefined : credentialsData.qualificationName;
    dto.majors = (null === credentialsData.majors || "" === credentialsData.majors) ? undefined : credentialsData.majors;
    dto.minors = (null === credentialsData.minors || "" === credentialsData.minors) ? undefined : credentialsData.minors;
    dto.awardingInstitution = (null === credentialsData.awardingInstitution || "" === credentialsData.awardingInstitution) ? undefined : credentialsData.awardingInstitution;
    dto.qualificationLevel = (null === credentialsData.qualificationLevel || "" === credentialsData.qualificationLevel) ? undefined : credentialsData.qualificationLevel;
    dto.awardLevel = (null === credentialsData.awardLevel || "" === credentialsData.awardLevel) ? undefined : credentialsData.awardLevel;
    dto.studyLanguage = (null === credentialsData.studyLanguage || "" === credentialsData.studyLanguage) ? undefined : credentialsData.studyLanguage;
    dto.info = (null === credentialsData.info || "" === credentialsData.info) ? undefined : credentialsData.info;
    dto.gpaFinalGrade = (null === credentialsData.gpaFinalGrade || "" === credentialsData.gpaFinalGrade) ? undefined : credentialsData.gpaFinalGrade;

    dto.studyStartedAt = credentialsData.studyStartedAt ?? undefined;
    dto.studyEndedAt = credentialsData.studyEndedAt ?? undefined;
    dto.graduatedAt = credentialsData.graduatedAt ?? undefined;
    dto.expiresAt = credentialsData.expiresAt ?? undefined;

    return dto;
  }
}