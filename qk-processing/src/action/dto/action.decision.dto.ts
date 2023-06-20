import { UserActionType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumberString, IsString } from "class-validator";

import { Decision } from "../enum/decision.enum";

/**
 * Data Transfer Object of the Decision made about Mass-upload, APPROVE or REJECT
 */
export class ActionDecisionDto {
    @IsNumberString()
    @IsNotEmpty()
      actionId: string;

    @IsString()
    @IsNotEmpty()
      subjectUuid: string;

    @IsEnum(UserActionType)
    @IsNotEmpty()
      type: UserActionType;

    @IsEnum(Decision)
    @IsNotEmpty()
      decision: Decision;
}