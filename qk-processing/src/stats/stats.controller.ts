import { Controller, ForbiddenException, Get, Query, UseGuards } from "@nestjs/common";
import { Role, User, InstitutionStats } from "@prisma/client";

import { GetUser } from "../auth/decorator";
import { JwtGuard } from "../auth/guard";
import { StatsGetRequestDto } from "./dto";
import { StatsService } from "./stats.service";

/**
 * Controller for returning stats gathered by Qualkey
 */
@Controller("stats")
@UseGuards(JwtGuard)
export class StatsController {
  constructor(
       private readonly statsService: StatsService,
  ) {}

    /**
     * Return stats for the institution
     */
    @Get()
  public async getStatsForUniversity(
        @GetUser() user: User,
        @Query() dto: StatsGetRequestDto,
  ): Promise<InstitutionStats> {
    if (user.role !== Role.INSTITUTION_REPRESENTATIVE) {
      throw new ForbiddenException();
    }

    return await this.statsService.getStatsForUniversity(user, dto.filter, dto.dateCreatedFrom, dto.dateCreatedUntil);
  }
}
