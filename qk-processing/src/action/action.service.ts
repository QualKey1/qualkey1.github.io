import { ForbiddenException, Injectable, NotImplementedException } from "@nestjs/common";
import { User, UserActionType } from "@prisma/client";

import { LogicException } from "../common/exception";
import { CredentialsChangeRequestService } from "../credentials/credentials.change-request.service";
import { CredentialsService } from "../credentials/credentials.service";
import { UploadService } from "../upload/upload.service";
import { ActionRepository } from "./action.repository";
import { ActionDecisionDto } from "./dto/action.decision.dto";

@Injectable()
export class ActionService {
  constructor(
        private actionRepository: ActionRepository,
        private uploadService: UploadService,
        private credentialsService: CredentialsService,
        private credentialsChangeRequestService: CredentialsChangeRequestService,
  ) {
  }

  /**
     * Process decision for action function
     */
  public async processDecision(user: User, dto: ActionDecisionDto): Promise<void> {
    const action = await this.actionRepository.getById(+dto.actionId);
    // Check if action belongs to user and validate Dto
    if (action.userUuid !== user.uuid) throw new ForbiddenException();
    if (action.type !== dto.type) throw new LogicException("Action type should match");
    if (action.subjectUuid !== dto.subjectUuid) throw new LogicException("Action subject should match");
    // Process decision according to action type
    switch (action.type) {
    case UserActionType.REVIEW_UPLOAD:
      await this.uploadService.processDecisionForUpload(action.subjectUuid, user, action.id, dto.decision);
      break;
    case UserActionType.REVIEW_WITHDRAWAL:
      await this.credentialsService.processCredentialsWithdrawalDecision(action.subjectUuid, user, action.id, dto.decision);
      break;
    case UserActionType.REVIEW_CHANGE_REQUEST:
      await this.credentialsChangeRequestService.processCredentialsChangeRequestDecision(action.subjectUuid, user, dto.decision);
      break;
    default:
      throw new NotImplementedException(action.type);
    }
  }
}
