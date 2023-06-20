import stream from "stream";

import { Injectable, Logger } from "@nestjs/common";
import { Institution, User } from "@prisma/client";
import * as csv from "csv-parser";

import { CredentialsDataDto } from "../../credentials/dto";

@Injectable()
export class CsvParser {

  public async parseCsv(stream: stream.Readable, authenticatedBy: User, institution: Institution, mapping: string[]): Promise<CredentialsDataDto[]> {
    const credentialDtoArray: CredentialsDataDto[] = [];

    return new Promise((resolve, reject) => {
      stream.pipe(csv({
        headers: mapping,
        skipLines: 1,
      }))
        .on("data", function (data) {
          try {
            const isFullName = null !== data.graduatedFullName && undefined !== data.graduatedFullName && "" !== data.graduatedFullName;
            let fullName;
            if (!isFullName) {
              fullName = [(data.graduatedFirstName ?? ""), (data.graduatedMiddleName ?? ""), (data.graduatedLastName ?? "")].filter((n) => n !== "").join(" ");
            } else {
              fullName = data.graduatedFullName;
            }

            const dto = new CredentialsDataDto();
            dto.institutionUuid = authenticatedBy.institutionUuid;
            dto.email = data.email;
            dto.certificateId = data.certificateId;
            dto.graduatedName = fullName;
            dto.qualificationName = data.qualificationName;
            dto.majors = data.majors;
            dto.minors = data.minors;
            dto.awardingInstitution = institution.name;
            dto.qualificationLevel = data.qualificationLevel;
            dto.awardLevel = data.awardLevel;
            dto.studyLanguage = data.studyLanguage;
            dto.info = data.info;
            dto.gpaFinalGrade = data.gpaFinalGrade;

            dto.authenticatedBy = (authenticatedBy.fullName).trim();
            dto.authenticatedTitle = authenticatedBy.title;
            dto.authenticatedAt = new Date();
            dto.studyStartedAt = (!data.studyStartedAt) ? undefined : new Date(data.studyStartedAt);
            dto.studyEndedAt = (!data.studyEndedAt) ? undefined : new Date(data.studyEndedAt);
            dto.graduatedAt = (!data.graduatedAt) ? undefined : new Date(data.graduatedAt);
            dto.expiresAt = (!data.expiresAt) ? undefined : new Date(data.expiresAt);

            credentialDtoArray.push(dto);
          } catch (err) {
            Logger.error(err, err.stack);
          }
        })
        .on("error", (err) => reject(err))
        .on("end", function () {
          resolve(credentialDtoArray);
        });
    });
  }
}
