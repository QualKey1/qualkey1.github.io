import { InjectQueue } from "@nestjs/bull";
import { Injectable, Logger, PreconditionFailedException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Credential, CredentialChange, User } from "@prisma/client";
import { Queue } from "bull";

import { CredentialsDataManipulatedException } from "../common/exception";
import { HederaCredentialInfoDto } from "../hedera/dto/hedera.credential-info.dto";
import { HederaService } from "../hedera/hedera.service";
import { PrismaService } from "../prisma/prisma.service";
import { StatsIncrementerService } from "../stats/stats.incrementer.service";
import { CredentialsHashableDataDto } from "./dto";
import { CredentialsChangedEvent } from "./event";
import { CredentialsChangeFactory } from "./factory/credentials-change.factory";
import { Hasher } from "./helper/hasher";
import { CredentialsChangeRepository } from "./repository/credentials-change.repository";
import { CredentialsRepository } from "./repository/credentials.repository";

/**
 * Class responsible for the logic related to CredentialsChange
 */
@Injectable()
export class CredentialsChangeService {
  private DATE_FIELDS = ["studyStartedAt", "studyEndedAt", "graduatedAt", "expiresAt", "authenticatedAt", "createdAt", "updatedAt"];

  constructor(
      @InjectQueue("credentials-notify") private credentialsNotifyQueue: Queue,
      private readonly credentialsRepository: CredentialsRepository,
      private readonly credentialsChangeRepository: CredentialsChangeRepository,
      private readonly credentialsChangeFactory: CredentialsChangeFactory,
      private readonly hederaService: HederaService,
      private readonly prisma: PrismaService,
      private readonly eventEmitter: EventEmitter2,
      private readonly statsIncrementerService: StatsIncrementerService,
  ) {}

  /**
  * Process credentials change
  */
  public async processCredentialChange(
    changedBy: User,
    credentials: Credential,
    changedTo: string[],
    fieldName: string[],
  ): Promise<CredentialChange> {
    if (! this.areFieldsProcessable(fieldName)) {
      throw new PreconditionFailedException("Date fields can not be processed together with regular text fields, please change dates separately.");
    }

    const hashableDataDto: CredentialsHashableDataDto = CredentialsHashableDataDto.fromCredentials(credentials);
    // check hash with the existing credentials
    const dataHash = Hasher.hash(JSON.stringify(hashableDataDto));
    Logger.debug(`Checking repository hash for credentials (${credentials.uuid}), hash: ${dataHash}`);

    if (! await this.credentialsChangeRepository.hasHash(dataHash)) {
      await this.credentialsNotifyQueue.add("credentials-manipulated", {
        credentialUuid: credentials.uuid,
        institutionName: credentials.awardingInstitution,
      });
      throw new CredentialsDataManipulatedException(credentials.uuid);
    }

    // Increment the count of credential changes for the institution
    const credentialsWithChanges = await this.credentialsRepository.getByUuidWithChanges(credentials.uuid);
    if (1 >= credentialsWithChanges.credentialChanges.length) {
      await this.statsIncrementerService.incrementEditedQualifications(credentials.institutionUuid);
    }

    const credentialsChange: CredentialChange = await this.credentialsChangeRepository.getByHash(dataHash);
    // compare hash with hedera hash
    const credentialsHederaInfoDto: HederaCredentialInfoDto = await this.hederaService.getCredentialChangeDataFromSmartContract(
      credentialsChange.id,
      credentialsChange.smartContractId,
    );

    Logger.debug(`Checking hedera hash for credentials (${credentials.uuid}), hash: ${dataHash}`);
    if (dataHash !== credentialsHederaInfoDto.hash) {
      await this.credentialsNotifyQueue.add("credentials-manipulated", {
        credentialUuid: credentials.uuid,
        institutionName: credentials.awardingInstitution,
      });
      throw new CredentialsDataManipulatedException(credentials.uuid);
    }

    const changedFrom = [];
    for (const field of fieldName) {
      changedFrom.push(credentials[field]);
    }

    for (let i = 0; i < fieldName.length; i++) {
      credentials[fieldName[i]] = changedTo[i];
    }

    // update Credentials
    const updatedCredentials = await this.prisma.credential.update({
      data: {
        certificateId: credentials.certificateId,
        graduatedName: credentials.graduatedName,
        qualificationName: credentials.qualificationName,
        majors: credentials.majors,
        minors: credentials.minors,
        awardingInstitution: credentials.awardingInstitution,
        qualificationLevel: credentials.qualificationLevel,
        awardLevel: credentials.awardLevel,
        studyLanguage: credentials.studyLanguage,
        info: credentials.info,
        gpaFinalGrade: credentials.gpaFinalGrade,
        studyStartedAt: credentials.studyStartedAt,
        studyEndedAt: credentials.studyEndedAt,
        graduatedAt: credentials.graduatedAt,
        expiresAt: credentials.expiresAt,
      },
      where: { did: credentials.did },
    });
    Logger.debug(`Credentials updated - ${credentials.uuid}`);

    const newDataHash = Hasher.hash(JSON.stringify(CredentialsHashableDataDto.fromCredentials(updatedCredentials)));

    // create new CredentialChange
    const newCredentialsChange = await this.credentialsChangeFactory.createFromUpdate(
      updatedCredentials,
      newDataHash,
      changedBy,
      changedFrom,
      changedTo,
      fieldName,
    );
    Logger.debug(`CredentialsChange created - ${newCredentialsChange.id}`);
    // save to Hedera SC
    await this.hederaService.writeCredentialChangeToSmartContract(newCredentialsChange);
    Logger.debug(`CredentialsChange saved to Hedera - ${newCredentialsChange.id}`);

    const credentialsChangedEvent = new CredentialsChangedEvent();
    credentialsChangedEvent.credentials = credentials;
    this.eventEmitter.emit("credentials.changed", credentialsChangedEvent);

    return newCredentialsChange;
  }

  /**
   * Date types can not be processed together with string values. Check if dates are processed separately
   */
  private areFieldsProcessable(fieldName: string[]): boolean {
    let containsDateField = false;
    let containsStringField = false;

    for (const field of fieldName) {
      if (this.DATE_FIELDS.includes(field)) {
        containsDateField = true;
      } else {
        containsStringField = true;
      }
    }

    return !(containsDateField && containsStringField);
  }
}