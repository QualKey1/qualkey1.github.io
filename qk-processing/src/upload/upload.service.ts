import { ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Upload, UploadStatus, User, UserStatus, UserActionType, UserActionStatus, Role } from "@prisma/client";

import { Decision } from "../action/enum/decision.enum";
import { LogicException } from "../common/exception";
import { InstitutionHelper } from "../institution/helper/institution.helper";
import { PrismaService } from "../prisma/prisma.service";
import { UploadSucceededEvent, UploadFailedEvent, UploadApprovedEvent, UploadRejectedEvent } from "./event";
import { UploadFailedException } from "./exception";

/**
 * Master class for the work related to mass-upload
 */
@Injectable()
export class UploadService {
  constructor(
      private prisma: PrismaService,
      private eventEmitter: EventEmitter2,
  ) {}

  /**
   * This function gets everything needed for creation of the Upload Value Object
   * It creates and saves the Upload VO as entry in the database if successful
   * Or throws exception in case something went wrong
   */
  async processUpload(filename: string, originalFilename: string, uploadedBy: User): Promise<void> {
    try {
      const institution = await this.prisma.institution.findUnique({
        where: { uuid: uploadedBy.institutionUuid },
        include: { representatives: { where: { status: UserStatus.ACTIVE, role: Role.INSTITUTION_REPRESENTATIVE } } },
      });
      if (! institution) throw new NotFoundException("institution not found");

      const representatives = institution.representatives.filter(r => r.uuid !== uploadedBy.uuid);

      const upload = await this.prisma.upload.create({
        data: {
          uuid: filename.split(".")[0],
          filename: filename,
          originalFilename: originalFilename,
          mapping: InstitutionHelper.getQualkeyNamesMapping(institution).join(","),
          uploadedBy: uploadedBy.uuid,
          confirmationsRequestedFrom: representatives.map(r => r.uuid),
        },
      });

      const uploadSucceededEvent = new UploadSucceededEvent();
      uploadSucceededEvent.upload = upload;
      uploadSucceededEvent.representatives = representatives;
      this.eventEmitter.emit("upload.succeeded", uploadSucceededEvent);

      //  If there is no other representatives - Approve upload right away
      if (0 === representatives.length) {
        const uploadApprovedEvent = new UploadApprovedEvent();
        uploadApprovedEvent.upload = upload;
        uploadApprovedEvent.representatives = [];
        uploadApprovedEvent.approvedBy = uploadedBy;
        uploadApprovedEvent.institution = institution;
        this.eventEmitter.emit("upload.approved", uploadApprovedEvent);

        return;
      }

      for (const representative of representatives) {
        await this.prisma.userActions.create({
          data: {
            userUuid: representative.uuid,
            initiatorName: (uploadedBy.fullName).trim(),
            type: UserActionType.REVIEW_UPLOAD,
            subjectUuid: upload.uuid,
          },
        });
      }
    } catch (e) {
      Logger.error(e);

      const uploadFailedEvent = new UploadFailedEvent();
      uploadFailedEvent.filename = filename;
      uploadFailedEvent.uploadedBy = uploadedBy.uuid;
      this.eventEmitter.emit("upload.failed", uploadFailedEvent);

      throw new UploadFailedException(filename, e.message);
    }
  }

  /**
   * Process user decision regarding the mass-upload
   */
  public async processDecisionForUpload(uuid: string, decisionMadeBy: User, actionId: number, decision: Decision): Promise<void> {
    const isApproved = decision === Decision.APPROVE;

    if (isApproved) {
      await this.approveUpload(uuid, decisionMadeBy, actionId);
    } else {
      await this.rejectUpload(uuid, decisionMadeBy);
    }
  }

  /**
   * Process approval of the mass-upload from the institution representative
   */
  private async approveUpload(uuid: string, approvedBy: User, actionId: number): Promise<void> {
    const upload = await this.getCheckedUpload(uuid, approvedBy);
    const requestedFrom = upload.confirmationsRequestedFrom;

    let confirmedBy = [];
    // Add approve
    if (0 === upload.confirmedBy.length) {
      await this.prisma.upload.update({
        data: { confirmedBy: approvedBy.uuid },
        where: { uuid: uuid },
      });
      confirmedBy.push(approvedBy.uuid);
    } else {
      confirmedBy = upload.confirmedBy;
      if (confirmedBy.includes(approvedBy.uuid)) throw new LogicException("Already approved.");

      confirmedBy.push(approvedBy.uuid);

      await this.prisma.upload.update({
        data: { confirmedBy: confirmedBy.map(uuid => uuid) },
        where: { uuid: uuid },
      });
    }

    await this.prisma.userActions.update({
      data: { status: UserActionStatus.DECISION_MADE },
      where: { id: actionId },
    });

    // if all approved emit UploadApprovedEvent
    if (confirmedBy.length === requestedFrom.length) {
      const institution = await this.prisma.institution.findUnique({
        where: { uuid: approvedBy.institutionUuid },
        include: { representatives: { where: { status: UserStatus.ACTIVE, role: Role.INSTITUTION_REPRESENTATIVE } } },
      });
      if (! institution) throw new NotFoundException("institution not found");

      const uploadApprovedEvent = new UploadApprovedEvent();
      uploadApprovedEvent.upload = upload;
      uploadApprovedEvent.representatives = institution.representatives;
      uploadApprovedEvent.approvedBy = approvedBy;
      uploadApprovedEvent.institution = institution;
      this.eventEmitter.emit("upload.approved", uploadApprovedEvent);
    }
  }

  /**
   * Process rejection of the mass-upload from the institution representative
   */
  private async rejectUpload(uuid: string, rejectedBy: User): Promise<void> {
    const upload = await this.getCheckedUpload(uuid, rejectedBy);

    // Update all userActions for this upload and change status to DECISION_MADE
    await this.prisma.userActions.updateMany({
      data: { status: UserActionStatus.DECISION_MADE },
      where: {
        type: UserActionType.REVIEW_UPLOAD,
        subjectUuid: uuid,
      },
    });

    const institution = await this.prisma.institution.findUnique({
      where: { uuid: rejectedBy.institutionUuid },
      include: { representatives: { where: { status: UserStatus.ACTIVE, role: Role.INSTITUTION_REPRESENTATIVE } } },
    });
    if (! institution) throw new NotFoundException("institution not found");

    const uploadRejectedEvent = new UploadRejectedEvent();
    uploadRejectedEvent.upload = upload;
    uploadRejectedEvent.rejectedBy = rejectedBy;
    uploadRejectedEvent.representatives = institution.representatives;
    this.eventEmitter.emit("upload.rejected", uploadRejectedEvent);
  }

  /**
   * Verifies upload exists and is in the correct status
   */
  public async getCheckedUpload(uuid: string, actionMadeBy: User): Promise<Upload> {
    // Get upload from DB
    const upload = await this.prisma.upload.findUnique({ where: { uuid: uuid } });
    if (! upload) throw new NotFoundException("upload not found");

    // check status
    if (upload.status !== UploadStatus.PENDING) throw new LogicException("Wrong upload status.");

    const requestedFrom = upload.confirmationsRequestedFrom;
    if (! requestedFrom.includes(actionMadeBy.uuid)) throw new ForbiddenException();

    return upload;
  }
}
