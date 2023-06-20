import { InjectQueue } from "@nestjs/bull";
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  PreconditionFailedException,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  CredentialStatus,
  CredentialsWithdrawalRequest, Role,
  User,
  UserActionStatus,
  UserActionType, UserStatus,
} from "@prisma/client";
import { Queue } from "bull";

import { Decision } from "../action/enum/decision.enum";
import { LogicException } from "../common/exception";
import { PrismaService } from "../prisma/prisma.service";
import { CredentialsWithdrawalApprovedEvent, CredentialsWithdrawalRejectedEvent } from "./event";
import { CredentialsWithdrawalRequestFactory } from "./factory/credentials-withdrawal-request.factory";
import { CredentialsRepository } from "./repository/credentials.repository";
import { CredentialsWithdrawalRequestRepository } from "./repository/credentials.withdrawal-request.repository";

/**
 * Master class for the work related to credentials
 */
@Injectable()
export class CredentialsService {
  constructor(
    @InjectQueue("credentials-notify") private credentialsNotifyQueue: Queue,
    private readonly prisma: PrismaService,
    private readonly credentialsRepository: CredentialsRepository,
    private readonly credentialsWithdrawalRequestRepository: CredentialsWithdrawalRequestRepository,
    private readonly credentialsWithdrawalRequestFactory: CredentialsWithdrawalRequestFactory,
    private readonly eventEmitter: EventEmitter2,
  ) {
  }

  public async createCredentialsWithdrawalRequest(uuid: string, initiatedBy: User): Promise<CredentialsWithdrawalRequest> {
    if (await this.credentialsWithdrawalRequestRepository.hasCredentialsUuid(uuid)) {
      throw new ConflictException("Withdrawal request already exists");
    }

    const credentials = await this.prisma.credential.findUnique({ where: { uuid: uuid } });
    if (! credentials) throw new NotFoundException("credentials not found");

    // Check if credentials can be withdrawn by initiator
    if (credentials.institutionUuid !== initiatedBy.institutionUuid) throw new ForbiddenException();
    // Check if credentials can be withdrawn by initiator
    if (credentials.status === CredentialStatus.WITHDRAWN) throw new PreconditionFailedException("Already WITHDRAWN");

    const institution = await this.prisma.institution.findUnique({
      where: { uuid: initiatedBy.institutionUuid },
      include: { representatives: { where: { status: UserStatus.ACTIVE, role: Role.INSTITUTION_REPRESENTATIVE } } },
    });
    if (! institution) throw new NotFoundException("institution not found");

    const representatives = institution.representatives.filter(r => r.uuid !== initiatedBy.uuid);

    const credentialsWithdrawalRequest = await this.credentialsWithdrawalRequestFactory.create(uuid, initiatedBy, representatives);
    Logger.debug("credentials withdrawal request CREATED");

    if (0 !== representatives.length) {
      for (const representative of representatives) {
        await this.prisma.userActions.create({
          data: {
            userUuid: representative.uuid,
            initiatorName: (initiatedBy.fullName).trim(),
            type: UserActionType.REVIEW_WITHDRAWAL,
            subjectUuid: credentialsWithdrawalRequest.uuid,
            credentialsUuid: credentials.uuid,
          },
        });
      }
      // Notify representatives about withdrawal request
      representatives.forEach((user: User) => {
        Logger.debug(`Dispatching ${user.uuid}`);
        this.credentialsNotifyQueue.add("withdrawal-request-created", {
          representativeUuid: user.uuid,
          representativeEmail: user.email,
          representativeFullName: user.fullName,
          credentialUuid: credentials.uuid,
        });
      });
    } else {
      // If there are no representatives besides initiator - Approve Withdrawal
      const credentialsWithdrawalApprovedEvent = new CredentialsWithdrawalApprovedEvent();
      credentialsWithdrawalApprovedEvent.credentials = await this.credentialsRepository.getByUuid(credentialsWithdrawalRequest.credentialsUuid);
      credentialsWithdrawalApprovedEvent.withdrawalRequest = credentialsWithdrawalRequest;
      credentialsWithdrawalApprovedEvent.representatives = institution.representatives;
      this.eventEmitter.emit("credentials.withdrawal.approved", credentialsWithdrawalApprovedEvent);
    }

    return credentialsWithdrawalRequest;
  }

  /**
   * Process user decision regarding the credentials withdrawal
   */
  public async processCredentialsWithdrawalDecision(
    uuid: string,
    decisionMadeBy: User,
    actionId: number,
    decision: Decision,
  ): Promise<void> {
    const isApproved = decision === Decision.APPROVE;

    if (isApproved) {
      await this.approveWithdrawal(uuid, decisionMadeBy, actionId);
    } else {
      await this.rejectWithdrawal(uuid, decisionMadeBy);
    }
  }

