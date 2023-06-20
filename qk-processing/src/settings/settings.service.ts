import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {
  }

  public async get(name: string): Promise<string> {
    const setting = await this.prisma.systemSettings.findUnique({ where: { name: name } });

    if (null === setting) throw new NotFoundException(`Setting ${name} not found`);

    return setting.value;
  }
}
