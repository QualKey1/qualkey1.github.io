import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma is the Object-Relational Mapping it helps with linking the Database with the NestJS framework
 */
@Injectable()
export class PrismaService extends PrismaClient {
  userAction: any;
  constructor(config: ConfigService) {
    super({ datasources: { db: { url: config.get("DATABASE_URL") } } });
  }
  
  async cleanDatabase(): Promise<any[]> {
    if (process.env.NODE_ENV === "production") return;
    const models = Reflect.ownKeys(this).filter((key) => key[0] !== "_");
    return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
  }
}