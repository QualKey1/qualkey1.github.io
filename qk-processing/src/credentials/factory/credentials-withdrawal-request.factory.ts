import { Injectable } from "@nestjs/common";
import { CredentialsWithdrawalRequest, User } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CredentialsWithdrawalRequestFactory {
  constructor(
      private prisma: PrismaService,
  ) {
  }

  public async create(credentialsUuid: string, initiatedBy: User, representatives: User[]): Promise<CredentialsWithdrawalRequest> {
    return await this.prisma.credentialsWithdrawalRequest.create({
      data: {
        credentialsUuid: credentialsUuid,
        initiatedBy: initiatedBy.uuid,
        confirmationsRequestedFrom: representatives.map(r => r.uuid),
      },
    });
  }
}