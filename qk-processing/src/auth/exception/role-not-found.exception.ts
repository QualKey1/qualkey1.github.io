import { NotFoundException } from "@nestjs/common";
import { Role } from "@prisma/client";

export class RoleNotFoundException extends NotFoundException {
  constructor(role: Role) {
    super(`Role not found ${role}`);
  }
}