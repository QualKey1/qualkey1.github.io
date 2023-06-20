import { UnprocessableEntityException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { User, UserStatus } from "@prisma/client";
import { response } from "express";

import { AuthService } from "../../../src/auth/auth.service";
import {
  AuthCheckCredentialsRequestDto,
  AuthOtpRequestDto,
  AuthRequestDto, ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
} from "../../../src/auth/dto";
import { RouteProvider } from "../../../src/auth/provider";
import { UserNotFoundException } from "../../../src/common/exception";
import { PrismaService } from "../../../src/prisma/prisma.service";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("bcryptjs");

describe("AuthService Unit Test", () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let routeProvider: RouteProvider;
  
  const mockLogin: AuthRequestDto = {
    email: "email@email.com",
    password: "123",
    otp: "9101",
    otpUuid: "baa3261d-b36a-4d5d-9f26-5fce27321df8",
    rememberMe: false,
  };
  
  const mockLoginOtp: AuthOtpRequestDto = {
    email: "email@email.com",
    otp: "9101",
    otpUuid: "baa3261d-b36a-4d5d-9f26-5fce27321df8",
  };
  
  const mockAuth: AuthCheckCredentialsRequestDto = {
    email: "email@email.com",
    password: "123",
  };
  
  const mockResetPassword: ResetPasswordRequestDto = {
    oldPassword: "123",
    newPassword: "321",
  };
  
  const mockForgotPassword: ForgotPasswordRequestDto = {
    email: "email@email.com",
    newPassword: "321",
  };
  
  const mockUser: User = {
    uuid: "e7c66694-648e-4195-9558-b27b1a061512",
    email: "email@email.com",
    password: "123",
    role: "STUDENT",
    createdAt: new Date(1652991260 * 1000),
    updatedAt: new Date(1652991260 * 1000),
    lastLoginAt: null,
    fullName: "A K",
    institutionUuid: "413989c5-151b-4b18-980c-a5ecf78028dc",
    currency: "",
    stripeCustomerId: "",
    status: UserStatus.ACTIVE,
    signatureUrl: "",
    title: "title",
    subscribedToEmails: true,
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ConfigService, RouteProvider, {
        provide: PrismaService,
        useValue: {
          user: {
            update: jest.fn(),
            findUnique: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
          },
        },
      }, {
        provide: JwtService,
        useValue: { signAsync: jest.fn(), verify: jest.fn() },
      },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    routeProvider = module.get<RouteProvider>(RouteProvider);
  });

  it("Should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("login() - unit", () => {

    it("Should login user", async () => {
      const bcryptReturnMatch = jest.fn().mockReturnValue(Promise.resolve(true));
      jest
        .spyOn(bcrypt, "compareSync")
        .mockImplementationOnce(bcryptReturnMatch);

      const responseSetCookies = jest.fn();
      jest
        .spyOn(response, "cookie")
        .mockImplementation(responseSetCookies);
      
      jest
        .spyOn(routeProvider, "onLogin");

      await service.login(mockLogin, response);
      expect(await prismaService.user.update).toBeCalledTimes(1);
      expect(routeProvider.onLogin).toBeCalledWith(mockUser);
      expect(routeProvider.onLogin(mockUser)).toEqual("/dashboard");
    });

    it("Should throw UnprocessableEntityException if user not found", () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(null));
      jest
        .spyOn(prismaService.user, "findUnique")
        .mockImplementationOnce(mockPrismaFindUnique);

      expect(async () => await service.login(mockLogin, response)).rejects.toThrowError(
        new UnprocessableEntityException("Invalid credentials"),
      );
    });
    
    it("Should throw UnprocessableEntityException if password no match", () => {
      const bcryptReturnNoMatch = jest.fn().mockReturnValue(Promise.resolve(false));
      jest
        .spyOn(bcrypt, "compareSync")
        .mockImplementationOnce(bcryptReturnNoMatch);
      
      expect(async () => await service.login(mockLogin, response)).rejects.toThrow(
        new UnprocessableEntityException("Invalid credentials"),
      );
    });
  });
  
  describe("loginOtp() - unit", () => {

    it("Should login user with OTP", async () => {
      await service.loginOtp(mockLoginOtp, response);
      expect(routeProvider.onLogin(mockUser)).toEqual("/dashboard");
    });

    it("Should throw UserNotFoundException if user not found", () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(null));
      jest
        .spyOn(prismaService.user, "findUnique")
        .mockImplementationOnce(mockPrismaFindUnique);
      
      expect(async () => service.loginOtp(mockLoginOtp, response)).rejects.toThrowError(
        new UserNotFoundException(mockLoginOtp.email),
      );
    });
  });
  
  describe("checkCredentials() - unit", () => {
    it("Should throw UnprocessableEntityException if user not found", () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(null));
      jest
        .spyOn(prismaService.user, "findUnique")
        .mockImplementationOnce(mockPrismaFindUnique);
      
      expect(async () => service.checkCredentials(mockAuth)).rejects.toThrowError(
        new UnprocessableEntityException("Invalid credentials"),
      );
    });
    it("Should throw UnprocessableEntityException if password no match", () => {
      const bcryptReturnNoMatch = jest.fn().mockReturnValue(Promise.resolve(false));
      jest
        .spyOn(bcrypt, "compareSync")
        .mockImplementationOnce(bcryptReturnNoMatch);

      expect(async () => service.checkCredentials(mockAuth)).rejects.toThrowError(
        new UnprocessableEntityException("Invalid credentials"),
      );
    });
  });
  
  describe("logout() - unit", () => {
    it("Should logout user and redirect to /", async () => {
      const result = await service.logout(response);
      expect(await service.logout(response)).toEqual(result);
    });
  });

  describe("resetPassword() - unit", () => {
    
    it("Should encrypt password and save new", async () => {
      const bcryptReturnNoMatch = jest.fn().mockReturnValue(Promise.resolve(true));
      jest
        .spyOn(bcrypt, "compareSync")
        .mockImplementationOnce(bcryptReturnNoMatch);
      
      await service.resetPassword(mockResetPassword, mockAuth.email, response);
      expect(await prismaService.user.update).toBeCalledTimes(1);
    });
    
    it("Should throw UserNotFoundException", () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(null));
      jest
        .spyOn(prismaService.user, "findUnique")
        .mockImplementationOnce(mockPrismaFindUnique);
      
      expect(async () => await service.resetPassword(mockResetPassword, mockAuth.email, response)).rejects.toThrowError(
        new UserNotFoundException(mockAuth.email),
      );
    });
    
    it("Should throw UnprocessableEntityException", () => {
      const bcryptReturnNoMatch = jest.fn().mockReturnValue(Promise.resolve(false));
      jest
        .spyOn(bcrypt, "compareSync")
        .mockImplementationOnce(bcryptReturnNoMatch);
      
      expect(async () => await service.resetPassword(mockResetPassword, mockAuth.email, response)).rejects.toThrowError(
        new UnprocessableEntityException("Wrong password"),
      );
    });
  });
  
  describe("forgotPassword() - unit", () => {
    it("Should encrypt password and save new", async () => {
      const bcryptReturnNoMatch = jest.fn().mockReturnValue(Promise.resolve(true));
      jest
        .spyOn(bcrypt, "compareSync")
        .mockImplementationOnce(bcryptReturnNoMatch);

      await service.forgotPassword(mockForgotPassword);
      expect(await prismaService.user.update).toBeCalledTimes(1);
    });
    it("Should throw UserNotFoundException if user not found", () => {
      const mockPrismaFindUnique = jest.fn().mockReturnValue(Promise.resolve(null));
      jest
        .spyOn(prismaService.user, "findUnique")
        .mockImplementationOnce(mockPrismaFindUnique);

      expect(async () => await service.forgotPassword(mockForgotPassword)).rejects.toThrowError(
        new UserNotFoundException(mockAuth.email),
      );
    });
  });
});