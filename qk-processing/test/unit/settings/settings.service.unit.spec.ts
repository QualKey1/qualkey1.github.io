import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { SystemSettings } from "@prisma/client";

import { PrismaService } from "../../../src/prisma/prisma.service";
import { SettingsService } from "../../../src/settings/settings.service";

describe("SettingsService Unit Test", () => {
  let service: SettingsService;
  let prismaService: PrismaService;
  
  const mockFindUniqueSetting: SystemSettings = {
    id: 0,
    name: "otp.enabled",
    value: "false",
    createdAt: new Date(1652991131 * 1000),
    updatedAt: new Date(1652991131 * 1000),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ SettingsService,
        {
          provide: PrismaService,
          useValue: { systemSettings: { findUnique: jest.fn().mockReturnValue(Promise.resolve(mockFindUniqueSetting)) } },
        },
      ],
    }).compile();
    
    service = module.get<SettingsService>(SettingsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("Should be defined", () => {
    expect(service).toBeDefined();
  });
  
  describe("get() - unit", () => {

    it("Should throw NotFoundException", () => {
      const mock = jest.fn().mockReturnValue(Promise.resolve(null));
      jest
        .spyOn(prismaService.systemSettings, "findUnique")
        .mockImplementationOnce(mock);
      
      expect(async () => await service.get(mockFindUniqueSetting.name)).rejects.toThrowError(
        new NotFoundException(`Setting ${mockFindUniqueSetting.name} not found`),
      );
    });

    it("Should return settings value", async () => {
      expect(await service.get(mockFindUniqueSetting.name)).toBe(mockFindUniqueSetting.value);
    });
  });
});