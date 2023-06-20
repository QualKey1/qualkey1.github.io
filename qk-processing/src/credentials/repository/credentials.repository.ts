import { Injectable } from "@nestjs/common";
import { Credential, CredentialStatus, Role, User, UserStatus } from "@prisma/client";

import { CredentialsNotFoundException } from "../../common/exception";
import { CredentialWithEverythingType } from "../../common/types/credentials/credential-with-everything.type";
import { CredentialsWithCredentialChange } from "../../common/types/credentials/credentials-with-credential-change.type";
import { PrismaService } from "../../prisma/prisma.service";
/**
 * Class responsible for getting credentials from the data sources
 */
@Injectable()
export class CredentialsRepository {
  constructor(
      private prismaService: PrismaService,
  ) {
  }

  public async getByUuid(uuid: string): Promise<Credential> {
    const credentials = await this.prismaService.credential.findFirst({
      where:{
        OR: [
          { uuid: uuid },
        ],
        NOT: { status: { equals: CredentialStatus.DELETED } },
      },
    });
    if (null === credentials) throw new CredentialsNotFoundException(uuid);

    return credentials;
  }

  public async getByUuidWithChanges(uuid: string): Promise<CredentialWithEverythingType> {
    const credentials = await this.prismaService.credential.findFirst({
      where:{
        OR: [
          { uuid: uuid },
        ],
        NOT: { status: { equals: CredentialStatus.DELETED } },
      },
      include: {
        credentialChanges: { orderBy: { createdAt: "desc" } },
        institution: {
          include: {
            representatives: {
              where: { status: UserStatus.ACTIVE, role: Role.INSTITUTION_REPRESENTATIVE },
              select: {
                fullName: true,
                signatureUrl: true,
                title: true,
              },
            },
          },
        },
      },
    });
    if (null === credentials) throw new CredentialsNotFoundException(uuid);

    return credentials;
  }

  public async getByDid(did: string): Promise<Credential> {
    const credentials = await this.prismaService.credential.findFirst({
      where:{
        OR: [
          { did:did },
        ],
        NOT: { status: { equals: CredentialStatus.DELETED } },
      },
    });
    if (null === credentials) throw new CredentialsNotFoundException(did);

    return credentials;
  }

  public async getByDidWithLastChange(did: string): Promise<Credential> {
    const credentials = await this.prismaService.credential.findFirst({
      where:{
        OR: [
          { did:did },
        ],
        NOT: { status: { equals: CredentialStatus.DELETED } },
      },
      include: {
        credentialChanges: { orderBy: { createdAt: "desc" } },
        institution: {
          include: {
            representatives: {
              where: { status: UserStatus.ACTIVE, role: Role.INSTITUTION_REPRESENTATIVE },
              select: {
                fullName: true,
                signatureUrl: true,
                title: true,
              },
            },
          },
        },
      },
    });
    if (null === credentials) throw new CredentialsNotFoundException(did);

    return credentials;
  }

  public async getByUuidWithLastChange(uuid: string): Promise<Credential> {
    const credentials = await this.prismaService.credential.findFirst({
      where:{
        OR: [
          { uuid:uuid },
        ],
        NOT: { status: { equals: CredentialStatus.DELETED } },
      },
      include: {
        credentialChanges: { orderBy: { createdAt: "desc" } },
        institution: {
          include: {
            representatives: {
              where: { status: UserStatus.ACTIVE, role: Role.INSTITUTION_REPRESENTATIVE },
              select: {
                fullName: true,
                signatureUrl: true,
                title: true,
              },
            },
          },
        },
      },
    });
    if (null === credentials) throw new CredentialsNotFoundException(uuid);

    return credentials;
  }

  public async getAllForStudent(user: User, filter?: string): Promise<Credential[]> {
    if (filter && filter !== "") {
      return await this.prismaService.credential.findMany({
        where: {
          OR: [
            { graduatedName: { contains: filter, mode: "insensitive" } },
            { awardingInstitution: { contains: filter, mode: "insensitive" } },
            { qualificationName: { contains: filter, mode: "insensitive" } },
          ],
          AND: [
            { studentUuid: user.uuid },
          ],
          NOT: { status: { equals: CredentialStatus.DELETED } },
        },
        include: {
          credentialChanges: { orderBy: { createdAt: "desc" } },
          institution: true,
        },
      });
    } else {
      return await this.prismaService.credential.findMany({
        where:{
          OR: [
            { studentUuid: user.uuid },
          ],
          NOT: { status: { equals: CredentialStatus.DELETED } },
        },
        include: {
          credentialChanges: { orderBy: { createdAt: "desc" } },
          institution: true,
        },
      });
    }
  }

