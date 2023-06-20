import { GoneException, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { OneTimePassword, User, SystemSettings, UserStatus } from "@prisma/client";

import { OtpResponseDto } from "../../../src/auth/dto";
import { OtpService } from "../../../src/auth/otp.service";
import { UserNotFoundException } from "../../../src/common/exception";
import { EmailService } from "../../../src/email/email.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { SettingsService } from "../../../src/settings/settings.service";

describe("OtpService Unit Test", () => {
  let service: OtpService;
  let emailService: EmailService;
  let prismaService: PrismaService;
  let systemSettings: SettingsService;
  
  const otpMock: OneTimePassword = {
    uuid: "baa3261d-b36a-4d5d-9f26-5fce27321df8",
    code: "3540",
    validUntil: new Date(1752996087 * 1000),
    canBeResentAt: new Date(1652991260 * 1000),
  };

  const otpMockExpired: OneTimePassword = {
    uuid: "baa3261d-b36a-4d5d-9f26-5fce27321df8",
    code: "3540",
    validUntil: new Date(1652991131 * 1000),
    canBeResentAt: new Date(1652991260 * 1000),
  };
  
  const userMockFindUnique: User = {
    uuid: "e7c66694-648e-4195-9558-b27b1a061512",
    email: "email@email.com",
    password: "123",
    role: "STUDENT",
    createdAt: new Date(1652991260 * 1000),
    updatedAt: new Date(1652991260 * 1000),
    lastLoginAt: null,
    fullName: "A K",
    institutionUuid: "413989c5-151b-4b18-980c-a5ecf78028dc",
    currency: "GBP",
    stripeCustomerId: null,
    status: UserStatus.ACTIVE,
    signatureUrl: "",
    title: "title",
    subscribedToEmails: true,
  };
  
  const systemSettingsMock: SystemSettings = {
    id: 0,
    name: "otp.enabled",
    value: "true",
    createdAt: new Date(1652991260 * 1000),
    updatedAt: new Date(1652991260 * 1000),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpService, SettingsService, {
        provide: PrismaService,
        useValue: {
          oneTimePassword: {
            findUnique: jest.fn().mockReturnValue(Promise.resolve(otpMock)),
            create: jest.fn().mockReturnValue(Promise.resolve(otpMock)),
            delete: jest.fn(),
          }, 
          user: { findUnique: jest.fn().mockReturnValue(Promise.resolve(userMockFindUnique)) },
          systemSettings: { findUnique: jest.fn().mockReturnValue(Promise.resolve(systemSettingsMock)) },
        },
      },
      {
        provide: EmailService,
        useValue: { sendOtpEmail: jest.fn() }, 
      },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
    prismaService = module.get<PrismaService>(PrismaService);
    emailService = module.get<EmailService>(EmailService);
    systemSettings = module.get<SettingsService>(SettingsService);
  });

  it("Should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("sendOtp() - unit", () => {

    it("Should send email and return OtpResponseDto", async () => {
      jest
        .spyOn(systemSettings, "get");
      
      await service.sendOtp(userMockFindUnique.email, 1);
      expect(emailService.sendOtpEmail).toBeCalledTimes(1);
      expect(emailService.sendOtpEmail).toBeCalledWith(userMockFindUnique.email, otpMock.code, userMockFindUnique.fullName);
      expect(await service.sendOtp(userMockFindUnique.email, 1)).toEqual(
        new OtpResponseDto(otpMock.uuid, otpMock.validUntil, otpMock.canBeResentAt),
      );
    });

    it("Should throw UserNotFoundException if user not found", () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(null));
      jest
        .spyOn(prismaService.user, "findUnique")
        .mockImplementation(mockPrismaFindUnique);
      
      expect(async () => await service.sendOtp(userMockFindUnique.email, 1)).rejects.toThrowError(
        new UserNotFoundException(userMockFindUnique.email),
      );
    });
  });

  describe("checkOtp() - unit", () => {

    it("Should check if code is correct", async () => {
      await service.checkOtp(otpMock.code, otpMock.uuid);
      expect(prismaService.oneTimePassword.delete).toBeCalledTimes(1);
    });

    it("Should throw NotFoundException if code not found", () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(null));
      jest
        .spyOn(prismaService.oneTimePassword, "findUnique")
        .mockImplementation(mockPrismaFindUnique);

      expect(async () => await service.checkOtp(otpMock.code, otpMock.uuid)).rejects.toThrowError(
        new NotFoundException("code not found"),
      );
    });

    it("Should throw GoneException if code expired", () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(otpMockExpired));
      jest
        .spyOn(prismaService.oneTimePassword, "findUnique")
        .mockImplementation(mockPrismaFindUnique);
      
      expect(async () => await service.checkOtp(otpMockExpired.code, otpMockExpired.uuid)).rejects.toThrowError(
        new GoneException("code expired"),
      );
    });

    it("Should throw UnprocessableEntityException if code incorrect", () => {
      expect(async () => await service.checkOtp("0000", otpMock.uuid)).rejects.toThrowError(
        new UnprocessableEntityException("incorrect code"),
      );
    });
  });
});