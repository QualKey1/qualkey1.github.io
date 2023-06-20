import { Injectable } from "@nestjs/common";
import { UserActionStatus, User, UserActions } from "@prisma/client";

import { ActionNotFoundException } from "../common/exception";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ActionRepository {
  constructor(
        private prisma: PrismaService,
  ) {
  }

  public async getById(id: number): Promise<UserActions> {
    const action = await this.prisma.userActions.findUnique({ where: { id: id } });

    if (! action) throw new ActionNotFoundException(id);

    return action;
  }

  public async getUserActions(user: User): Promise<UserActions[]> {
    return await this.prisma.userActions.findMany({
      where: {
        userUuid: user.uuid,
        status: UserActionStatus.ACTIVE,
      },
      orderBy: { id: "desc" },
    });
  }
}