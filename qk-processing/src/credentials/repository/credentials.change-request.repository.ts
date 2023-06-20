import { Injectable, NotFoundException } from "@nestjs/common";
import { CredentialChangeRequest, CredentialChangeRequestStatus } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CredentialsChangeRequestRepository {
  constructor(
        private prisma: PrismaService,
  ) {
  }

  public async hasActiveByCredentialsUuid(credentialUuid: string): Promise<boolean> {
    const credentialChangeRequest = await this.prisma.credentialChangeRequest.findFirst({
      where: {
        credentialUuid: credentialUuid,
        status: CredentialChangeRequestStatus.PENDING,
      },
    });

    return (null !== credentialChangeRequest);
  }

  public async getByUuid(uuid: string): Promise<CredentialChangeRequest> {
    const credentialChangeRequest = await this.prisma.credentialChangeRequest.findUnique({ where: { uuid: uuid } });

    if (null === credentialChangeRequest) {
      throw new NotFoundException(`There is no such CredentialsChangeRequest: ${uuid}`);
    }

    return credentialChangeRequest;
  }
}