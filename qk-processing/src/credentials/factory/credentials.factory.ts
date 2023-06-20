import { Injectable, Logger } from "@nestjs/common";
import { Credential, User } from "@prisma/client";

import { HederaService } from "../../hedera/hedera.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CredentialsDataDto } from "../dto";

@Injectable()
export class CredentialsFactory {
  constructor(
        private prisma: PrismaService,
        private hedera: HederaService,
  ) {
  }

  public async create(dto: CredentialsDataDto, student: User, uploadUuid: string): Promise<Credential> {
    const did = await this.hedera.generateDid();
    Logger.debug(`DID for credentials received - ${did}`);

    return await this.prisma.credential.create({
      data: {
        did: did,
        studentUuid: student.uuid,
        institutionUuid: dto.institutionUuid,
        uploadUuid: uploadUuid,

        certificateId: dto.certificateId,
        graduatedName: dto.graduatedName,
        authenticatedBy: dto.authenticatedBy,
        qualificationName: dto.qualificationName,
        majors: dto.majors,
        minors: dto.minors,
        authenticatedTitle: dto.authenticatedTitle,
        awardingInstitution: dto.awardingInstitution,
        qualificationLevel: dto.qualificationLevel,
        awardLevel: dto.awardLevel,
        studyLanguage: dto.studyLanguage,
        info: dto.info,
        gpaFinalGrade: dto.gpaFinalGrade,
        authenticatedAt: dto.authenticatedAt,
        studyStartedAt: dto.studyStartedAt,
        studyEndedAt: dto.studyEndedAt,
        graduatedAt: dto.graduatedAt,
        expiresAt: dto.expiresAt,
      },
    });
  }
}