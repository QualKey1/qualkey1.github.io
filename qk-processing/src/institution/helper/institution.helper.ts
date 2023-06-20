import { Injectable } from "@nestjs/common";
import { Institution, Prisma } from "@prisma/client";

Injectable();
export class InstitutionHelper {
  public static getQualkeyNamesMapping(institution: Institution): string[] {
    const mapping = institution.mapping;
    const qualkeyNameMapping = [];

    for (const mappingEntry of mapping as Prisma.JsonArray) {
      qualkeyNameMapping.push(mappingEntry["qualkeyName"]);
    }

    return qualkeyNameMapping;
  }
}