  public async getAllForInstitution(
    user: User,
    offset: number,
    limit: number,
    filter?: string,
    dateCreatedFrom?: string,
    dateCreatedUntil?: string,
  ): Promise<[number, Credential[]]> {
    const dateInThePast = (dateCreatedFrom) ? new Date(dateCreatedFrom) : new Date(null);
    const dateNow = (dateCreatedUntil) ? new Date(dateCreatedUntil) : new Date();

    if (filter && filter !== "") {
      return await this.prismaService.$transaction([
        this.prismaService.credential.count({
          where: {
            OR: [
              { graduatedName: { contains: filter, mode: "insensitive" } },
              { awardingInstitution: { contains: filter, mode: "insensitive" } },
              { qualificationName: { contains: filter, mode: "insensitive" } },
            ],
            AND: [
              { institutionUuid: user.institutionUuid },
              { graduatedAt: { lte: dateNow } },
              { graduatedAt: { gte: dateInThePast } },
            ],
            NOT: { status: { equals: CredentialStatus.DELETED } },
          },
        }),
        this.prismaService.credential.findMany({
          skip: offset,
          take: limit,
          where: {
            OR: [
              { graduatedName: { contains: filter, mode: "insensitive" } },
              { awardingInstitution: { contains: filter, mode: "insensitive" } },
              { qualificationName: { contains: filter, mode: "insensitive" } },
            ],
            AND: [
              { institutionUuid: user.institutionUuid },
              { graduatedAt: { lte: dateNow } },
              { graduatedAt: { gte: dateInThePast } },
            ],
            NOT: { status: { equals: CredentialStatus.DELETED } },
          },
          include: {
            credentialChanges: { orderBy: { createdAt: "desc" } },
            institution: true,
          },
        }),
      ]);
    } else {
      return await this.prismaService.$transaction([
        this.prismaService.credential.count({
          where:{
            OR: [
              { institutionUuid: user.institutionUuid },
            ],
            AND: [
              { graduatedAt: { lte: dateNow } },
              { graduatedAt: { gte: dateInThePast } },
            ],
            NOT: { status: { equals: CredentialStatus.DELETED } },
          },
        }),
        this.prismaService.credential.findMany({
          skip: offset,
          take: limit,
          where:{
            OR: [
              { institutionUuid: user.institutionUuid },
            ],
            AND: [
              { graduatedAt: { lte: dateNow } },
              { graduatedAt: { gte: dateInThePast } },
            ],
            NOT: { status: { equals: CredentialStatus.DELETED } },
          },
          include: {
            credentialChanges: { orderBy: { createdAt: "desc" } },
            institution: true,
          },
        }),
      ]);
    }
  }

  public async getAllNewCredentials(): Promise<CredentialsWithCredentialChange> {
    return await this.prismaService.credential.findMany({
      take: 100,
      where: { status: CredentialStatus.NEW },
      orderBy: { createdAt: "asc" },
      include: { credentialChanges: { take: 1, orderBy: { createdAt: "desc" } } },
    });
  }

  public async getAllUploadingToBlockchainCredentials(): Promise<CredentialsWithCredentialChange> {
    const date = new Date();
    date.setHours(date.getHours() - 1);

    return await this.prismaService.credential.findMany({
      where: {
        AND: [
          { status: CredentialStatus.UPLOADING_TO_BLOCKCHAIN },
          { updatedAt: { lt: date } },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: { credentialChanges: { take: 1, orderBy: { createdAt: "desc" } } },
    });
  }

  public async getAllNotExpired(): Promise<Credential[]> {
    return await this.prismaService.credential.findMany({
      where: {
        NOT: [
          { status: CredentialStatus.EXPIRED },
          { status: CredentialStatus.DELETED },
          { status: CredentialStatus.WITHDRAWN },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
  }

  public async getAllForInstitutionStats(
    institutionUuid: string,
    filter?: string,
    dateCreatedFrom?: string,
    dateCreatedUntil?: string,
  ): Promise<[number, CredentialsWithCredentialChange[]]> {
    const dateInThePast = (dateCreatedFrom) ? new Date(dateCreatedFrom) : new Date(null);
    const dateNow = (dateCreatedUntil) ? new Date(dateCreatedUntil) : new Date();

    if (filter && filter !== "") {
      return await this.prismaService.$transaction([
        this.prismaService.credential.count({
          where: {
            AND: [
              { institutionUuid: institutionUuid },
              { createdAt: { lte: dateNow } },
              { createdAt: { gte: dateInThePast } },
              { qualificationName: { contains: filter, mode: "insensitive" } },
            ],
          },
        }),
        this.prismaService.credential.findMany({
          where: {
            AND: [
              { institutionUuid: institutionUuid },
              { createdAt: { lte: dateNow } },
              { createdAt: { gte: dateInThePast } },
              { qualificationName: { contains: filter, mode: "insensitive" } },
            ],
          },
          include: { credentialChanges: true },
        }),
      ]);
    } else {
      return await this.prismaService.$transaction([
        this.prismaService.credential.count({
          where: {
            AND: [
              { institutionUuid: institutionUuid },
              { createdAt: { lte: dateNow } },
              { createdAt: { gte: dateInThePast } },
            ],
          },
        }),
        this.prismaService.credential.findMany({
          where: {
            AND: [
              { institutionUuid: institutionUuid },
              { createdAt: { lte: dateNow } },
              { createdAt: { gte: dateInThePast } },
            ],
          },
          include: { credentialChanges: true },
        }),
      ]);
    }
  }
}
