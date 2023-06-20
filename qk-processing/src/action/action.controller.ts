import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post, UseGuards,
} from "@nestjs/common";
import { Role, User, UserActions } from "@prisma/client";

import { GetUser } from "../auth/decorator";
import { JwtGuard } from "../auth/guard";
import { ActionRepository } from "./action.repository";
import { ActionService } from "./action.service";
import { ActionDecisionDto } from "./dto/action.decision.dto";

/**
 * Controller for incoming decisions for user actions:
 * APPROVE/REJECT on MASS-UPLOAD, WITHDRAWAL of credentials, CHANGE REQUEST
 */
@Controller("action")
@UseGuards(JwtGuard)
export class ActionController {
  constructor(
        private actionService: ActionService,
        private actionRepository: ActionRepository,
  ) {
  }

    /**
     * Get actions for user
     */
    @Get()
  async getUserActions(
        @GetUser() user: User,
  ): Promise<UserActions[]> {
    if (user.role === Role.INSTITUTION_REPRESENTATIVE) {
      return await this.actionRepository.getUserActions(user);
    } else if (user.role === Role.STUDENT) {
      return [];
    } else throw new ForbiddenException();
  }

    /**
     * POST decision on user action
     */
    @HttpCode(HttpStatus.OK)
    @Post()
    async postDecisionOnUserAction(
        @GetUser() user: User,
        @Body() dto: ActionDecisionDto,
    ): Promise<void> {
      if (user.role !== Role.INSTITUTION_REPRESENTATIVE) throw new ForbiddenException();

      await this.actionService.processDecision(user, dto);
    }
}
