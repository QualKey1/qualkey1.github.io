import { Injectable, Logger } from "@nestjs/common";
import { Role, User, UserStatus } from "@prisma/client";

import { CredentialsDeleteService } from "../credentials/credentials.delete.service";
import { CredentialsRepository } from "../credentials/repository/credentials.repository";
import { EmailService } from "../email/email.service";
import { PrismaService } from "../prisma/prisma.service";

/**
 * Service for working with users
 */
@Injectable()
export class UserService {
  constructor(
       private readonly prisma: PrismaService,
       private readonly credentialsRepository: CredentialsRepository,
       private readonly credentialsDeleteService: CredentialsDeleteService,
       private readonly emailService: EmailService,
  ) {}

  /**
   * This method deletes the user and all user qualifications/credentials in case of a STUDENT
   */
  public async deleteUser(user: User): Promise<void> {
    if (user.role === Role.STUDENT) {
      const credentials = await this.credentialsRepository.getAllForStudent(user);
      for (const credential of credentials) {
        await this.credentialsDeleteService.deleteCredentials(user, credential);
      }
    }

    await this.emptyUserData(user);
  }

  private async emptyUserData(user: User): Promise<void> {
    Logger.debug(`Deleting account ${user.email}...`);
    await this.emailService.sendAccountDeleted(user.email, user.fullName);
    await this.prisma.user.update({
      data: {
        status: UserStatus.DELETED,
        lastLoginAt: null,
        fullName: null,
        stripeCustomerId: null,
        signatureUrl: null,
        title: null,
        subscribedToEmails: false,
      },
      where: { uuid: user.uuid },
    });
    Logger.debug(`Account DELETED ${user.email}`);
  }
}