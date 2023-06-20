import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from "@nestjs/common";

import { CredentialsShareExpiredException } from "../common/exception";
import { CredentialsShareService } from "./credentials-share.service";
import { CredentialsService } from "./credentials.service";
import { CredentialsPublicViewDto } from "./dto";
import { CredentialsPublicViewDtoFactory } from "./factory/credentials.public-view-dto.factory";
import { CredentialsChangeRepository } from "./repository/credentials-change.repository";
import { CredentialsShareRepository } from "./repository/credentials-share.repository";
import { CredentialsRepository } from "./repository/credentials.repository";

/**
 * This is the API gateway for public endpoints regarding credentials
 */
@Controller("credential")
export class CredentialsPublicController {
  constructor(
      private credentialsService: CredentialsService,
      private credentialsRepository: CredentialsRepository,
      private credentialsShareService: CredentialsShareService,
      private credentialsShareRepository: CredentialsShareRepository,
      private credentialsChangeRepository: CredentialsChangeRepository,
      private credentialsPublicViewDtoFactory: CredentialsPublicViewDtoFactory,
  ) {}

  /**
   * Get credentials view data for access when shared by uuid
   */
  @HttpCode(HttpStatus.OK)
  @Get(":uuid")
  async getCredentialsViewDataByUuid(
      @Param("uuid") uuid: string,
  ): Promise<CredentialsPublicViewDto> {
    const credentials = await this.credentialsRepository.getByUuidWithLastChange(uuid);
    const credentialChange = await this.credentialsChangeRepository.getLastByCredentialsUuid(uuid);
    const credentialsShares = await this.credentialsShareRepository.findAllNotExpiredByCredentialUuid(credentials.uuid);

    if (0 === credentialsShares.length) throw new ForbiddenException("These credentials were not shared");

    return await this.credentialsPublicViewDtoFactory.createFromCredentials(credentials, credentialChange, credentialsShares[0].sharedFields);
  }

  /**
   * Get credentials shared list request
   */
  @HttpCode(HttpStatus.OK)
  @Get("share/:uuid")
  async getCredentialsSharedList(
      @Param("uuid") uuid: string,
      @Query("password") password: string,
  ): Promise<CredentialsPublicViewDto[]> {
    if (! password) throw new ForbiddenException();

    const credentialsShare = await this.credentialsShareRepository.getByUuid(uuid);

    // if expired throw exception
    if (credentialsShare.expiresAt < new Date()) throw new CredentialsShareExpiredException();
    // if password is incorrect throw exception
    if (password !== credentialsShare.temporaryPassword) throw new ForbiddenException();

    const credentialsPublicViewDtoList: CredentialsPublicViewDto[] = [];

    for (const credentialUuid of credentialsShare.credentialUuids) {
      const credentials = await this.credentialsRepository.getByUuid(credentialUuid);
      const credentialChange = await this.credentialsChangeRepository.getLastByCredentialsDid(credentials.did);

      credentialsPublicViewDtoList.push(
        await this.credentialsPublicViewDtoFactory.createFromCredentials(credentials, credentialChange, credentialsShare.sharedFields),
      );
    }

    return credentialsPublicViewDtoList;
  }
}
