import { Inject, Injectable, Logger } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { UserRepository } from "../user/user.repository";

/**
 * Service responsible for unsubscribing from emails
 */
@Injectable()
export class EmailUnsubscribeService {
  constructor(
      @Inject(UserRepository)
      private readonly userRepository: UserRepository,
        private readonly prisma: PrismaService,
  ) {}

  /**
     * Unsubscribe user from email notifications
     */
  public async unsubscribe(userEmail: string): Promise<void> {
    Logger.debug(`Unsubscribing user ${userEmail} from email notifications...`);

    const user = await this.userRepository.get(userEmail);

    await this.prisma.user.update({
      data: { subscribedToEmails: ! user.subscribedToEmails },
      where: { email: userEmail },
    });
  }
}
