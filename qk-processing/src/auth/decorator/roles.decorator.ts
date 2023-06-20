import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { Role } from "@prisma/client";

/**
 * This class helps to set Roles to Metadata
 */
export const Roles = (...roles: Role[]):CustomDecorator => SetMetadata("ROLES_KEY", roles);