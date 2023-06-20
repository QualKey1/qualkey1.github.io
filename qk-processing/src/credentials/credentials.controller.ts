import {
  Body,
  Controller, Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post, PreconditionFailedException,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  Credential,
  CredentialChangeRequest,
  CredentialChange,
  CredentialShare,
  CredentialStatus,
  CredentialsWithdrawalRequest,
  Role,
  User,
} from "@prisma/client";

import { GetUser } from "../auth/decorator";
import { JwtGuard } from "../auth/guard";
import { CredentialsChangeService } from "./credentials-change.service";
import { CredentialsShareService } from "./credentials-share.service";
import { CredentialsChangeRequestService } from "./credentials.change-request.service";
import { CredentialsDeleteService } from "./credentials.delete.service";
import { CredentialsService } from "./credentials.service";
import {
  CredentialsWithdrawalRequestDto,
  CredentialsShareRequestDto,
  CredentialsGetRequestDto,
  CredentialsChangeGetRequestDto, CredentialsGetSharesRequestDto,
} from "./dto";
import { CredentialsRequestChangeDto } from "./dto/credentials.request-change.dto";
import { CredentialsChangeRepository } from "./repository/credentials-change.repository";
import { CredentialsShareRepository } from "./repository/credentials-share.repository";
import { CredentialsRepository } from "./repository/credentials.repository";

/**
 * This is the API gateway for credentials, all requests regarding credentials come here
 */
@Controller("credential")
@UseGuards(JwtGuard)
export class CredentialsController {
  constructor(
      private credentialsService: CredentialsService,
      private credentialsRepository: CredentialsRepository,
      private credentialsShareService: CredentialsShareService,
      private credentialsShareRepository: CredentialsShareRepository,
      private credentialsChangeService: CredentialsChangeService,
      private credentialsChangeRepository: CredentialsChangeRepository,
      private credentialsChangeRequestService: CredentialsChangeRequestService,
      private credentialsDeleteService: CredentialsDeleteService,
  ) {}

  /**
   * Get credentials endpoint
   */
    @Get()
  async getCredentials(
      @GetUser() user: User,
      @Query() dto: CredentialsGetRequestDto,
  ): Promise<Credential[]|[number, Credential[]]>{
    if (dto.uuid) {
      const credentials = await this.credentialsRepository.getByUuidWithChanges(dto.uuid);

      if (user.role === Role.STUDENT && user.uuid !== credentials.studentUuid) {
        throw new ForbiddenException();
      }
      if (user.role === Role.INSTITUTION_REPRESENTATIVE && user.institutionUuid !== credentials.institutionUuid) {
        throw new ForbiddenException();
      }

      return [credentials];
    }
    if (user.role === Role.STUDENT) {
      return this.credentialsRepository.getAllForStudent(user, dto.filter);
    }
    if (user.role === Role.INSTITUTION_REPRESENTATIVE) {
      return this.credentialsRepository.getAllForInstitution(user, dto.offset, dto.limit, dto.filter, dto.dateCreatedFrom, dto.dateCreatedUntil);
    }

    throw new ForbiddenException();
  }

  /**
   * Post credentials withdrawal request
   */
  @HttpCode(HttpStatus.OK)
  @Post("withdraw")
    async postCredentialsWithdrawalRequest(
      @GetUser() user: User,
      @Body() dto: CredentialsWithdrawalRequestDto,
    ): Promise<CredentialsWithdrawalRequest> {
      if (user.role !== Role.INSTITUTION_REPRESENTATIVE) throw new ForbiddenException();
      return await this.credentialsService.createCredentialsWithdrawalRequest(dto.uuid, user);
    }

