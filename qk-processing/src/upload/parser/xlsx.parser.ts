import stream from "stream";

import { Injectable, Logger } from "@nestjs/common";
import { Institution, User } from "@prisma/client";
import * as XLSX from "xlsx";

import { CredentialsDataDto } from "../../credentials/dto";

@Injectable()
export class XlsxParser {

  public async parseXlsx(stream: stream.Readable, authenticatedBy: User, institution: Institution, mapping: string[]): Promise<CredentialsDataDto[]> {
    const buffers = [];
    const credentialDtoArray: CredentialsDataDto[] = [];

    return new Promise((resolve, reject) => {
      stream.on("data", (data) => buffers.push(data));
      stream.on("error", (err) => reject(err));
      stream.on("end", () => {
        try {
          const buffer = Buffer.concat(buffers);
          const workbook = XLSX.read(buffer);
          const sheetName: string = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet, { header: mapping });

          json.forEach(data => {
            if (data["email"] === "" || data["email"] === "Email" || data["qualificationName"] === "") {
              return;
            }
            const isFullName = null !== data["graduatedFullName"] && undefined !== data["graduatedFullName"] && "" !== data["graduatedFullName"];
            let fullName;
            if (!isFullName) {
              fullName = [(data["graduatedFirstName"] ?? ""), (data["graduatedMiddleName"] ?? ""), (data["graduatedLastName"] ?? "")].filter((n) => n !== "").join(" ");
            } else {
              fullName = data["graduatedFullName"];
            }

            const dto = new CredentialsDataDto();
            dto.institutionUuid = authenticatedBy.institutionUuid;
            dto.email = data["email"];
            dto.certificateId = data["certificateId"];
            dto.graduatedName = fullName;
            dto.qualificationName = data["qualificationName"];
            dto.majors = data["majors"];
            dto.minors = data["minors"];
            dto.awardingInstitution = institution.name;
            dto.qualificationLevel = data["qualificationLevel"];
            dto.awardLevel = data["awardLevel"];
            dto.studyLanguage = data["studyLanguage"];
            dto.info = data["info"];
            dto.gpaFinalGrade = data["gpaFinalGrade"];

            dto.authenticatedBy = (authenticatedBy.fullName).trim();
            dto.authenticatedTitle = authenticatedBy.title;
            dto.authenticatedAt = new Date();

            dto.studyStartedAt = (!data["studyStartedAt"]) ? undefined : new Date(data["studyStartedAt"]);
            dto.studyEndedAt = (!data["studyEndedAt"]) ? undefined : new Date(data["studyEndedAt"]);
            dto.graduatedAt = (!data["graduatedAt"]) ? undefined : new Date(data["graduatedAt"]);
            dto.expiresAt = (!data["expiresAt"]) ? undefined : new Date(data["expiresAt"]);

            credentialDtoArray.push(dto);
          });
        } catch (err) {
          Logger.error(err, err.stack);
        }
        resolve(credentialDtoArray);
      });
    });
  }
}
