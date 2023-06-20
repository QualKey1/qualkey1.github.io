import { Injectable } from "@nestjs/common";
import { Institution, Role, UserStatus } from "@prisma/client";

import { InstitutionNotFoundException } from "../../common/exception";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class InstitutionRepository {
  constructor(
        private readonly prisma: PrismaService,
  ) {}

  public async getAll(): Promise<Institution[]> {
    return await this.prisma.institution.findMany();
  }

  public async getByUuid(uuid: string): Promise<Institution> {
    const institution = await this.prisma.institution.findUnique({ where: { uuid: uuid } });
    if (null === institution) throw new InstitutionNotFoundException(uuid);

    return institution;
  }

  public async getByUuidWithRepresentatives(uuid: string): Promise<Institution> {
    const institution = await this.prisma.institution.findUnique({
      where: { uuid: uuid },
      include: { representatives: { where: { status: UserStatus.ACTIVE, role: Role.INSTITUTION_REPRESENTATIVE } } },
    });

    if (null === institution) throw new InstitutionNotFoundException(uuid);

    return institution;
  }
}
