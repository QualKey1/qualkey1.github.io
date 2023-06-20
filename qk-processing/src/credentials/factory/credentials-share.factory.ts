import { Injectable } from "@nestjs/common";
import { Credential, CredentialShare } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { PasswordGenerator } from "../../user/helper/password-generator.service";
import { CredentialsShareRequestDto } from "../dto";

/**
 * Factory for creation of CredentialShare objects
 */
@Injectable()
export class CredentialsShareFactory {
  constructor(
        private prisma: PrismaService,
  ) {
  }

  public async create(dto: CredentialsShareRequestDto, credentialsList: Credential[]): Promise<CredentialShare> {
    return this.prisma.credentialShare.create({
      data: {
        recipientEmails: dto.recipientEmails,
        sharedBy: credentialsList[0].studentUuid,
        credentialUuids: credentialsList.map(c => c.uuid),
        credentialQualificationNames: credentialsList.map(c => c.qualificationName),
        sharedFields: dto.sharedFields,
        temporaryPassword: dto.isPublic ? "" : PasswordGenerator.generate(4, true,false),
        expiresAt: new Date(dto.expiresAt),
      },
    });
  }
}