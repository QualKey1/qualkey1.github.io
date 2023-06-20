import { Injectable } from "@nestjs/common";
import { Credential, CredentialChange } from "@prisma/client";

import { InstitutionRepository } from "../../institution/repository/institution.repository";
import { UploadRepository } from "../../upload/repository/upload.repository";
import { UserRepository } from "../../user/user.repository";
import { CredentialsPublicViewDto } from "../dto";

/**
 * Factory for CredentialsPublicViewDto
 */
@Injectable()
export class CredentialsPublicViewDtoFactory {
  constructor(
        private readonly uploadRepository: UploadRepository,
        private readonly userRepository: UserRepository,
        private readonly institutionRepository: InstitutionRepository,
  ) {
  }

  public async createFromCredentials(credentials: Credential, credentialChange: CredentialChange, allowed: string[]): Promise<CredentialsPublicViewDto> {
    const upload = await this.uploadRepository.getByUuid(credentials.uploadUuid);
    const authenticatedByUser = await this.userRepository.getByUuid(upload.uploadedBy);
    const institution = await this.institutionRepository.getByUuid(credentials.institutionUuid);

    return new CredentialsPublicViewDto(
      credentials.did,
      credentialChange.smartContractId,
      allowed.includes("certificateId") ? credentials.certificateId : undefined,
      credentials.graduatedName,
      credentials.qualificationName,
      allowed.includes("majors") ? credentials.majors : undefined,
      allowed.includes("minors") ? credentials.minors : undefined,
      credentials.awardingInstitution,
      allowed.includes("qualificationLevel") ? credentials.qualificationLevel : undefined,
      allowed.includes("awardLevel") ? credentials.awardLevel : undefined,
      allowed.includes("studyLanguage") ? credentials.studyLanguage : undefined,
      allowed.includes("info") ? credentials.info : undefined,
      allowed.includes("gpaFinalGrade") ? credentials.gpaFinalGrade : undefined,
      allowed.includes("studyStartedAt") ? credentials.studyStartedAt : undefined,
      allowed.includes("studyEndedAt") ? credentials.studyEndedAt : undefined,
      allowed.includes("graduatedAt") ? credentials.graduatedAt : undefined,
      allowed.includes("expiresAt") ? credentials.expiresAt : undefined,
      credentials.authenticatedBy,
      credentials.authenticatedTitle,
      credentials.authenticatedAt,
      authenticatedByUser.signatureUrl,
      institution.logoUrl,
      institution.stampUrl,
      credentialChange.transactionId,
    );
  }
}