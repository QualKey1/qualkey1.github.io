import { AdminModule, AdminModuleOptions } from "@adminjs/nestjs";
import { Database, Resource } from "@adminjs/prisma";
import uploadFeature from "@adminjs/upload";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { BullModule } from "@nestjs/bull";
import { Logger, MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { CredentialStatus, Role } from "@prisma/client";
import { DMMFClass } from "@prisma/client/runtime";
import * as Sentry from "@sentry/node";
import AdminJS, { buildFeature, CurrentAdmin } from "adminjs";
import * as bcrypt from "bcryptjs";
import { CommandModule } from "nestjs-command";
import { StripeModule } from "nestjs-stripe";

import { ActionModule } from "./action/action.module";
import { AuthModule } from "./auth/auth.module";
import { AwsModule } from "./aws/aws.module";
import { CredentialsModule } from "./credentials/credentials.module";
import { EmailModule } from "./email/email.module";
import { EmailService } from "./email/email.service";
import { HealthModule } from "./health/health.module";
import { HederaModule } from "./hedera/hedera.module";
import { InstitutionModule } from "./institution/institution.module";
import { InstitutionRepository } from "./institution/repository/institution.repository";
import { PaymentModule } from "./payment/payment.module";
import { PrismaModule } from "./prisma/prisma.module";
import { PrismaService } from "./prisma/prisma.service";
import { SentryModule } from "./sentry/sentry.module";
import { SettingsModule } from "./settings/settings.module";
import { StatsModule } from "./stats/stats.module";
import { UploadModule } from "./upload/upload.module";
import { UserModule } from "./user/user.module";
import "@sentry/tracing";

AdminJS.registerAdapter({ Database, Resource });

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env.local", ".env"] }),
    EventEmitterModule.forRoot({ maxListeners: 15 }),
    AuthModule,
    UserModule,
    PrismaModule,
    CredentialsModule,
    // TODO: Move admin module to separate file
    AdminModule.createAdminAsync({
      imports: [PrismaModule, AwsModule, EmailModule, InstitutionModule],
      inject: [PrismaService, EmailService, ConfigService, InstitutionRepository],
      useFactory: async (
        prisma: PrismaService,
        emailService: EmailService,
        config: ConfigService,
        institutionRepository: InstitutionRepository,
      ): Promise<AdminModuleOptions> => {
        const dmmf = ((prisma as any)._dmmf as DMMFClass);
        return {
          adminJsOptions: {
            rootPath: "/admin",
            resources: [
              {
                resource: { model: dmmf.modelMap.User, client: prisma },
                options: {
                  editProperties: ["email", "role", "status", "fullName", "institution", "title", "signature"],
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }): boolean => {
                        return currentAdmin && ( currentAdmin.role === Role.SUPER_ADMIN );
                      }, 
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }): boolean => {
                        return currentAdmin && ( currentAdmin.role === Role.SUPER_ADMIN );
                      }, 
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }): boolean => {
                        return currentAdmin && ( currentAdmin.role === Role.SUPER_ADMIN );
                      }, 
                    },
                    bulkDelete: { isAccessible: false },
                  },
                },
                features: [
                  uploadFeature({
                    provider: {
                      aws: {
                        region: config.get("AWS_REGION"),
                        bucket: config.get("AWS_S3_BUCKET_PUBLIC"),
                        accessKeyId: config.get("AWS_ACCESS_KEY_ID"),
                        secretAccessKey: config.get("AWS_SECRET_ACCESS_KEY"),
                        expires: 0,
                      },
                    },
                    properties: {
                      file: "signature",
                      filename: "signatureFile",
                      filePath: "signatureFilePath",
                      filesToDelete: "signatureFileToDelete",
                      key: "signatureUrl", // to this db field feature will safe S3 key
                      mimeType: "signatureFileMime", // this property is important because allows to have previews
                    },
                    validation: { mimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/svg"] },
                  }),
                  buildFeature({
                    actions: {
                      new: {
                        after: async (response) => {
                          // get first 8 chars of the generated password
                          const len = response.record.params.password.length;
                          const password = response.record.params.password.substring(len - 8, len);

                          Logger.warn(password);
                          // encrypt password and save
                          await prisma.user.update({
                            data: { password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) },
                            where: { email: response.record.params.email },
                          });

                          // send notification email
                          if (response.record.params.role === Role.INSTITUTION_REPRESENTATIVE) {
                            const institution = await institutionRepository.getByUuid(response.record.params.institution);

                            await emailService.sendWelcomeRepresentativeEmail(
                              response.record.params.email,
                              response.record.params.fullName,
                              password,
                              institution.name,
                            );
                          } else if (response.record.params.role === Role.STUDENT) {
                            const institution = await institutionRepository.getByUuid(response.record.params.institution);

                            await emailService.sendWelcomeUserEmail(
                              response.record.params.email,
                              response.record.params.fullName,
                              password,
                              institution.name,
                            );
                          } else if (response.record.params.role === Role.SUPER_ADMIN || response.record.params.role === Role.ADMIN) {
                            await emailService.sendWelcomeUserAdminEmail(
                              response.record.params.email,
                              response.record.params.fullName,
                              password,
                            );
                          }

                          return response;
                        },
                      },
                    },
                  }),
                ],
              },
              {
                resource: { model: dmmf.modelMap.Institution, client: prisma },
                features: [
                  uploadFeature({
                    provider: {
                      aws: {
                        region: config.get("AWS_REGION"),
                        bucket: config.get("AWS_S3_BUCKET_PUBLIC"),
                        accessKeyId: config.get("AWS_ACCESS_KEY_ID"),
                        secretAccessKey: config.get("AWS_SECRET_ACCESS_KEY"),
                        expires: 0,
                      },
                    },
                    properties: {
                      file: "logo",
                      filename: "logoFile",
                      filePath: "logoFilePath",
                      filesToDelete: "logoFileToDelete",
                      key: "logoUrl", // to this db field feature will safe S3 key
                      mimeType: "logoFileMime", // this property is important because allows to have previews
                    },
                    validation: { mimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/svg"] },
                  }),
                  uploadFeature({
                    provider: {
                      aws: {
                        region: config.get("AWS_REGION"),
                        bucket: config.get("AWS_S3_BUCKET_PUBLIC"),
                        accessKeyId: config.get("AWS_ACCESS_KEY_ID"),
                        secretAccessKey: config.get("AWS_SECRET_ACCESS_KEY"),
                        expires: 0,
                      },
                    },
                    properties: {
                      file: "stamp",
                      filename: "stampFile",
                      filePath: "stampFilePath",
                      filesToDelete: "stampFileToDelete",
                      key: "stampUrl", // to this db field feature will safe S3 key
                      mimeType: "stampFileMime", // this property is important because allows to have previews
                    },
                    validation: { mimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/svg"] },
                  }),
                  buildFeature({
                    actions: {
                      new: {
                        after: async (response) => {
                          // create institution stats as well
                          const institutionUuid = response.record.params.uuid;
                          Logger.debug(`Creating InstitutionStats for institution ${institutionUuid}...`);
                          await prisma.institutionStats.create({ data: { institutionUuid: institutionUuid } });

                          return response;
                        },
                      },
                    },
                  }),
                ],
                options: {
                  properties: {
                    mapping: { type: "mixed", isArray: true, draggable: true },
                    "mapping.qualkeyName": {
                      type: "string",
                      isArray: false,
                      isRequired: false,
                      description: "Qualkey field names",
                      availableValues: [
                        {
                          label: "Graduated Full Name",
                          value: "graduatedFullName",
                        },
                        {
                          label: "Graduated First Name",
                          value: "graduatedFirstName",
                        },
                        {
                          label: "Graduated Last Name",
                          value: "graduatedLastName",
                        },
                        {
                          label: "Graduated Middle Name",
                          value: "graduatedMiddleName",
                        },
                        {
                          label: "Award Level",
                          value: "awardLevel",
                        },
                        {
                          label: "Expires At",
                          value: "expiresAt",
                        },
                        {
                          label: "Study Language",
                          value: "studyLanguage",
                        },
                        {
                          label: "Qualification Level",
                          value: "qualificationLevel",
                        },
                        {
                          label: "Qualification Name",
                          value: "qualificationName",
                        },
                        {
                          label: "Info",
                          value: "info",
                        },
                        {
                          label: "Majors",
                          value: "majors",
                        },
                        {
                          label: "Minors",
                          value: "minors",
                        },
                        {
                          label: "Email",
                          value: "email",
                        },
                        {
                          label: "GPA Final Grade",
                          value: "gpaFinalGrade",
                        },
                        {
                          label: "Graduated At",
                          value: "graduatedAt",
                        },
                        {
                          label: "Study Started At",
                          value: "studyStartedAt",
                        },
                        {
                          label: "Study Ended At",
                          value: "studyEndedAt",
                        },
                      ],
                    },
                    "mapping.originalColumnName": { type: "string", isArray: false, isRequired: false, description: "Institution's original column name in upload file" },
                  },
                  editProperties: ["status", "emailDomain", "name", "logo", "stamp", "mapping"],
                  showProperties: ["uuid", "status", "emailDomain", "name", "logo", "stamp", "createdAt", "updatedAt", "mapping"],
                  listProperties: ["uuid", "status", "emailDomain", "name", "createdAt", "updatedAt"],
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }): boolean => {
                        return currentAdmin && ( currentAdmin.role === Role.SUPER_ADMIN );
                      }, 
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }): boolean => {
                        return currentAdmin && ( currentAdmin.role === Role.SUPER_ADMIN );
                      }, 
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }): boolean => {
                        return currentAdmin && ( currentAdmin.role === Role.SUPER_ADMIN );
                      }, 
                    },
                    bulkDelete: { isAccessible: false },
                  },
                },
              },
              {
                resource: { model: dmmf.modelMap.SystemSettings, client: prisma },
                options: {
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }): boolean => {
                        return currentAdmin && ( currentAdmin.role === Role.SUPER_ADMIN );
                      },
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }): boolean => {
                        return currentAdmin && ( currentAdmin.role === Role.SUPER_ADMIN );
                      },
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }): boolean => {
                        return currentAdmin && ( currentAdmin.role === Role.SUPER_ADMIN );
                      },
                    },
                    bulkDelete: { isAccessible: false },
                  },
                },
              },
              {
                resource: { model: dmmf.modelMap.InstitutionStats, client: prisma },
                options: {
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }): boolean => {
                        return currentAdmin && ( currentAdmin.role === Role.SUPER_ADMIN );
                      },
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }): boolean => {
                        return currentAdmin && ( currentAdmin.role === Role.SUPER_ADMIN );
                      },
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }): boolean => {
                        return currentAdmin && ( currentAdmin.role === Role.SUPER_ADMIN );
                      },
                    },
                    bulkDelete: { isAccessible: false },
                  },
                },
              },
              {
                resource: { model: dmmf.modelMap.Credential, client: prisma },
                options: {
                  listProperties: ["uuid", "status"],
                  editProperties: ["status"],
                  showProperties: ["uuid", "status"],
                  actions: {
                    new: { isAccessible: false },
                    show: {
                      isVisible: (context): boolean => {
                        return context.record.params.status !== CredentialStatus.DELETED;
                      },
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }): boolean => {
                        return currentAdmin && ( currentAdmin.role === Role.SUPER_ADMIN );
                      },
                      isVisible: (context): boolean => {
                        return context.record.params.status !== CredentialStatus.DELETED;
                      },
                    },
                    delete: { isAccessible: false },
                    bulkDelete: { isAccessible: false },
                  },
                },
              },
              {
                resource: { model: dmmf.modelMap.SmartContract, client: prisma },
                listProperties: ["id", "status", "deployedAt"],
                options: {
                  actions: {
                    show: { isAccessible: true },
                    list: { isAccessible: true },
                    new: { isAccessible: false },
                    edit: { isAccessible: false },
                    delete: { isAccessible: false },
                    bulkDelete: { isAccessible: false },
                  },
                },
              },
              {
                resource: { model: dmmf.modelMap.Upload, client: prisma },
                options: {
                  actions: {
                    show: { isAccessible: false },
                    list: { isAccessible: false },
                    new: { isAccessible: false },
                    edit: { isAccessible: false },
                    delete: { isAccessible: false },
                    bulkDelete: { isAccessible: false },
                  },
                },
              },
              {
                resource: { model: dmmf.modelMap.Transaction, client: prisma },
                options: {
                  actions: {
                    new: { isAccessible: false },
                    edit: { isAccessible: false },
                    delete: { isAccessible: false },
                    bulkDelete: { isAccessible: false },
                  },
                },
              },
              {
                resource: { model: dmmf.modelMap.Payment, client: prisma },
                options: {
                  actions: {
                    new: { isAccessible: false },
                    edit: { isAccessible: false },
                    delete: { isAccessible: false },
                    bulkDelete: { isAccessible: false },
                  },
                },
              },
            ],
          },
          auth: {
            authenticate: async (email: string, password: string): Promise<CurrentAdmin> => {
              if (email !== "" && password !== "") {
                const user = await prisma.user.findUnique({ where: { email: email } });
                if (user && (user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN)) {
                  if (bcrypt.compareSync(
                    password,
                    user.password,
                    (err, res) => {
                      Logger.error(err, res);
                    },
                  )) {
                    return Promise.resolve<CurrentAdmin>({ email: email, role: user.role });
                  }
                }
              }
            },
            cookieName: "admin",
            cookiePassword: "admin",
          },
        };
      },
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        closeClient: true,
        config: {
          host: config.get("REDIS_HOST"),
          port: 6379,
        },
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get("REDIS_HOST"),
          port: 6379,
        },
      }),
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get("THROTTLE_TTL"),
        limit: config.get("THROTTLE_LIMIT"),
      }),
    }),
    StripeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        apiKey: config.get("STRIPE_SECRET_KEY"),
        apiVersion: "2020-08-27",
      }),
    }),
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DNS,
      tracesSampleRate: 1.0,
      debug: true,
    }),
    UploadModule,
    AwsModule,
    HederaModule,
    CommandModule,
    ActionModule,
    SettingsModule,
    PaymentModule,
    InstitutionModule,
    EmailModule,
    HealthModule,
    StatsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
      path: "*",
      method: RequestMethod.ALL,
    });
  }
}
