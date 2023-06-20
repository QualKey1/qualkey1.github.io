import { ForbiddenException, Logger, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Test, TestingModule } from "@nestjs/testing";
import { Upload, UploadStatus, User, UserActions, UserActionStatus, UserStatus } from "@prisma/client";

import { Decision } from "../../../src/action/enum/decision.enum";
import { LogicException } from "../../../src/common/exception";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { UploadFailedException } from "../../../src/upload/exception";
import { UploadService } from "../../../src/upload/upload.service";

describe("UploadService Unit Test", () => {
  let service: UploadService;
  let prismaService: PrismaService;
  let eventEmitter: EventEmitter2;

  const mockUploadData = {
    filename: "file.xlsx",
    originalFilename: "filename-original.xlsx",
    mapping: "value,value1,,,value2,value3,,,value4",
  };

  const mockInstitutionRepresentatives: User[] = [
    {
      uuid: "e7c66694-648e-4195-9558-b27b1a061512",
      email: "email@email.com",
      password: "123",
      role: "INSTITUTION_REPRESENTATIVE",
      status: UserStatus.ACTIVE,
      createdAt: new Date(1652991260 * 1000),
      updatedAt: new Date(1652991260 * 1000),
      lastLoginAt: new Date(1652991260 * 1000),
      fullName: "",
      institutionUuid: "413989c5-151b-4b18-980c-a5ecf78028dc",
      currency: "",
      stripeCustomerId: "",
      signatureUrl: "",
      title: "title",
      subscribedToEmails: true,
    },
    {
      uuid: "a4f9a145-4a59-46fb-accb-fadc009cd553",
      email: "email1@email.com",
      password: "123",
      role: "INSTITUTION_REPRESENTATIVE",
      status: UserStatus.ACTIVE,
      createdAt: new Date(1652991260 * 1000),
      updatedAt: new Date(1652991260 * 1000),
      lastLoginAt: new Date(1652991260 * 1000),
      fullName: "",
      institutionUuid: "413989c5-151b-4b18-980c-a5ecf78028dc",
      currency: "",
      stripeCustomerId: "",
      signatureUrl: "",
      title: "title",
      subscribedToEmails: true,
    },
    {
      uuid: "a4f9a145-4a59-46fb-accb-fadc009cd554",
      email: "email2@email.com",
      password: "123",
      role: "INSTITUTION_REPRESENTATIVE",
      status: UserStatus.ACTIVE,
      createdAt: new Date(1652991260 * 1000),
      updatedAt: new Date(1652991260 * 1000),
      lastLoginAt: new Date(1652991260 * 1000),
      fullName: "",
      institutionUuid: "413989c5-151b-4b18-980c-a5ecf78028dc",
      currency: "",
      stripeCustomerId: "",
      signatureUrl: "",
      title: "title",
      subscribedToEmails: true,
    },
  ];

  const mockInstitution = {
    uuid: "413989c5-151b-4b18-980c-a5ecf78028dc",
    status: "ACTIVE",
    emailDomain: "qk",
    logoUrl: "",
    name: "Oxy",
    createdAt: new Date(1652991260 * 1000),
    updatedAt: new Date(1652991260 * 1000),
    representatives: mockInstitutionRepresentatives,
    mapping: [{ "qualkeyName": "graduatedFullName", "originalColumnName": "Full_Name" }, { "originalColumnName": "Date of Birth" }, { "qualkeyName": "awardLevel", "originalColumnName": "Award Level" }, { "qualkeyName": "expiresAt", "originalColumnName": "Expiration Date" }, { "qualkeyName": "studyLanguage", "originalColumnName": "Language" }, { "qualkeyName": "qualificationLevel", "originalColumnName": "Level of Qualification" }, { "qualkeyName": "info", "originalColumnName": "Other Information" }, { "qualkeyName": "qualificationName", "originalColumnName": "Qualification_Name" }, { "qualkeyName": "awardingInstitution", "originalColumnName": "School_Name" }, { "qualkeyName": "majors", "originalColumnName": "Specialization" }, { "qualkeyName": "email", "originalColumnName": "Student Email" }, { "originalColumnName": "Student ID" }, { "originalColumnName": "Student Password" }, { "qualkeyName": "graduatedAt", "originalColumnName": "Study_Graduation Date" }, { "qualkeyName": "studyStartedAt", "originalColumnName": "Study_Start" }, { "qualkeyName": "studyEndedAt", "originalColumnName": "Study_End" }],
  };

  const mockInstitutionOneRepresentative = {
    uuid: "413989c5-151b-4b18-980c-a5ecf78028dc",
    status: "ACTIVE",
    emailDomain: "qk",
    logoUrl: "",
    name: "Oxy",
    createdAt: new Date(1652991260 * 1000),
    updatedAt: new Date(1652991260 * 1000),
    representatives: [mockInstitutionRepresentatives[0]],
    mapping: [{ "qualkeyName": "graduatedFullName", "originalColumnName": "Full_Name" }, { "originalColumnName": "Date of Birth" }, { "qualkeyName": "awardLevel", "originalColumnName": "Award Level" }, { "qualkeyName": "expiresAt", "originalColumnName": "Expiration Date" }, { "qualkeyName": "studyLanguage", "originalColumnName": "Language" }, { "qualkeyName": "qualificationLevel", "originalColumnName": "Level of Qualification" }, { "qualkeyName": "info", "originalColumnName": "Other Information" }, { "qualkeyName": "qualificationName", "originalColumnName": "Qualification_Name" }, { "qualkeyName": "awardingInstitution", "originalColumnName": "School_Name" }, { "qualkeyName": "majors", "originalColumnName": "Specialization" }, { "qualkeyName": "email", "originalColumnName": "Student Email" }, { "originalColumnName": "Student ID" }, { "originalColumnName": "Student Password" }, { "qualkeyName": "graduatedAt", "originalColumnName": "Study_Graduation Date" }, { "qualkeyName": "studyStartedAt", "originalColumnName": "Study_Start" }, { "qualkeyName": "studyEndedAt", "originalColumnName": "Study_End" }],
  };

  const mockUploadedBy: User = {
    uuid: mockInstitutionRepresentatives[0].uuid,
    email: "email@email.com",
    password: "123",
    role: "INSTITUTION_REPRESENTATIVE",
    status: UserStatus.ACTIVE,
    createdAt: new Date(1652991260 * 1000),
    updatedAt: new Date(1652991260 * 1000),
    lastLoginAt: new Date(1652991260 * 1000),
    fullName: "",
    institutionUuid: "413989c5-151b-4b18-980c-a5ecf78028dc",
    currency: "",
    stripeCustomerId: "",
    signatureUrl: "",
    title: "title",
    subscribedToEmails: true,
  };

  const mockUpload: Upload = {
    uuid: "b96d5e2f-47e1-4b93-944a-ade81a78886c",
    filename: "b96d5e2f-47e1-4b93-944a-ade81a78886c.csv",
    originalFilename: "filename-original.csv",
    mapping: "email,expiresAt,gpaFinalGrade,graduatedName,graduatedAt,qualificationLevel,studyEndedAt,qualificationName,studyStartedAt,,,,,,,",
    status: UploadStatus.PENDING,
    uploadedBy: mockInstitutionRepresentatives[0].uuid,
    confirmationsRequestedFrom: [mockInstitutionRepresentatives[1].uuid, mockInstitutionRepresentatives[2].uuid],
    confirmedBy: [],
    createdAt: new Date(1652991260 * 1000),
    updatedAt: new Date(1652991260 * 1000),
  };

  const mockUploadApproved: Upload = {
    uuid: "b96d5e2f-47e1-4b93-944a-ade81a78886c",
    filename: "b96d5e2f-47e1-4b93-944a-ade81a78886c.csv",
    originalFilename: "filename-original.csv",
    mapping: "email,expiresAt,gpaFinalGrade,graduatedName,graduatedAt,qualificationLevel,studyEndedAt,qualificationName,studyStartedAt,,,,,,,",
    status: UploadStatus.APPROVED,
    uploadedBy: mockInstitutionRepresentatives[0].uuid,
    confirmationsRequestedFrom: [mockInstitutionRepresentatives[1].uuid, mockInstitutionRepresentatives[2].uuid],
    confirmedBy: [],
    createdAt: new Date(1652991260 * 1000),
    updatedAt: new Date(1652991260 * 1000),
  };

  const mockUploadApprovedByUser: Upload = {
    uuid: "b96d5e2f-47e1-4b93-944a-ade81a78886d",
    filename: "b96d5e2f-47e1-4b93-944a-ade81a78886c.csv",
    originalFilename: "filename-original.csv",
    mapping: "email,expiresAt,gpaFinalGrade,graduatedName,graduatedAt,qualificationLevel,studyEndedAt,qualificationName,studyStartedAt,,,,,,,",
    status: UploadStatus.PENDING,
    uploadedBy: mockInstitutionRepresentatives[0].uuid,
    confirmationsRequestedFrom: [mockInstitutionRepresentatives[1].uuid, mockInstitutionRepresentatives[2].uuid],
    confirmedBy: [mockInstitutionRepresentatives[1].uuid],
    createdAt: new Date(1652991260 * 1000),
    updatedAt: new Date(1652991260 * 1000),
  };

  const mockUserActions: UserActions[] = [
    {
      id: 1,
      userUuid: mockInstitutionRepresentatives[1].uuid,
      initiatorName: "Alex Abrams",
      type: "REVIEW_UPLOAD",
      subjectUuid: mockUpload.uuid,
      createdAt: new Date(1652991260 * 1000),
      credentialsUuid: "",
      status: UserActionStatus.ACTIVE,
    },
  ];

  const mockDecisionMadeAction: UserActions[] = [{
    id: 1,
    userUuid: mockInstitutionRepresentatives[1].uuid,
    initiatorName: "Alex Abrams",
    type: "REVIEW_UPLOAD",
    subjectUuid: mockUpload.uuid,
    createdAt: new Date(1652991260 * 1000),
    credentialsUuid: "",
    status: UserActionStatus.DECISION_MADE,
  }];

  const mockSuccessUploadEvent = {
    representatives: [mockInstitutionRepresentatives[1], mockInstitutionRepresentatives[2]],
    upload: mockUpload,
  };

  const mockFailedUploadEvent = {
    filename: mockUploadData.filename,
    uploadedBy: mockUploadedBy.uuid,
  };

  const mockUploadApproveEvent = {
    upload: mockUploadApprovedByUser,
    representatives: mockInstitutionRepresentatives,
    approvedBy: mockInstitutionRepresentatives[2],
  };

  const mockUploadRejectEvent = {
    upload: mockUpload,
    representatives: mockInstitutionRepresentatives,
    rejectedBy: mockInstitutionRepresentatives[1],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventEmitter2, UploadService, {
        provide: PrismaService,
        useValue: {
          institution: { findUnique: jest.fn().mockReturnValue(Promise.resolve(mockInstitution)) },
          upload: {
            findUnique: jest.fn().mockReturnValue(Promise.resolve(mockUpload)),
            create: jest.fn().mockReturnValue(Promise.resolve(mockUpload)),
            update: jest.fn(),
          },
          userActions: {
            findMany: jest.fn().mockReturnValue(mockUserActions),
            update: jest.fn().mockReturnValue(mockDecisionMadeAction),
            updateMany: jest.fn().mockReturnValue(mockDecisionMadeAction),
            create: jest.fn(),
          },
        },
      }],
    }).compile();

    service = module.get<UploadService>(UploadService);
    prismaService = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it("Should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("processUpload() - unit", () => {

    it("Should emit upload.success event and create user action", async () => {
      jest
        .spyOn(eventEmitter, "emit");

      await service.processUpload(mockUploadData.filename, mockUploadData.originalFilename, mockUploadedBy);
      expect(await prismaService.upload.create).toBeCalledTimes(1);
      expect(await eventEmitter.emit).toBeCalledWith("upload.succeeded", mockSuccessUploadEvent);
    });

    it("Should emit two events (success, approved) if there are no more representatives", async () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(mockInstitutionOneRepresentative));
      jest
        .spyOn(prismaService.institution, "findUnique")
        .mockImplementation(mockPrismaFindUnique);

      jest
        .spyOn(eventEmitter, "emit");

      await service.processUpload(mockUploadData.filename, mockUploadData.originalFilename, mockUploadedBy);
      expect(await prismaService.upload.create).toBeCalledTimes(1);
      expect(await eventEmitter.emit).toBeCalledTimes(2);
    });

    it("Should throw NotFoundException and emit upload.failed if institution not found", async () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(null));
      jest
        .spyOn(prismaService.institution, "findUnique")
        .mockImplementation(mockPrismaFindUnique);

      jest
        .spyOn(eventEmitter, "emit");
      
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(Logger, "error").mockImplementation(() => {});

      await expect(async () => service.processUpload(mockUploadData.filename, mockUploadData.originalFilename, mockUploadedBy)).rejects.toThrowError(
        new NotFoundException(`Upload failed for file ${mockUploadData.filename}: institution not found`),
      );
      expect(await eventEmitter.emit).toBeCalledWith("upload.failed", mockFailedUploadEvent);
      await expect(async () => service.processUpload(mockUploadData.filename, mockUploadData.originalFilename, mockUploadedBy)).rejects.toThrowError(
        new UploadFailedException(mockUploadData.filename, "institution not found"),
      );
    });
  });

  describe("approveUpload() - unit", () => {

    it("Should check if user did not approve yet", async () => {
      await service.processDecisionForUpload(mockUpload.uuid, mockInstitutionRepresentatives[1], 1, Decision.APPROVE);
      expect(await prismaService.upload.update).toBeCalledTimes(1);
      expect(await prismaService.userActions.update).toBeCalledTimes(1);
    });

    it("Should throw LogicException if upload already approved", async () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(mockUploadApprovedByUser));
      jest
        .spyOn(prismaService.upload, "findUnique")
        .mockImplementation(mockPrismaFindUnique);

      await expect(async () => await service.processDecisionForUpload(mockUploadApprovedByUser.uuid, mockInstitutionRepresentatives[1], 1, Decision.APPROVE)).rejects.toThrowError(
        new LogicException("Already approved."),
      );
    });

    it("Should emit upload.approved event if everybody approved", async () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(mockUploadApprovedByUser));
      jest
        .spyOn(prismaService.upload, "findUnique")
        .mockImplementation(mockPrismaFindUnique);
      jest
        .spyOn(eventEmitter, "emit");

      await service.processDecisionForUpload(mockUpload.uuid, mockInstitutionRepresentatives[2], 1, Decision.APPROVE);
      expect(await eventEmitter.emit).toBeCalledWith("upload.approved", mockUploadApproveEvent);
    });
  });

  describe("rejectUpload() - unit", () => {

    it("Should emit upload.rejected event if at least one representative rejected", async () => {
      jest
        .spyOn(eventEmitter, "emit");

      await service.processDecisionForUpload(mockUpload.uuid, mockInstitutionRepresentatives[1], 1, Decision.REJECT);
      expect(await eventEmitter.emit).toBeCalledWith("upload.rejected", mockUploadRejectEvent);
    });

    it("Should throw NotFoundException if institution not found", () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(null));
      jest
        .spyOn(prismaService.institution, "findUnique")
        .mockImplementation(mockPrismaFindUnique);

      expect(async () => await service.processDecisionForUpload(mockUpload.uuid, mockInstitutionRepresentatives[1], 1, Decision.REJECT)).rejects.toThrowError(
        new NotFoundException("institution not found"),
      );
    });
  });

  describe("getCheckedUpload() - unit", () => {

    it("Should check if upload is valid and return it", async () => {
      const result = await service.getCheckedUpload(mockUpload.uuid, mockInstitutionRepresentatives[1]);
      expect(await service.getCheckedUpload(mockUpload.uuid, mockInstitutionRepresentatives[1])).toBe(result);
    });

    it("Should throw NotFoundException if upload not found", () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(null));
      jest
        .spyOn(prismaService.upload, "findUnique")
        .mockImplementation(mockPrismaFindUnique);

      expect(async () => await service.getCheckedUpload(mockUpload.uuid, mockInstitutionRepresentatives[0])).rejects.toThrowError(
        new NotFoundException("upload not found"),
      );
    });

    it("Should throw LogicException if wrong upload status", () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(mockUploadApproved));
      jest
        .spyOn(prismaService.upload, "findUnique")
        .mockImplementation(mockPrismaFindUnique);

      expect(async () => await service.getCheckedUpload(mockUploadApproved.uuid, mockInstitutionRepresentatives[0])).rejects.toThrowError(
        new LogicException("Wrong upload status."),
      );
    });

    it("Should throw ForbiddenException if user without permissions is trying to approve", () => {
      expect(async () => await service.getCheckedUpload(mockUploadApproved.uuid, mockInstitutionRepresentatives[0])).rejects.toThrowError(
        new ForbiddenException(),
      );
    });
  });
});