  /**
   * Process approval for the the credentials withdrawal
   */
  private async approveWithdrawal(uuid: string, approvedBy: User, actionId: number): Promise<void> {
    const credentialsWithdrawalRequest = await this.getCheckedCredentialsWithdrawalRequest(uuid, approvedBy);
    const requestedFrom = credentialsWithdrawalRequest.confirmationsRequestedFrom;

    let confirmedBy = [];
    // add approve
    if (0 === credentialsWithdrawalRequest.confirmedBy.length) {
      await this.prisma.credentialsWithdrawalRequest.update({
        data: { confirmedBy: approvedBy.uuid },
        where: { uuid: uuid },
      });

      confirmedBy.push(approvedBy.uuid);
    } else {
      confirmedBy = credentialsWithdrawalRequest.confirmedBy;
      if (confirmedBy.includes(approvedBy.uuid)) throw new LogicException("Already approved.");

      confirmedBy.push(approvedBy.uuid);

      await this.prisma.credentialsWithdrawalRequest.update({
        data: { confirmedBy: confirmedBy.map(uuid => uuid) },
        where: { uuid: uuid },
      });
    }
    await this.prisma.userActions.update({
      data: { status: UserActionStatus.DECISION_MADE },
      where: { id: actionId },
    });

    // if all approved emit CredentialsWithdrawalApprovedEvent
    if (confirmedBy.length === requestedFrom.length) {
      const institution = await this.prisma.institution.findUnique({
        where: { uuid: approvedBy.institutionUuid },
        include: { representatives: { where: { status: UserStatus.ACTIVE, role: Role.INSTITUTION_REPRESENTATIVE } } },
      });
      if (! institution) throw new NotFoundException("institution not found");

      const credentialsWithdrawalApprovedEvent = new CredentialsWithdrawalApprovedEvent();
      credentialsWithdrawalApprovedEvent.credentials = await this.credentialsRepository.getByUuid(credentialsWithdrawalRequest.credentialsUuid);
      credentialsWithdrawalApprovedEvent.withdrawalRequest = credentialsWithdrawalRequest;
      credentialsWithdrawalApprovedEvent.representatives = institution.representatives;
      this.eventEmitter.emit("credentials.withdrawal.approved", credentialsWithdrawalApprovedEvent);
    }
  }

  /**
   * Process reject for the the credentials withdrawal
   */
  private async rejectWithdrawal(uuid: string, rejectedBy: User): Promise<void> {
    const credentialsWithdrawalRequest = await this.getCheckedCredentialsWithdrawalRequest(uuid, rejectedBy);

    // Update all userActions for this withdrawal request change status to DECISION_MADE
    await this.prisma.userActions.updateMany({
      data: { status: UserActionStatus.DECISION_MADE },
      where: {
        subjectUuid: uuid,
        type: UserActionType.REVIEW_WITHDRAWAL,
      },
    });

    const institution = await this.prisma.institution.findUnique({
      where: { uuid: rejectedBy.institutionUuid },
      include: { representatives: { where: { status: UserStatus.ACTIVE, role: Role.INSTITUTION_REPRESENTATIVE } } },
    });
    if (! institution) throw new NotFoundException("institution not found");

    const credentialsWithdrawalRejectedEvent = new CredentialsWithdrawalRejectedEvent();
    credentialsWithdrawalRejectedEvent.credentials = await this.credentialsRepository.getByUuid(credentialsWithdrawalRequest.credentialsUuid);
    credentialsWithdrawalRejectedEvent.withdrawalRequest = credentialsWithdrawalRequest;
    credentialsWithdrawalRejectedEvent.representatives = institution.representatives;
    this.eventEmitter.emit("credentials.withdrawal.rejected", credentialsWithdrawalRejectedEvent);
  }

  /**
   * Verifies CredentialsWithdrawalRequest exists and action can be made by user
   */
  public async getCheckedCredentialsWithdrawalRequest(uuid: string, actionMadeBy: User): Promise<CredentialsWithdrawalRequest> {
    const credentialsWithdrawalRequest = await this.credentialsWithdrawalRequestRepository.getByUuid(uuid);

    if (! credentialsWithdrawalRequest.confirmationsRequestedFrom.includes(actionMadeBy.uuid)) throw new ForbiddenException();

    return credentialsWithdrawalRequest;
  }
}
