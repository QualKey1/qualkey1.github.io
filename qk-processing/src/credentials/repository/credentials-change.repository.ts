import { Injectable, NotFoundException } from "@nestjs/common";
import { CredentialChange } from "@prisma/client";

import { CredentialsChangeNotFoundException } from "../../common/exception";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CredentialsChangeRepository {
  constructor(
        private prisma: PrismaService,
  ) {
  }

  public async getById(id: number): Promise<CredentialChange> {
    const credentialsChange = await this.prisma.credentialChange.findUnique({ where: { id: id } });
    if (credentialsChange === null) throw new CredentialsChangeNotFoundException(id);

    return credentialsChange;
  }

  public async hasHash(hash: string): Promise<boolean> {
    const credentialsChange = await this.prisma.credentialChange.findUnique({ where: { hash: hash } });

    return (null !== credentialsChange);
  }

  public async getByHash(hash: string): Promise<CredentialChange> {
    const credentialsChange = await this.prisma.credentialChange.findUnique({ where: { hash: hash } });

    if (null === credentialsChange) {
      throw new NotFoundException(`There is no CredentialsChange found for hash: ${hash}`);
    }

    return credentialsChange;
  }

  public async getLastByCredentialsDid(credentialDid: string): Promise<CredentialChange> {
    const credentialsChange = await this.prisma.credentialChange.findFirst({
      where: { credentialDid: credentialDid },
      orderBy: { createdAt: "desc" },
    });

    if (null === credentialsChange) {
      throw new NotFoundException(`There is no CredentialsChange found for credentials: ${credentialDid}`);
    }

    return credentialsChange;
  }

  public async getLastByCredentialsUuid(credentialsUuid: string): Promise<CredentialChange> {
    const credentialsChange = await this.prisma.credentialChange.findFirst({
      where: { credentialUuid: credentialsUuid },
      orderBy: { createdAt: "desc" },
    });

    if (null === credentialsChange) {
      throw new NotFoundException(`There is no CredentialsChange found for credentials: ${credentialsUuid}`);
    }

    return credentialsChange;
  }
}