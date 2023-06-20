import { ForbiddenException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { User, UserActions, UserActionStatus, UserActionType, UserStatus } from "@prisma/client";

import { ActionRepository } from "../../../src/action/action.repository";
import { ActionService } from "../../../src/action/action.service";
import { ActionDecisionDto } from "../../../src/action/dto/action.decision.dto";
import { Decision } from "../../../src/action/enum/decision.enum";
import { LogicException } from "../../../src/common/exception";
import { CredentialsChangeRequestService } from "../../../src/credentials/credentials.change-request.service";
import { CredentialsService } from "../../../src/credentials/credentials.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { UploadService } from "../../../src/upload/upload.service";

describe("ActionService Unit Test", () => {
  let service: ActionService;
  let actionRepository: ActionRepository;
  let uploadService: UploadService;
  let credentialsService: CredentialsService;

  const mockUser: User = {
    uuid: "e7c66694-648e-4195-9558-b27b1a061512",
    email: "email@email.com",
    password: "123",
    role: "INSTITUTION_REPRESENTATIVE",
    createdAt: new Date(1652991260 * 1000),
    updatedAt: new Date(1652991260 * 1000),
    lastLoginAt: new Date(1652991260 * 1000),
    fullName: "",
    institutionUuid: "413989c5-151b-4b18-980c-a5ecf78028dc",
    currency: "",
    stripeCustomerId: "",
    status: UserStatus.ACTIVE,
    signatureUrl: "",
    title: "title",
    subscribedToEmails: true,
  };
  
  const mockGetActionByIdReviewUpload: UserActions = {
    id: 0,
    userUuid: mockUser.uuid,
    initiatorName: "AK",
    type: UserActionType.REVIEW_UPLOAD,
    subjectUuid: "c2699545-6c63-4719-93c9-8a6345ef0bbf",
    credentialsUuid: "413989c5-151b-4b18-980c-a5ecf78028dc",
    createdAt: new Date(1652991260 * 1000),
    status: UserActionStatus.ACTIVE,
  };

  const mockGetActionByIdReviewWithdrawal: UserActions = {
    id: 0,
    userUuid: mockUser.uuid,
    initiatorName: "AK",
    type: UserActionType.REVIEW_WITHDRAWAL,
    subjectUuid: "c2699545-6c63-4719-93c9-8a6345ef0bbf",
    credentialsUuid: "413989c5-151b-4b18-980c-a5ecf78028dc",
    createdAt: new Date(1652991260 * 1000),
    status: UserActionStatus.ACTIVE,
  };

  const mockUserNoMatch: User = {
    uuid: "7ce0026f-6701-4729-9ed1-ac2806634c0c",
    email: "email@email.com",
    password: "123",
    role: "INSTITUTION_REPRESENTATIVE",
    createdAt: new Date(1652991260 * 1000),
    updatedAt: new Date(1652991260 * 1000),
    lastLoginAt: new Date(1652991260 * 1000),
    fullName: "",
    institutionUuid: "413989c5-151b-4b18-980c-a5ecf78028dc",
    currency: "",
    stripeCustomerId: "",
    status: UserStatus.ACTIVE,
    signatureUrl: "",
    title: "title",
    subscribedToEmails: true,
  };
  
  const mockActionDecisionReviewUpload: ActionDecisionDto = {
    actionId: "1",
    subjectUuid: mockGetActionByIdReviewUpload.subjectUuid,
    type: mockGetActionByIdReviewUpload.type,
    decision: Decision.REJECT,
  };

  const mockActionDecisionReviewWithdrawal: ActionDecisionDto = {
    actionId: "1",
    subjectUuid: mockGetActionByIdReviewUpload.subjectUuid,
    type: UserActionType.REVIEW_WITHDRAWAL,
    decision: Decision.REJECT,
  };

  const mockActionSubjectNoMatch: ActionDecisionDto = {
    actionId: "1",
    subjectUuid: "3ce2ce11-18c4-44db-9bba-a260940163b5",
    type: mockGetActionByIdReviewUpload.type,
    decision: Decision.REJECT,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionService, {
        provide: PrismaService,
        useValue: { userActions: { findUnique: jest.fn() } },
      },
      {
        provide: ActionRepository,
        useValue: { getById: jest.fn().mockReturnValue(Promise.resolve(mockGetActionByIdReviewUpload)) },
      },{
        provide: UploadService,
        useValue: { processDecisionForUpload: jest.fn() },
      }, {
        provide: CredentialsService,
        useValue: { processCredentialsWithdrawalDecision: jest.fn() },
      }, {
        provide: CredentialsChangeRequestService,
        useValue: { processCredentialsChangeRequestDecision: jest.fn() },
      }],
    }).compile();

    service = module.get<ActionService>(ActionService);
    actionRepository = module.get<ActionRepository>(ActionRepository);
    uploadService = module.get<UploadService>(UploadService);
    credentialsService = module.get<CredentialsService>(CredentialsService);
  });

  it("Should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("processDecision() - unit", () => {
      
    it("Should throw ForbiddenException if user no match", () => {
      expect(async () => await service.processDecision(mockUserNoMatch, mockActionDecisionReviewUpload)).rejects.toThrowError(
        new ForbiddenException(),
      );
    });
    
    it("Should throw LogicException if action no match", () => {
      expect(async () => await service.processDecision(mockUser, mockActionDecisionReviewWithdrawal)).rejects.toThrowError(
        new LogicException("Action type should match"),
      );
    });

    it("Should throw LogicException if subject no match", () => {
      expect(async () => await service.processDecision(mockUser, mockActionSubjectNoMatch)).rejects.toThrowError(
        new LogicException("Action subject should match"),
      );
    });

    it("Should call processDecisionForUpload if type is REVIEW_UPLOAD", async () => {
      await service.processDecision(mockUser, mockActionDecisionReviewUpload);
      expect(uploadService.processDecisionForUpload).toBeCalledTimes(1);
      expect(uploadService.processDecisionForUpload).toBeCalledWith(
        mockGetActionByIdReviewUpload.subjectUuid, mockUser, mockGetActionByIdReviewUpload.id, mockActionDecisionReviewUpload.decision,
      );
    });
    
    it("Should call processCredentialsWithdrawalDecision if type is REVIEW_WITHDRAWAL", async () => {
      const mock = jest.fn().mockReturnValue(Promise.resolve(mockGetActionByIdReviewWithdrawal));
      jest
        .spyOn(actionRepository, "getById")
        .mockImplementation(mock);

      await service.processDecision(mockUser, mockActionDecisionReviewWithdrawal);
      expect(credentialsService.processCredentialsWithdrawalDecision).toBeCalledTimes(1);
      expect(credentialsService.processCredentialsWithdrawalDecision).toBeCalledWith(
        mockGetActionByIdReviewWithdrawal.subjectUuid, mockUser, mockGetActionByIdReviewWithdrawal.id, mockActionDecisionReviewWithdrawal.decision,
      );
    });
  });
});