  /**
   * Post credentials share request
   */
  @HttpCode(HttpStatus.OK)
  @Post("share")
  async postCredentialsShare(
      @GetUser() user: User,
      @Body() dto: CredentialsShareRequestDto,
  ): Promise<CredentialShare> {
    if (dto.isPublic && 1 === dto.uuids.length) {
      if (await this.credentialsShareRepository.hasPublicByCredentialUuid(dto.uuids[0])) return;
    } else {
      const userShares = await this.credentialsShareRepository.findAllByUser(user);

      if (userShares.length > 0) {
        // add 1 minute to the last share creation date
        const canBeSharedAt = new Date(userShares[0].createdAt.getTime() + 60000);

        if (canBeSharedAt > new Date()) {
          throw new PreconditionFailedException("It is possible to share once per minute");
        }
      }
    }
    const credentialsList: Credential[] = [];

    for (const uuid of dto.uuids) {
      const credentials = await this.credentialsRepository.getByUuid(uuid);

      if (user.uuid !== credentials.studentUuid) {
        throw new ForbiddenException("You can share only your own credentials");
      }

      if (credentials.status !== CredentialStatus.ACTIVATED) {
        throw new PreconditionFailedException("Please activate credentials in order to share it");
      }

      credentialsList.push(credentials);
    }

    return await this.credentialsShareService.processCredentialsShare(dto, credentialsList, user);
  }

  /**
   * Get credentials shares request
   */
  @HttpCode(HttpStatus.OK)
  @Get("share")
  async getCredentialsShares(
      @GetUser() user: User,
      @Query() dto: CredentialsGetSharesRequestDto,
  ): Promise<CredentialShare[]> {
    if (null === dto.credentialUuid) {
      return await this.credentialsShareRepository.findAllByUser(user);
    }

    return await this.credentialsShareRepository.findAllByUserAndCredentialUuid(user, dto.credentialUuid);
  }

  /**
   * Get credentials view data for access when shared
   */
  @HttpCode(HttpStatus.OK)
  @Get(":did/view")
  async getCredentialsViewData(
      @GetUser() user: User,
      @Param("did") did: string,
  ): Promise<Credential> {
    const credentials = await this.credentialsRepository.getByDidWithLastChange(did);

    if (user.uuid !== credentials.studentUuid) throw new ForbiddenException();
    return credentials;
  }

  /**
   * Get credentialChange endpoint
   */
  @HttpCode(HttpStatus.OK)
  @Get("change")
  async getCredentialChange(@GetUser() user: User, @Query() dto: CredentialsChangeGetRequestDto): Promise<CredentialChange> {
    return await this.credentialsChangeRepository.getById(dto.id);
  }

  /**
   * Post credentialChange endpoint
   */
  @HttpCode(HttpStatus.OK)
  @Post("change")
  async postCredentialChange(
      @GetUser() user: User,
      @Body() dto: CredentialsRequestChangeDto,
  ): Promise<CredentialChange> {
    if (user.role !== Role.INSTITUTION_REPRESENTATIVE) throw new ForbiddenException();

    const credentials = await this.credentialsRepository.getByUuid(dto.uuid);

    if (user.institutionUuid !== credentials.institutionUuid) {
      throw new ForbiddenException(`You can change only credentials issued by your institution.`);
    }

    for (const change of dto.changedTo) {
      if (change === "" || change === null) {
        throw new PreconditionFailedException(`Data you change TO can not be empty`);
      }
    }

    return await this.credentialsChangeService.processCredentialChange(user, credentials, dto.changedTo, dto.fieldName);
  }

  /**
   * Post credentialChangeRequest endpoint
   */
  @HttpCode(HttpStatus.OK)
  @Post("request-change")
  async postCredentialChangeRequest(
      @GetUser() user: User,
      @Body() dto: CredentialsRequestChangeDto,
  ): Promise<CredentialChangeRequest> {
    if (user.role !== Role.STUDENT) throw new ForbiddenException();

    const credentials = await this.credentialsRepository.getByUuid(dto.uuid);

    if (user.uuid !== credentials.studentUuid) {
      throw new ForbiddenException("You can request to change only your own credentials");
    }

    return await this.credentialsChangeRequestService.createChangeRequest(credentials, dto);
  }

  /**
   * Delete credentials endpoint
   */
  @HttpCode(HttpStatus.OK)
  @Delete(":uuid")
  async deleteCredentials(
      @GetUser() user: User,
      @Param("uuid") uuid: string,
  ): Promise<void> {
    if (user.role !== Role.STUDENT) throw new ForbiddenException();

    const credentials = await this.credentialsRepository.getByUuid(uuid);

    if (user.uuid !== credentials.studentUuid) {
      throw new ForbiddenException("You can delete only your own credentials");
    }

    await this.credentialsDeleteService.deleteCredentials(user, credentials);
  }
}
