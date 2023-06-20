import { Injectable } from "@nestjs/common";
import { CredentialShare, User } from "@prisma/client";

import { CredentialShareNotFoundException } from "../../common/exception";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CredentialsShareRepository {
  constructor(
        private prisma: PrismaService,
  ) {
  }

  public async getByUuid(uuid: string): Promise<CredentialShare> {
    const credentialShare = await this.prisma.credentialShare.findUnique({ where: { uuid: uuid } });
    if (null === credentialShare) throw new CredentialShareNotFoundException(uuid);

    return credentialShare;
  }

  public async findAllByUser(user: User): Promise<CredentialShare[]> {
    return await this.prisma.credentialShare.findMany({
      where: { sharedBy: user.uuid },
      orderBy: { createdAt: "desc" },
    });
  }

  public async findAllByUserAndCredentialUuid(user: User, credentialUuid: string): Promise<CredentialShare[]> {
    return await this.prisma.credentialShare.findMany({
      where: {
        AND: [
          { sharedBy: user.uuid },
          { credentialUuids: { has: credentialUuid } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public async findAllNotExpiredByCredentialUuid(credentialUuid: string): Promise<CredentialShare[]> {
    return await this.prisma.credentialShare.findMany({
      where: {
        AND: [
          { credentialUuids: { has: credentialUuid } },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public async findAllByCredentialUuid(credentialUuid: string): Promise<CredentialShare[]> {
    return await this.prisma.credentialShare.findMany({
      where: { credentialUuids: { has: credentialUuid } },
      orderBy: { createdAt: "desc" },
    });
  }

  public async hasPublicByCredentialUuid(credentialUuid: string): Promise<boolean> {
    return null !== await this.prisma.credentialShare.findFirst({
      where: {
        AND: [
          { credentialUuids: { has: credentialUuid } },
          { temporaryPassword: "" },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }
}