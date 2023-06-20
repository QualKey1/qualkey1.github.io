
import { ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import {
  Credential,
  CredentialChangeRequest,
  CredentialChangeRequestStatus,
  User,
  UserActionType,
  UserStatus,
  UserActionStatus, Role,
} from "@prisma/client";

import { Decision } from "../action/enum/decision.enum";
import { CredentialsChangeRequestAlreadyCreatedException, LogicException } from "../common/exception";
import { PrismaService } from "../prisma/prisma.service";
import { UserRepository } from "../user/user.repository";
import { CredentialsChangeService } from "./credentials-change.service";
import { CredentialsRequestChangeDto } from "./dto/credentials.request-change.dto";
import { CredentialsChangeRequestRepository } from "./repository/credentials.change-request.repository";
import { CredentialsRepository } from "./repository/credentials.repository";

/**
 * Master class for working with credentialsChangeRequests
 */
@Injectable()
export class CredentialsChangeRequestService {
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly credentialsChangeRequestRepository: CredentialsChangeRequestRepository,
    private readonly prisma: PrismaService,
    private readonly userRepository: UserRepository,
    private readonly credentialsChangeService: CredentialsChangeService,
  ) {}

  /**
   * Create changeRequest for credentials, save to DB and create userActions
   */
  public async createChangeRequest(credentials: Credential, dto: CredentialsRequestChangeDto): Promise<CredentialChangeRequest> {
    if (await this.credentialsChangeRequestRepository.hasActiveByCredentialsUuid(credentials.uuid)) {
      throw new CredentialsChangeRequestAlreadyCreatedException(credentials.uuid);
    }

    const changedFrom = [];
    for (const field of dto.fieldName) {
      changedFrom.push(credentials[field]);
    }

    const institution = await this.prisma.institution.findUnique({
      where: { uuid: credentials.institutionUuid },
      include: { representatives: { where: { status: UserStatus.ACTIVE, role: Role.INSTITUTION_REPRESENTATIVE } } },
    });
    if (! institution) throw new NotFoundException("institution not found");

    const credentialChangeRequest = await this.prisma.credentialChangeRequest.create({
      data: {
        credentialUuid: credentials.uuid,
        requestedBy: credentials.studentUuid,
        confirmationRequestedFrom: institution.representatives.map(r => r.uuid),
        changeFrom: changedFrom,
        changeTo: dto.changedTo,
        fieldName: dto.fieldName,
      },
    });
    Logger.debug(`CredentialsChangeRequest created ${credentialChangeRequest.uuid}`);

    for (const representative of institution.representatives) {
      await this.prisma.userActions.create({
        data: {
          userUuid: representative.uuid,
          initiatorName: credentials.graduatedName.trim(),
          type: UserActionType.REVIEW_CHANGE_REQUEST,
          subjectUuid: credentialChangeRequest.uuid,
          credentialsUuid: credentials.uuid,
        },
      });

      // Send email with credentials change request to representative DISABLED
    }

    return credentialChangeRequest;
  }

  /**
   * Process user decision regarding the credentials change request
   */
  public async processCredentialsChangeRequestDecision(
    uuid: string,
    decisionMadeBy: User,
    decision: Decision,
  ): Promise<void> {
    const isApproved = decision === Decision.APPROVE;

    if (isApproved) {
      await this.approveChangeRequest(uuid, decisionMadeBy);
    } else {
      await this.rejectChangeRequest(uuid, decisionMadeBy);
    }
  }

  /**
     * Process approval for the the credentials change request
     */
  private async approveChangeRequest(uuid: string, approvedBy: User): Promise<void> {
    const changeRequest = await this.getCheckedCredentialChangeRequest(uuid, approvedBy);

    if (changeRequest.status !== CredentialChangeRequestStatus.PENDING) {
      throw new LogicException(`ChangeRequest ${changeRequest.uuid} already ${changeRequest.status}`);
    }

    await this.updateStatus(uuid, approvedBy, CredentialChangeRequestStatus.APPROVED);

    await this.prisma.userActions.updateMany({
      data: { status: UserActionStatus.DECISION_MADE },
      where: {
        subjectUuid: uuid,
        status: UserActionStatus.ACTIVE,
      },
    });

    const credentials = await this.credentialsRepository.getByUuid(changeRequest.credentialUuid);

    // Start Update of the Credentials
    await this.credentialsChangeService.processCredentialChange(
      approvedBy,
      credentials,
      changeRequest.changeTo,
      changeRequest.fieldName,
    );
  }

  /**
     * Process reject for the the credentials change request
     */
  private async rejectChangeRequest(uuid: string, rejectedBy: User): Promise<void> {
    const changeRequest = await this.getCheckedCredentialChangeRequest(uuid, rejectedBy);

    if (changeRequest.status !== CredentialChangeRequestStatus.PENDING) {
      throw new LogicException(`ChangeRequest ${changeRequest.uuid} already ${changeRequest.status}`);
    }

    await this.updateStatus(uuid, rejectedBy, CredentialChangeRequestStatus.REJECTED);

    await this.prisma.userActions.updateMany({
      data: { status: UserActionStatus.DECISION_MADE },
      where: {
        subjectUuid: uuid,
        status: UserActionStatus.ACTIVE,
      },
    });

    // Send email with notification to a student DISABLED
  }

  /**
   * Verifies CredentialChangeRequest exists and action can be made by user
   */
  public async getCheckedCredentialChangeRequest(uuid: string, actionMadeBy: User): Promise<CredentialChangeRequest> {
    const changeRequest = await this.credentialsChangeRequestRepository.getByUuid(uuid);

    if (! changeRequest.confirmationRequestedFrom.includes(actionMadeBy.uuid)) throw new ForbiddenException();

    return changeRequest;
  }

  private async updateStatus(uuid: string, approvedBy: User, status: CredentialChangeRequestStatus): Promise<void> {
    await this.prisma.credentialChangeRequest.update({
      data: {
        confirmedBy: approvedBy.uuid,
        status: status,
      },
      where: { uuid: uuid },
    });
  }
}