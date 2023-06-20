import { Injectable } from "@nestjs/common";
import { Upload } from "@prisma/client";

import { UploadNotFoundException } from "../../common/exception";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UploadRepository {
  constructor(
        private readonly prisma: PrismaService,
  ) {}

  public async getByUuid(uuid: string): Promise<Upload> {
    const upload = await this.prisma.upload.findUnique({ where: { uuid: uuid } });
    if (null === upload) throw new UploadNotFoundException(uuid);

    return upload;
  }
}